import { Node } from 'reactflow';
import { BaseNodeExecutor } from '../NodeExecutor';
import { ExecutionContext, NodeExecutionResult } from '../ExecutionContext';

interface TaskAssignment {
  taskType: string;
  model: string;
  prompt: string;
  priority: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  retryCount: number;
}

interface AIResponse {
  content: string;
  usage: any;
  model: string;
  quality_score?: number;
}

export class AIAgentExecutor extends BaseNodeExecutor {
  async execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult> {
    return this.safeExecute(node.id, async () => {
      // Get properties
      const primaryModel = this.getNodeProperty(node, 'primary_model', 'gemini-2.5-pro');
      const taskConfigJson = this.getNodeProperty(node, 'task_config', '{}');
      const coordinationStrategy = this.getNodeProperty(node, 'coordination_strategy', 'hierarchical');
      const taskTimeout = this.getNodeProperty(node, 'task_timeout', 60);
      const qualityThreshold = this.getNodeProperty(node, 'quality_threshold', 0.8);
      const retryFailedTasks = this.getNodeProperty(node, 'retry_failed_tasks', true);
      const maxRetries = this.getNodeProperty(node, 'max_retries', 2);
      const managerInstructions = this.getNodeProperty(node, 'manager_instructions', '');
      const finalReview = this.getNodeProperty(node, 'final_review', true);

      // Get input data
      const inputData = context.getConnectedInputData(node.id);
      const taskInput = inputData.task_input || '';
      const contextInput = inputData.context_input || {};
      const aiResponses = inputData.ai_responses || [];

      if (!taskInput) {
        throw new Error('No task provided');
      }

      // Parse task configuration
      let taskConfig: Record<string, string>;
      try {
        taskConfig = JSON.parse(taskConfigJson);
      } catch (error) {
        throw new Error('Invalid task configuration JSON');
      }

      // Step 1: Use primary model to analyze and break down the task
      const taskBreakdown = await this.analyzeAndBreakdownTask(
        primaryModel,
        taskInput,
        contextInput,
        taskConfig,
        managerInstructions
      );

      // Step 2: Create task assignments
      const taskAssignments = this.createTaskAssignments(taskBreakdown, taskConfig);

      // Step 3: Execute tasks based on coordination strategy
      const executionResults = await this.executeTasks(
        taskAssignments,
        coordinationStrategy,
        taskTimeout,
        qualityThreshold,
        retryFailedTasks,
        maxRetries
      );

      // Step 4: Final review and integration (if enabled)
      let finalResult;
      if (finalReview) {
        finalResult = await this.conductFinalReview(
          primaryModel,
          taskInput,
          executionResults,
          managerInstructions
        );
      } else {
        finalResult = this.integrateResults(executionResults);
      }

      return {
        delegated_tasks: taskAssignments.map(task => ({
          taskType: task.taskType,
          model: task.model,
          status: task.status,
          result: task.result
        })),
        final_result: finalResult,
        task_assignments: {
          total_tasks: taskAssignments.length,
          completed_tasks: taskAssignments.filter(t => t.status === 'completed').length,
          failed_tasks: taskAssignments.filter(t => t.status === 'failed').length,
          coordination_strategy: coordinationStrategy,
          execution_time: Date.now()
        }
      };
    });
  }

  private async analyzeAndBreakdownTask(
    primaryModel: string,
    taskInput: string,
    contextInput: any,
    taskConfig: Record<string, string>,
    managerInstructions: string
  ): Promise<any> {
    const analysisPrompt = `
${managerInstructions || 'You are an AI coordinator managing multiple specialized AI models.'}

Task Configuration:
${JSON.stringify(taskConfig, null, 2)}

Main Task: ${taskInput}

Context: ${JSON.stringify(contextInput, null, 2)}

Please analyze this task and break it down into subtasks that can be delegated to the available AI models based on the task configuration. 

For each subtask, specify:
1. Task type (must match one from the configuration)
2. Specific instructions for the assigned model
3. Priority (1-10, where 10 is highest)
4. Dependencies (which other subtasks must complete first)

Return your response as a JSON array of subtasks.
`;

    const response = await this.callLLMAPI(primaryModel, {
      messages: [{ role: 'user', content: analysisPrompt }],
      temperature: 0.3,
      max_tokens: 2000
    });

    try {
      return JSON.parse(response.content);
    } catch {
      // Fallback if JSON parsing fails
      return this.createDefaultTaskBreakdown(taskInput, taskConfig);
    }
  }

  private createTaskAssignments(taskBreakdown: any[], taskConfig: Record<string, string>): TaskAssignment[] {
    return taskBreakdown.map((task, index) => ({
      taskType: task.taskType || `task_${index}`,
      model: taskConfig[task.taskType] || Object.values(taskConfig)[0] || 'gpt-4',
      prompt: task.instructions || task.prompt || `Complete this task: ${task.description}`,
      priority: task.priority || 5,
      status: 'pending',
      retryCount: 0
    }));
  }

