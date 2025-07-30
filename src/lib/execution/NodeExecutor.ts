import { Node } from 'reactflow';
import { ExecutionContext, NodeExecutionResult } from './ExecutionContext';

export interface NodeExecutor {
  execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult>;
}

export abstract class BaseNodeExecutor implements NodeExecutor {
  abstract execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult>;

  protected createResult(
    nodeId: string,
    success: boolean,
    data?: any,
    error?: string,
    duration: number = 0
  ): NodeExecutionResult {
    return {
      nodeId,
      success,
      data,
      error,
      duration,
      timestamp: Date.now()
    };
  }

  protected async safeExecute(
    nodeId: string,
    executionFn: () => Promise<any>
  ): Promise<NodeExecutionResult> {
    const startTime = Date.now();
    
    try {
      const result = await executionFn();
      const duration = Date.now() - startTime;
      
      return this.createResult(nodeId, true, result, undefined, duration);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return this.createResult(nodeId, false, undefined, errorMessage, duration);
    }
  }

  protected getNodeProperty(node: Node, propertyName: string, defaultValue?: any): any {
    return node.data?.properties?.[propertyName] ?? defaultValue;
  }

  protected validateRequiredProperties(node: Node, requiredProps: string[]): string[] {
    const errors: string[] = [];
    const properties = node.data?.properties || {};
    
    requiredProps.forEach(prop => {
      if (properties[prop] === undefined || properties[prop] === null || properties[prop] === '') {
        errors.push(`Missing required property: ${prop}`);
      }
    });
    
    return errors;
  }
}