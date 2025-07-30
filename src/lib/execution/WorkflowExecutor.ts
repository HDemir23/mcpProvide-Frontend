import { Node, Edge } from 'reactflow';
import { ExecutionContext, ExecutionResult, TriggerData, Workflow } from './ExecutionContext';
import { ExecutorRegistry } from './ExecutorRegistry';
import { NodeTypeDefinition } from '../../types/nodeTypes';

export class WorkflowExecutor {
  private workflow: Workflow;
  private executionContext?: ExecutionContext;

  constructor(workflow: Workflow) {
    this.workflow = workflow;
  }

  async execute(trigger?: TriggerData): Promise<ExecutionResult> {
    try {
      // 1. Create execution context
      this.executionContext = new ExecutionContext(this.workflow, trigger);

      // 2. Validate workflow
      const validationErrors = this.executionContext.validateWorkflow();
      if (validationErrors.length > 0) {
        throw new Error(`Workflow validation failed: ${validationErrors.join(', ')}`);
      }

      // 3. Find start nodes (triggers or nodes without dependencies)
      const startNodes = this.findStartNodes();
      if (startNodes.length === 0) {
        throw new Error('No start nodes found in workflow');
      }

      // 4. Execute workflow graph
      const results = await this.executeNodes(startNodes);

      // 5. Return execution result
      const summary = this.executionContext.getExecutionSummary();
      
      return {
        success: !this.executionContext.hasErrors(),
        executionId: this.executionContext.id,
        results,
        duration: summary.duration,
        nodeExecutions: this.executionContext.getAllNodeExecutions()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionId: this.executionContext?.id || 'unknown',
        duration: this.executionContext?.getDuration() || 0,
        nodeExecutions: this.executionContext?.getAllNodeExecutions() || []
      };
    }
  }

  private findStartNodes(): Node[] {
    const nodesWithIncomingEdges = new Set(
      this.workflow.edges.map(edge => edge.target)
    );

    // Find nodes with no incoming edges (start nodes)
    const startNodes = this.workflow.nodes.filter(node => 
      !nodesWithIncomingEdges.has(node.id)
    );

    // Prioritize trigger nodes
    const triggerNodes = startNodes.filter(node => {
      const nodeType = node.data?.nodeType as NodeTypeDefinition;
      return nodeType?.category === 'trigger';
    });

    return triggerNodes.length > 0 ? triggerNodes : startNodes;
  }

  private async executeNodes(nodes: Node[]): Promise<any[]> {
    const results: any[] = [];
    const executedNodes = new Set<string>();

    // Use topological sort to determine execution order
    const executionQueue = [...nodes];
    const maxIterations = this.workflow.nodes.length * 2; // Prevent infinite loops
    let iterations = 0;

    while (executionQueue.length > 0 && iterations < maxIterations) {
      iterations++;
      const currentBatch: Node[] = [];

      // Find nodes that can be executed (all dependencies satisfied)
      for (let i = executionQueue.length - 1; i >= 0; i--) {
        const node = executionQueue[i];
        
        if (this.canExecuteNode(node, executedNodes)) {
          currentBatch.push(node);
          executionQueue.splice(i, 1);
        }
      }

      if (currentBatch.length === 0) {
        // No nodes can be executed - check for circular dependencies
        const remainingNodeIds = executionQueue.map(n => n.id);
        throw new Error(`Circular dependency or missing dependencies detected for nodes: ${remainingNodeIds.join(', ')}`);
      }

      // Execute current batch (can be done in parallel)
      const batchPromises = currentBatch.map(node => this.executeNode(node));
      const batchResults = await Promise.allSettled(batchPromises);

      // Process results and add to execution queue any nodes that are now ready
      batchResults.forEach((result, index) => {
        const node = currentBatch[index];
        executedNodes.add(node.id);

        if (result.status === 'fulfilled' && result.value.success) {
          results.push(result.value);
          
          // Add connected nodes to queue if all their dependencies are now satisfied
          const connectedNodes = this.getConnectedNodes(node);
          connectedNodes.forEach(connectedNode => {
            if (!executedNodes.has(connectedNode.id) && 
                !executionQueue.find(n => n.id === connectedNode.id)) {
              executionQueue.push(connectedNode);
            }
          });
        } else {
          // Node execution failed
          const error = result.status === 'rejected' ? result.reason : result.value.error;
          this.executionContext?.addError(node.id, new Error(error));
        }
      });
    }

    if (iterations >= maxIterations) {
      throw new Error('Execution exceeded maximum iterations - possible infinite loop');
    }

    return results;
  }

  private canExecuteNode(node: Node, executedNodes: Set<string>): boolean {
    // Check if all input dependencies are satisfied
    const inputConnections = this.executionContext?.getNodeInputConnections(node.id) || [];
    
    return inputConnections.every(connection => 
      executedNodes.has(connection.source)
    );
  }

  private async executeNode(node: Node): Promise<any> {
    if (!this.executionContext) {
      throw new Error('Execution context not initialized');
    }

    const nodeType = node.data?.nodeType as NodeTypeDefinition;
    if (!nodeType) {
      throw new Error(`Node ${node.id} missing nodeType definition`);
    }

    // Get the appropriate executor
    const executor = ExecutorRegistry.getExecutor(nodeType.id);
    if (!executor) {
      throw new Error(`No executor found for node type: ${nodeType.id}`);
    }

    try {
      // Execute the node
      const startTime = Date.now();
      const result = await executor.execute(node, this.executionContext);
      
      // Record the execution result
      this.executionContext.setNodeExecutionResult(node.id, result);
      
      // Store output data for connected nodes
      if (result.success && result.data) {
        nodeType.outputs.forEach(output => {
          const outputData = result.data[output.id] || result.data;
          this.executionContext?.setNodeOutputData(node.id, output.id, outputData);
        });
      }

      return result;

    } catch (error) {
      const errorResult = {
        nodeId: node.id,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: 0,
        timestamp: Date.now()
      };

      this.executionContext.setNodeExecutionResult(node.id, errorResult);
      this.executionContext.addError(node.id, error instanceof Error ? error : new Error(String(error)));
      
      return errorResult;
    }
  }

  private getConnectedNodes(node: Node): Node[] {
    const outputConnections = this.executionContext?.getNodeOutputConnections(node.id) || [];
    
    return outputConnections
      .map(connection => this.workflow.nodes.find(n => n.id === connection.target))
      .filter((n): n is Node => n !== undefined);
  }

  // Utility methods for external access
  getExecutionContext(): ExecutionContext | undefined {
    return this.executionContext;
  }

  getWorkflow(): Workflow {
    return this.workflow;
  }

  // Static method to create and execute workflow
  static async executeWorkflow(workflow: Workflow, trigger?: TriggerData): Promise<ExecutionResult> {
    const executor = new WorkflowExecutor(workflow);
    return executor.execute(trigger);
  }
}