'use client'

import React from 'react';
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution';
import { Node, Edge } from 'reactflow';
import styles from './ExecutionPanel.module.scss';

interface ExecutionPanelProps {
  nodes: Node[];
  edges: Edge[];
  workflowName?: string;
}

export default function ExecutionPanel({ nodes, edges, workflowName = 'Test Workflow' }: ExecutionPanelProps) {
  const { 
    isExecuting, 
    currentExecution, 
    error, 
    executeWorkflow,
    clearExecution,
    getExecutionStats
  } = useWorkflowExecution();

  const stats = getExecutionStats();

  const handleExecute = async () => {
    await executeWorkflow(nodes, edges, workflowName);
  };

  const formatDuration = (duration: number) => {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  return (
    <div className={styles.executionPanel}>
      <div className={styles.header}>
        <h3>Workflow Execution</h3>
        <div className={styles.stats}>
          <span>Total: {stats.total}</span>
          <span className={styles.success}>✓ {stats.successful}</span>
          <span className={styles.error}>✗ {stats.failed}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button 
          className={`${styles.executeButton} ${isExecuting ? styles.executing : ''}`}
          onClick={handleExecute}
          disabled={isExecuting || nodes.length === 0}
        >
          {isExecuting ? (
            <>
              <span className={styles.spinner}>⏳</span>
              Executing...
            </>
          ) : (
            <>
              <span>▶️</span>
              Execute Workflow
            </>
          )}
        </button>

        {currentExecution && (
          <button 
            className={styles.clearButton}
            onClick={clearExecution}
          >
            Clear Results
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <strong>Execution Error:</strong>
          <pre>{error}</pre>
        </div>
      )}

      {currentExecution && (
        <div className={styles.results}>
          <div className={styles.resultHeader}>
            <h4>
              {currentExecution.success ? (
                <span className={styles.success}>✅ Execution Successful</span>
              ) : (
                <span className={styles.error}>❌ Execution Failed</span>
              )}
            </h4>
            <div className={styles.resultMeta}>
              <span>ID: {currentExecution.executionId}</span>
              <span>Duration: {formatDuration(currentExecution.duration || 0)}</span>
              <span>Nodes: {currentExecution.nodeExecutions?.length || 0}</span>
            </div>
          </div>

          {currentExecution.nodeExecutions && currentExecution.nodeExecutions.length > 0 && (
            <div className={styles.nodeResults}>
              <h5>Node Execution Results:</h5>
              {currentExecution.nodeExecutions.map((nodeExec, index) => (
                <div 
                  key={nodeExec.nodeId}
                  className={`${styles.nodeResult} ${nodeExec.success ? styles.success : styles.error}`}
                >
                  <div className={styles.nodeResultHeader}>
                    <span className={styles.nodeId}>{nodeExec.nodeId}</span>
                    <span className={styles.nodeDuration}>
                      {formatDuration(nodeExec.duration)}
                    </span>
                    <span className={styles.nodeStatus}>
                      {nodeExec.success ? '✅' : '❌'}
                    </span>
                  </div>
                  
                  {nodeExec.error && (
                    <div className={styles.nodeError}>
                      Error: {nodeExec.error}
                    </div>
                  )}
                  
                  {nodeExec.success && nodeExec.data && (
                    <div className={styles.nodeData}>
                      <details>
                        <summary>Output Data</summary>
                        <pre>{JSON.stringify(nodeExec.data, null, 2)}</pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {nodes.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📦</span>
          <p>No nodes in workflow</p>
          <small>Add some nodes to execute a workflow</small>
        </div>
      )}
    </div>
  );
}