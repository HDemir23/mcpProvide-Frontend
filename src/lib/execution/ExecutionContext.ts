import { Node, Edge } from 'reactflow';
import { NodeTypeDefinition } from '../../types/nodeTypes';

export interface ExecutionResult {
  success: boolean;
  executionId: string;
  results?: any[];
  duration?: number;
  nodeExecutions?: NodeExecutionResult[];
  error?: string;
}

export interface NodeExecutionResult {
  nodeId: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  timestamp: number;
}

export interface TriggerData {
  type: string;
  data: any;
  timestamp: number;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  active: boolean;
}

export class ExecutionContext {
  public readonly id: string;
  public readonly workflow: Workflow;
  public readonly triggerData?: TriggerData;
  private startTime: number;
  private nodeExecutions: Map<string, NodeExecutionResult> = new Map();
  private nodeData: Map<string, any> = new Map();
  private connectionData: Map<string, any> = new Map();
  private errors: Map<string, Error> = new Map();
  private executionOrder: string[] = [];

  constructor(workflow: Workflow, triggerData?: TriggerData) {
    this.id = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.workflow = workflow;
    this.triggerData = triggerData;
    this.startTime = Date.now();
  }

  // Node execution tracking
  setNodeExecutionResult(nodeId: string, result: NodeExecutionResult): void {
    this.nodeExecutions.set(nodeId, result);
    this.executionOrder.push(nodeId);
    
    if (result.success && result.data) {
      this.nodeData.set(nodeId, result.data);
    }
  }

  getNodeExecutionResult(nodeId: string): NodeExecutionResult | undefined {
    return this.nodeExecutions.get(nodeId);
  }

  getAllNodeExecutions(): NodeExecutionResult[] {
    return Array.from(this.nodeExecutions.values());
  }

  // Node data management
  setNodeInputData(nodeId: string, data: any): void {
    this.nodeData.set(`${nodeId}_input`, data);
  }

  getNodeInputData(nodeId: string): any {
    return this.nodeData.get(`${nodeId}_input`);
  }

  setNodeOutputData(nodeId: string, outputId: string, data: any): void {
    this.nodeData.set(`${nodeId}_${outputId}`, data);
  }

  getNodeOutputData(nodeId: string, outputId?: string): any {
    if (outputId) {
      return this.nodeData.get(`${nodeId}_${outputId}`);
    }
    return this.nodeData.get(nodeId);
  }

  // Connection data flow
  setConnectionData(connectionId: string, data: any): void {
    this.connectionData.set(connectionId, data);
  }

  getConnectionData(connectionId: string): any {
    return this.connectionData.get(connectionId);
  }

  // Error handling
  addError(nodeId: string, error: Error): void {
    this.errors.set(nodeId, error);
  }

  getError(nodeId: string): Error | undefined {
    return this.errors.get(nodeId);
  }

  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  getAllErrors(): Array<{ nodeId: string; error: Error }> {
    return Array.from(this.errors.entries()).map(([nodeId, error]) => ({
      nodeId,
      error
    }));
  }

  // Timing
  getDuration(): number {
    return Date.now() - this.startTime;
  }

  getStartTime(): number {
    return this.startTime;
  }

  // Execution flow analysis
  getExecutionOrder(): string[] {
    return [...this.executionOrder];
  }

  getSuccessfulNodes(): string[] {
    return Array.from(this.nodeExecutions.entries())
      .filter(([_, result]) => result.success)
      .map(([nodeId]) => nodeId);
  }

  getFailedNodes(): string[] {
    return Array.from(this.nodeExecutions.entries())
      .filter(([_, result]) => !result.success)
      .map(([nodeId]) => nodeId);
  }

  // Node dependency tracking
  getNodeInputConnections(nodeId: string): Edge[] {
    return this.workflow.edges.filter(edge => edge.target === nodeId);
  }

  getNodeOutputConnections(nodeId: string): Edge[] {
    return this.workflow.edges.filter(edge => edge.source === nodeId);
  }

  getConnectedInputData(nodeId: string): Record<string, any> {
    const inputConnections = this.getNodeInputConnections(nodeId);
    const inputData: Record<string, any> = {};

    inputConnections.forEach(connection => {
      const sourceData = this.getNodeOutputData(
        connection.source, 
        connection.sourceHandle || undefined
      );
      
      if (sourceData !== undefined) {
        const targetHandle = connection.targetHandle || 'default';
        inputData[targetHandle] = sourceData;
      }
    });

    return inputData;
  }

  // Workflow validation
  validateWorkflow(): string[] {
    const errors: string[] = [];

    // Check for nodes without connections (except triggers)
    this.workflow.nodes.forEach(node => {
      const nodeType = node.data?.nodeType as NodeTypeDefinition;
      if (!nodeType) {
        errors.push(`Node ${node.id} missing nodeType definition`);
        return;
      }

      // Check if trigger nodes exist
      if (nodeType.category === 'trigger') {
        const hasOutputConnections = this.getNodeOutputConnections(node.id).length > 0;
        if (!hasOutputConnections) {
          errors.push(`Trigger node ${node.id} has no output connections`);
        }
      }

      // Check required inputs
      const requiredInputs = nodeType.inputs.filter(input => input.required);
      const inputConnections = this.getNodeInputConnections(node.id);
      
      requiredInputs.forEach(requiredInput => {
        const hasConnection = inputConnections.some(
          conn => conn.targetHandle === requiredInput.id
        );
        if (!hasConnection) {
          errors.push(`Node ${node.id} missing required input: ${requiredInput.name}`);
        }
      });
    });

    // Check for cycles (basic detection)
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outputConnections = this.getNodeOutputConnections(nodeId);
      for (const connection of outputConnections) {
        if (hasCycle(connection.target)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    this.workflow.nodes.forEach(node => {
      if (!visited.has(node.id) && hasCycle(node.id)) {
        errors.push(`Circular dependency detected involving node ${node.id}`);
      }
    });

    return errors;
  }

  // Utility methods
  isNodeExecuted(nodeId: string): boolean {
    return this.nodeExecutions.has(nodeId);
  }

  isNodeSuccessful(nodeId: string): boolean {
    const result = this.nodeExecutions.get(nodeId);
    return result?.success === true;
  }

  getExecutionSummary(): {
    total: number;
    successful: number;
    failed: number;
    duration: number;
    errors: number;
  } {
    const total = this.nodeExecutions.size;
    const successful = this.getSuccessfulNodes().length;
    const failed = this.getFailedNodes().length;
    const errors = this.errors.size;
    const duration = this.getDuration();

    return { total, successful, failed, duration, errors };
  }
}