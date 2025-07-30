import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import { WorkflowExecutor } from '../lib/execution/WorkflowExecutor';
import { ExecutionResult, TriggerData, Workflow } from '../lib/execution/ExecutionContext';

interface ExecutionState {
  isExecuting: boolean;
  currentExecution: ExecutionResult | null;
  executionHistory: ExecutionResult[];
  error: string | null;
}

export const useWorkflowExecution = () => {
  const [state, setState] = useState<ExecutionState>({
    isExecuting: false,
    currentExecution: null,
    executionHistory: [],
    error: null
  });

  const executeWorkflow = useCallback(async (
    nodes: Node[], 
    edges: Edge[], 
    workflowName: string = 'Untitled Workflow',
    trigger?: TriggerData
  ): Promise<ExecutionResult> => {
    setState(prev => ({
      ...prev,
      isExecuting: true,
      error: null
    }));

    try {
      const workflow: Workflow = {
        id: `workflow-${Date.now()}`,
        name: workflowName,
        nodes,
        edges,
        active: true
      };

      console.log('🚀 Starting workflow execution:', {
        nodes: nodes.length,
        edges: edges.length,
        name: workflowName
      });

      const result = await WorkflowExecutor.executeWorkflow(workflow, trigger);

      console.log('✅ Workflow execution completed:', result);

      setState(prev => ({
        ...prev,
        isExecuting: false,
        currentExecution: result,
        executionHistory: [result, ...prev.executionHistory.slice(0, 9)], // Keep last 10
        error: null
      }));

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error('❌ Workflow execution failed:', errorMessage);

      const failedResult: ExecutionResult = {
        success: false,
        executionId: `failed-${Date.now()}`,
        error: errorMessage,
        duration: 0,
        nodeExecutions: []
      };

      setState(prev => ({
        ...prev,
        isExecuting: false,
        currentExecution: failedResult,
        executionHistory: [failedResult, ...prev.executionHistory.slice(0, 9)],
        error: errorMessage
      }));

      return failedResult;
    }
  }, []);

  const clearExecution = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentExecution: null,
      error: null
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      executionHistory: []
    }));
  }, []);

  const getExecutionStats = useCallback(() => {
    const total = state.executionHistory.length;
    const successful = state.executionHistory.filter(ex => ex.success).length;
    const failed = total - successful;
    
    return { total, successful, failed };
  }, [state.executionHistory]);

  return {
    // State
    isExecuting: state.isExecuting,
    currentExecution: state.currentExecution,
    executionHistory: state.executionHistory,
    error: state.error,
    
    // Actions
    executeWorkflow,
    clearExecution,
    clearHistory,
    
    // Utils
    getExecutionStats
  };
};