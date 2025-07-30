import { Node } from 'reactflow';
import { BaseNodeExecutor } from '../NodeExecutor';
import { ExecutionContext, NodeExecutionResult } from '../ExecutionContext';

export class IfConditionExecutor extends BaseNodeExecutor {
  async execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult> {
    return this.safeExecute(node.id, async () => {
      // Get input data from connected nodes
      const inputData = context.getConnectedInputData(node.id);
      const conditionInput = inputData.condition_input;

      if (conditionInput === undefined || conditionInput === null) {
        throw new Error('No input data provided for condition evaluation');
      }

      // Get condition configuration
      const conditions = this.getNodeProperty(node, 'conditions', []);
      const operator = this.getNodeProperty(node, 'operator', 'AND');

      // If no conditions are configured, default to truthy check
      if (!conditions || conditions.length === 0) {
        const result = Boolean(conditionInput);
        return {
          condition_result: result,
          input_data: conditionInput,
          output_path: result ? 'true_output' : 'false_output'
        };
      }

      // Evaluate each condition
      const conditionResults = conditions.map((condition: any) => {
        return this.evaluateCondition(conditionInput, condition);
      });

      // Apply operator (AND/OR)
      let finalResult: boolean;
      if (operator === 'OR') {
        finalResult = conditionResults.some((result: boolean) => result);
      } else { // AND
        finalResult = conditionResults.every((result: boolean) => result);
      }

      return {
        condition_result: finalResult,
        individual_results: conditionResults,
        input_data: conditionInput,
        output_path: finalResult ? 'true_output' : 'false_output',
        operator_used: operator
      };
    });
  }

  private evaluateCondition(data: any, condition: any): boolean {
    const { field, operator, value } = condition;
    
    // Get field value from data
    const fieldValue = this.getFieldValue(data, field);
    
    // Evaluate based on operator
    switch (operator) {
      case 'equals':
        return fieldValue == value; // Loose equality
      case 'not_equals':
        return fieldValue != value;
      case 'greater_than':
        return Number(fieldValue) > Number(value);
      case 'less_than':
        return Number(fieldValue) < Number(value);
      case 'greater_than_or_equal':
        return Number(fieldValue) >= Number(value);
      case 'less_than_or_equal':
        return Number(fieldValue) <= Number(value);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'starts_with':
        return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
      case 'ends_with':
        return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
      case 'is_empty':
        return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'is_not_empty':
        return Boolean(fieldValue) && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      case 'regex':
        try {
          const regex = new RegExp(value);
          return regex.test(String(fieldValue));
        } catch {
          return false;
        }
      default:
        return Boolean(fieldValue);
    }
  }

  private getFieldValue(data: any, fieldPath: string): any {
    if (!fieldPath) return data;
    
    const parts = fieldPath.split('.');
    let current = data;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      
      // Handle array indices
      if (part.includes('[') && part.includes(']')) {
        const [field, indexStr] = part.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        current = current[field];
        
        if (Array.isArray(current) && index >= 0 && index < current.length) {
          current = current[index];
        } else {
          return undefined;
        }
      } else {
        current = current[part];
      }
    }
    
    return current;
  }
}