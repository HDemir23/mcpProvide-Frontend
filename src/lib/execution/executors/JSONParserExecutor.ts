import { Node } from 'reactflow';
import { BaseNodeExecutor } from '../NodeExecutor';
import { ExecutionContext, NodeExecutionResult } from '../ExecutionContext';

export class JSONParserExecutor extends BaseNodeExecutor {
  async execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult> {
    return this.safeExecute(node.id, async () => {
      // Get properties
      const operation = this.getNodeProperty(node, 'operation', 'parse');
      const jsonPath = this.getNodeProperty(node, 'json_path', '');
      const defaultValue = this.getNodeProperty(node, 'default_value', null);

      // Get input data from connected nodes
      const inputData = context.getConnectedInputData(node.id);
      const jsonInput = inputData.json_input || inputData.default;

      if (jsonInput === undefined || jsonInput === null) {
        throw new Error('No JSON input data provided');
      }

      switch (operation) {
        case 'parse':
          return this.parseOperation(jsonInput, jsonPath, defaultValue);
        
        case 'stringify':
          return this.stringifyOperation(jsonInput);
        
        case 'extract':
          return this.extractOperation(jsonInput, jsonPath, defaultValue);
        
        case 'validate':
          return this.validateOperation(jsonInput);
        
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    });
  }

  private parseOperation(input: any, jsonPath: string, defaultValue: any): any {
    let parsedData: any;

    // Parse JSON if input is string
    if (typeof input === 'string') {
      try {
        parsedData = JSON.parse(input);
      } catch (error) {
        throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      parsedData = input;
    }

    // Extract specific path if provided
    if (jsonPath) {
      const extractedValue = this.extractFromPath(parsedData, jsonPath);
      return {
        parsed_data: extractedValue !== undefined ? extractedValue : defaultValue,
        original_data: parsedData,
        path_used: jsonPath,
        found: extractedValue !== undefined
      };
    }

    return {
      parsed_data: parsedData,
      data_type: Array.isArray(parsedData) ? 'array' : typeof parsedData,
      keys: typeof parsedData === 'object' && parsedData !== null ? Object.keys(parsedData) : []
    };
  }

  private stringifyOperation(input: any): any {
    try {
      const stringified = JSON.stringify(input, null, 2);
      return {
        stringified_data: stringified,
        original_type: Array.isArray(input) ? 'array' : typeof input,
        size: stringified.length
      };
    } catch (error) {
      throw new Error(`Failed to stringify data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractOperation(input: any, jsonPath: string, defaultValue: any): any {
    if (!jsonPath) {
      throw new Error('JSON path is required for extract operation');
    }

    let data = input;
    
    // Parse if string
    if (typeof input === 'string') {
      try {
        data = JSON.parse(input);
      } catch {
        throw new Error('Input is not valid JSON');
      }
    }

    const extractedValue = this.extractFromPath(data, jsonPath);
    
    return {
      extracted_value: extractedValue !== undefined ? extractedValue : defaultValue,
      path_used: jsonPath,
      found: extractedValue !== undefined,
      data_type: typeof extractedValue
    };
  }

  private validateOperation(input: any): any {
    let isValid = true;
    let errorMessage = '';
    let parsedData = null;

    if (typeof input === 'string') {
      try {
        parsedData = JSON.parse(input);
      } catch (error) {
        isValid = false;
        errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
      }
    } else {
      // Try to stringify and parse to validate structure
      try {
        JSON.stringify(input);
        parsedData = input;
      } catch (error) {
        isValid = false;
        errorMessage = 'Data contains non-serializable values';
      }
    }

    return {
      is_valid: isValid,
      error_message: errorMessage,
      parsed_data: parsedData,
      input_type: typeof input
    };
  }

  private extractFromPath(data: any, path: string): any {
    // Simple JSONPath-like extraction
    // Supports: $.field, $.field.subfield, $.array[0], $.field[0].subfield
    
    if (!path.startsWith('$.')) {
      path = '$.' + path;
    }

    // Remove the leading $.
    const pathParts = path.substring(2).split('.');
    let current = data;

    for (const part of pathParts) {
      if (current === null || current === undefined) {
        return undefined;
      }

      // Handle array access
      const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, field, indexStr] = arrayMatch;
        const index = parseInt(indexStr);
        
        if (field) {
          current = current[field];
        }
        
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