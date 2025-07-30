import { Node } from 'reactflow';
import { BaseNodeExecutor } from '../NodeExecutor';
import { ExecutionContext, NodeExecutionResult } from '../ExecutionContext';

export class LLMChatExecutor extends BaseNodeExecutor {
  async execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult> {
    return this.safeExecute(node.id, async () => {
      // Get properties
      const model = this.getNodeProperty(node, 'model', 'gpt-4');
      const temperature = this.getNodeProperty(node, 'temperature', 0.7);
      const maxTokens = this.getNodeProperty(node, 'max_tokens', 1000);
      const systemPrompt = this.getNodeProperty(node, 'system_prompt', '');

      // Get input data from connected nodes
      const inputData = context.getConnectedInputData(node.id);
      const prompt = inputData.prompt_input || inputData.default || '';
      const contextInput = inputData.context_input || '';

      if (!prompt) {
        throw new Error('No prompt provided');
      }

      // Build messages array
      const messages = [];
      
      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }

      if (contextInput) {
        messages.push({
          role: 'user',
          content: `Context: ${contextInput}`
        });
      }

      messages.push({
        role: 'user',
        content: prompt
      });

      // Call the appropriate LLM API based on model
      const response = await this.callLLMAPI(model, {
        messages,
        temperature,
        max_tokens: maxTokens
      });

      return {
        ai_response: response.content,
        token_usage: response.usage,
        model_used: model,
        finish_reason: response.finish_reason
      };
    });
  }

  private async callLLMAPI(model: string, options: any): Promise<any> {
    // This is a mock implementation - in real scenario, you'd call actual APIs
    const { messages, temperature, max_tokens } = options;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock response based on model
    const mockResponses = {
      'gpt-4': {
        content: `GPT-4 Response: I understand your request. ${messages[messages.length - 1].content.substring(0, 100)}...`,
        usage: { prompt_tokens: 50, completion_tokens: 75, total_tokens: 125 },
        finish_reason: 'stop'
      },
      'gpt-3.5-turbo': {
        content: `GPT-3.5 Response: ${messages[messages.length - 1].content.substring(0, 80)}...`,
        usage: { prompt_tokens: 45, completion_tokens: 60, total_tokens: 105 },
        finish_reason: 'stop'
      },
      'claude-3-opus': {
        content: `Claude Response: I'll help you with that. ${messages[messages.length - 1].content.substring(0, 90)}...`,
        usage: { prompt_tokens: 48, completion_tokens: 70, total_tokens: 118 },
        finish_reason: 'stop'
      },
      'claude-3-sonnet': {
        content: `Claude Sonnet Response: ${messages[messages.length - 1].content.substring(0, 85)}...`,
        usage: { prompt_tokens: 46, completion_tokens: 65, total_tokens: 111 },
        finish_reason: 'stop'
      },
      'gemini-pro': {
        content: `Gemini Response: ${messages[messages.length - 1].content.substring(0, 95)}...`,
        usage: { prompt_tokens: 52, completion_tokens: 78, total_tokens: 130 },
        finish_reason: 'stop'
      }
    };

    return mockResponses[model as keyof typeof mockResponses] || mockResponses['gpt-4'];
  }
}