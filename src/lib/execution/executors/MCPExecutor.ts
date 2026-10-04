import { Node } from 'reactflow';
import { NodeExecutor } from '../NodeExecutor';
import { ExecutionContext, NodeExecutionResult } from '../ExecutionContext';
import { NodeTypeDefinition } from '../../../types/nodeTypes';

export class MCPExecutor implements NodeExecutor {
  async execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult> {
    const { tool_name, parameters } = node.data.properties;
    const inputData = context.getNodeInputData(node.id);
    const startTime = Date.now();

    try {
      // Simulate calling an MCP tool/resource
      const mcpResponse = await this.callMCPTool(tool_name, parameters, inputData);
      const duration = Date.now() - startTime;

      return {
        nodeId: node.id,
        success: true,
        data: {
          output_data: mcpResponse,
        },
        duration,
        timestamp: startTime
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        nodeId: node.id,
        success: false,
        error: error.message,
        duration,
        timestamp: startTime
      };
    }
  }

  private async callMCPTool(toolName: string, params: string, inputData: any): Promise<any> {
    // This is a placeholder for actual MCP server interaction.
    // In a real scenario, this would involve making an API call to the MCP server.
    console.log(`Simulating MCP call to tool: ${toolName} with params: ${params} and input:`, inputData);

    // Simulate different responses based on toolName for testing purposes
    if (toolName === 'search_web') {
      return {
        results: [
          { title: 'Simulated Search Result 1', url: 'http://example.com/1' },
          { title: 'Simulated Search Result 2', url: 'http://example.com/2' },
        ],
        query: inputData.prompt || 'default search',
      };
    } else if (toolName === 'generate_image') {
      return {
        imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Simulated+Image',
        description: inputData.prompt || 'default image',
      };
    } else if (toolName === 'error_tool') {
      throw new Error('Simulated MCP tool error: Something went wrong!');
    } else {
      return {
        message: `MCP tool '${toolName}' executed successfully (simulated).`,
        receivedParams: JSON.parse(params || '{}'),
        receivedInput: inputData,
      };
    }
  }
}