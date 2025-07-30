import { NodeExecutor } from './NodeExecutor';
import { HTTPRequestExecutor } from './executors/HTTPRequestExecutor';
import { LLMChatExecutor } from './executors/LLMChatExecutor';
import { IfConditionExecutor } from './executors/IfConditionExecutor';
import { DelayExecutor } from './executors/DelayExecutor';
import { JSONParserExecutor } from './executors/JSONParserExecutor';

export class ExecutorRegistry {
  private static executors = new Map<string, NodeExecutor>();

  static registerExecutor(nodeTypeId: string, executor: NodeExecutor): void {
    this.executors.set(nodeTypeId, executor);
  }

  static getExecutor(nodeTypeId: string): NodeExecutor | undefined {
    return this.executors.get(nodeTypeId);
  }

  static hasExecutor(nodeTypeId: string): boolean {
    return this.executors.has(nodeTypeId);
  }

  static getAllExecutors(): Map<string, NodeExecutor> {
    return new Map(this.executors);
  }

  static getRegisteredNodeTypes(): string[] {
    return Array.from(this.executors.keys());
  }
}

// Register all built-in executors
export const registerBuiltInExecutors = () => {
  // Action Executors
  ExecutorRegistry.registerExecutor('http_request', new HTTPRequestExecutor());
  
  // AI Executors
  ExecutorRegistry.registerExecutor('llm_chat', new LLMChatExecutor());
  
  // Condition Executors
  ExecutorRegistry.registerExecutor('if_condition', new IfConditionExecutor());
  
  // Utility Executors
  ExecutorRegistry.registerExecutor('delay', new DelayExecutor());
  
  // Data Executors
  ExecutorRegistry.registerExecutor('json_parser', new JSONParserExecutor());
  
  console.log('✅ Built-in executors registered:', ExecutorRegistry.getRegisteredNodeTypes());
};