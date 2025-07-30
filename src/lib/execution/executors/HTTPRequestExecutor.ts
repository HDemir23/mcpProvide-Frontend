import { Node } from 'reactflow';
import { BaseNodeExecutor } from '../NodeExecutor';
import { ExecutionContext, NodeExecutionResult } from '../ExecutionContext';

export class HTTPRequestExecutor extends BaseNodeExecutor {
  async execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult> {
    return this.safeExecute(node.id, async () => {
      // Validate required properties
      const requiredProps = ['url'];
      const validationErrors = this.validateRequiredProperties(node, requiredProps);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Get properties
      const method = this.getNodeProperty(node, 'method', 'GET').toUpperCase();
      const url = this.getNodeProperty(node, 'url');
      const headers = this.parseJSON(this.getNodeProperty(node, 'headers', '{}'));
      const body = this.parseJSON(this.getNodeProperty(node, 'body', '{}'));
      const timeout = this.getNodeProperty(node, 'timeout', 30000);

      // Get input data from connected nodes
      const inputData = context.getConnectedInputData(node.id);
      
      // Merge input data with body if applicable
      const requestBody = method !== 'GET' ? {
        ...body,
        ...(inputData.trigger_input || {})
      } : undefined;

      // Set up request options
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: AbortSignal.timeout(timeout)
      };

      if (requestBody && method !== 'GET') {
        requestOptions.body = JSON.stringify(requestBody);
      }

      // Make the HTTP request
      const response = await fetch(url, requestOptions);
      
      // Parse response
      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Return structured response data
      return {
        response: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      };
    });
  }

  private parseJSON(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch {
      return {};
    }
  }
}