  private async executeTasks(
    taskAssignments: TaskAssignment[],
    strategy: string,
    timeout: number,
    qualityThreshold: number,
    retryFailedTasks: boolean,
    maxRetries: number
  ): Promise<TaskAssignment[]> {
    switch (strategy) {
      case 'sequential':
        return this.executeSequentially(taskAssignments, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      case 'parallel':
        return this.executeInParallel(taskAssignments, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      case 'hierarchical':
        return this.executeHierarchically(taskAssignments, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      case 'collaborative':
        return this.executeCollaboratively(taskAssignments, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      default:
        return this.executeInParallel(taskAssignments, timeout, qualityThreshold, retryFailedTasks, maxRetries);
    }
  }

  private async executeInParallel(
    tasks: TaskAssignment[],
    timeout: number,
    qualityThreshold: number,
    retryFailedTasks: boolean,
    maxRetries: number
  ): Promise<TaskAssignment[]> {
    const promises = tasks.map(task => this.executeTask(task, timeout, qualityThreshold, retryFailedTasks, maxRetries));
    return Promise.all(promises);
  }

  private async executeSequentially(
    tasks: TaskAssignment[],
    timeout: number,
    qualityThreshold: number,
    retryFailedTasks: boolean,
    maxRetries: number
  ): Promise<TaskAssignment[]> {
    const sortedTasks = tasks.sort((a, b) => b.priority - a.priority);
    const results: TaskAssignment[] = [];

    for (const task of sortedTasks) {
      const result = await this.executeTask(task, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      results.push(result);
    }

    return results;
  }

  private async executeHierarchically(
    tasks: TaskAssignment[],
    timeout: number,
    qualityThreshold: number,
    retryFailedTasks: boolean,
    maxRetries: number
  ): Promise<TaskAssignment[]> {
    // Execute high priority tasks first, then medium, then low
    const highPriority = tasks.filter(t => t.priority >= 8);
    const mediumPriority = tasks.filter(t => t.priority >= 5 && t.priority < 8);
    const lowPriority = tasks.filter(t => t.priority < 5);

    const results: TaskAssignment[] = [];

    // Execute high priority tasks in parallel
    if (highPriority.length > 0) {
      const highResults = await this.executeInParallel(highPriority, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      results.push(...highResults);
    }

    // Execute medium priority tasks in parallel
    if (mediumPriority.length > 0) {
      const mediumResults = await this.executeInParallel(mediumPriority, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      results.push(...mediumResults);
    }

    // Execute low priority tasks sequentially
    for (const task of lowPriority) {
      const result = await this.executeTask(task, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      results.push(result);
    }

    return results;
  }

  private async executeCollaboratively(
    tasks: TaskAssignment[],
    timeout: number,
    qualityThreshold: number,
    retryFailedTasks: boolean,
    maxRetries: number
  ): Promise<TaskAssignment[]> {
    // In collaborative mode, tasks are executed and results can be shared between models
    const results: TaskAssignment[] = [];
    const sharedContext: any = {};

    for (const task of tasks.sort((a, b) => b.priority - a.priority)) {
      // Include shared context in the task prompt
      const enhancedPrompt = `${task.prompt}\n\nShared Context from other tasks:\n${JSON.stringify(sharedContext, null, 2)}`;
      const enhancedTask = { ...task, prompt: enhancedPrompt };
      
      const result = await this.executeTask(enhancedTask, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      results.push(result);

      // Add result to shared context for future tasks
      if (result.status === 'completed' && result.result) {
        sharedContext[result.taskType] = result.result;
      }
    }

    return results;
  }

  private async executeTask(
    task: TaskAssignment,
    timeout: number,
    qualityThreshold: number,
    retryFailedTasks: boolean,
    maxRetries: number
  ): Promise<TaskAssignment> {
    task.status = 'running';

    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Task timeout')), timeout * 1000)
      );

      const executionPromise = this.callLLMAPI(task.model, {
        messages: [{ role: 'user', content: task.prompt }],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = await Promise.race([executionPromise, timeoutPromise]) as AIResponse;
      
      // Evaluate quality (mock implementation)
      const qualityScore = this.evaluateResponseQuality(response.content);
      
      if (qualityScore >= qualityThreshold) {
        task.status = 'completed';
        task.result = {
          content: response.content,
          usage: response.usage,
          model: response.model,
          quality_score: qualityScore
        };
      } else if (retryFailedTasks && task.retryCount < maxRetries) {
        task.retryCount++;
        return this.executeTask(task, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      } else {
        task.status = 'failed';
        task.result = { error: 'Quality threshold not met', quality_score: qualityScore };
      }

    } catch (error) {
      if (retryFailedTasks && task.retryCount < maxRetries) {
        task.retryCount++;
        return this.executeTask(task, timeout, qualityThreshold, retryFailedTasks, maxRetries);
      } else {
        task.status = 'failed';
        task.result = { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return task;
  }

  private async conductFinalReview(
    primaryModel: string,
    originalTask: string,
    executionResults: TaskAssignment[],
    managerInstructions: string
  ): Promise<any> {
    const reviewPrompt = `
${managerInstructions || 'You are an AI coordinator reviewing completed tasks.'}

Original Task: ${originalTask}

Completed Task Results:
${JSON.stringify(executionResults.map(r => ({ 
  taskType: r.taskType, 
  model: r.model, 
  status: r.status, 
  result: r.result 
})), null, 2)}

Please review all the completed tasks and provide a final integrated result that addresses the original task. 
Combine insights from all successful tasks and note any issues with failed tasks.

Return your response as a structured JSON object with the following format:
{
  "summary": "Overall summary of the task completion",
  "integrated_result": "The final integrated result",
  "task_analysis": {
    "successful_tasks": number,
    "failed_tasks": number,
    "quality_assessment": "Overall quality assessment"
  },
  "recommendations": "Any recommendations for improvement"
}
`;

    const response = await this.callLLMAPI(primaryModel, {
      messages: [{ role: 'user', content: reviewPrompt }],
      temperature: 0.3,
      max_tokens: 2000
    });

    try {
      return JSON.parse(response.content);
    } catch {
      return {
        summary: "Task coordination completed",
        integrated_result: response.content,
        task_analysis: {
          successful_tasks: executionResults.filter(r => r.status === 'completed').length,
          failed_tasks: executionResults.filter(r => r.status === 'failed').length,
          quality_assessment: "Review completed"
        }
      };
    }
  }

  private integrateResults(executionResults: TaskAssignment[]): any {
    const successful = executionResults.filter(r => r.status === 'completed');
    const failed = executionResults.filter(r => r.status === 'failed');

    return {
      summary: `Completed ${successful.length} of ${executionResults.length} tasks`,
      results: successful.map(r => ({
        taskType: r.taskType,
        model: r.model,
        result: r.result
      })),
      failed_tasks: failed.map(r => ({
        taskType: r.taskType,
        model: r.model,
        error: r.result?.error
      }))
    };
  }

  private evaluateResponseQuality(content: string): number {
    // Mock quality evaluation - in real implementation, this could use more sophisticated metrics
    const length = content.length;
    const hasStructure = content.includes('\n') || content.includes(',') || content.includes('.');
    const isNotEmpty = length > 10;
    
    let score = 0.5; // Base score
    if (isNotEmpty) score += 0.2;
    if (hasStructure) score += 0.2;
    if (length > 100) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private createDefaultTaskBreakdown(taskInput: string, taskConfig: Record<string, string>): any[] {
    // Fallback task breakdown if primary model fails to parse
    return Object.keys(taskConfig).map((taskType, index) => ({
      taskType,
      instructions: `Handle the ${taskType} aspects of: ${taskInput}`,
      priority: 5,
      dependencies: []
    }));
  }

  private async callLLMAPI(model: string, options: any): Promise<any> {
    // Extended mock implementation with new models
    const { messages, temperature, max_tokens } = options;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const mockResponses = {
      'gemini-2.5-pro': {
        content: `Gemini 2.5 Pro: I'll coordinate this efficiently. ${messages[messages.length - 1].content.substring(0, 120)}...`,
        usage: { prompt_tokens: 60, completion_tokens: 90, total_tokens: 150 },
        model: 'gemini-2.5-pro'
      },
      'claude-4': {
        content: `Claude 4: I understand the requirements. ${messages[messages.length - 1].content.substring(0, 110)}...`,
        usage: { prompt_tokens: 55, completion_tokens: 85, total_tokens: 140 },
        model: 'claude-4'
      },
      'claude-3.5-sonnet': {
        content: `Claude 3.5 Sonnet: I'll handle this with precision. ${messages[messages.length - 1].content.substring(0, 100)}...`,
        usage: { prompt_tokens: 50, completion_tokens: 80, total_tokens: 130 },
        model: 'claude-3.5-sonnet'
      },
      'gpt-4o': {
        content: `GPT-4o: I'll process this comprehensively. ${messages[messages.length - 1].content.substring(0, 105)}...`,
        usage: { prompt_tokens: 58, completion_tokens: 88, total_tokens: 146 },
        model: 'gpt-4o'
      }
    };

    return mockResponses[model as keyof typeof mockResponses] || {
      content: `AI Response: ${messages[messages.length - 1].content.substring(0, 100)}...`,
      usage: { prompt_tokens: 50, completion_tokens: 75, total_tokens: 125 },
      model: model
    };
  }
}