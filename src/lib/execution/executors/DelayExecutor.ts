import { Node } from 'reactflow';
import { BaseNodeExecutor } from '../NodeExecutor';
import { ExecutionContext, NodeExecutionResult } from '../ExecutionContext';

export class DelayExecutor extends BaseNodeExecutor {
  async execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult> {
    return this.safeExecute(node.id, async () => {
      // Get properties
      const delayAmount = this.getNodeProperty(node, 'delay_amount', 1000);
      const delayUnit = this.getNodeProperty(node, 'delay_unit', 'milliseconds');

      // Get input data from connected nodes
      const inputData = context.getConnectedInputData(node.id);
      const passThrough = inputData.delay_input || inputData.default;

      // Convert delay to milliseconds
      let delayMs: number;
      switch (delayUnit) {
        case 'seconds':
          delayMs = delayAmount * 1000;
          break;
        case 'minutes':
          delayMs = delayAmount * 60 * 1000;
          break;
        case 'milliseconds':
        default:
          delayMs = delayAmount;
          break;
      }

      // Validate delay amount
      if (delayMs < 0) {
        throw new Error('Delay amount cannot be negative');
      }

      if (delayMs > 300000) { // 5 minutes max
        throw new Error('Delay amount cannot exceed 5 minutes');
      }

      const startTime = Date.now();
      
      // Perform the delay
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      const actualDelay = Date.now() - startTime;

      return {
        delayed_data: passThrough,
        delay_configured: delayMs,
        delay_actual: actualDelay,
        delay_unit: delayUnit,
        timestamp: Date.now()
      };
    });
  }
}