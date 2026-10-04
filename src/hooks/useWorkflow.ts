'use client'

import { useCallback, useMemo } from 'react'
import { useWorkflowContext, WorkflowActionType } from '@/contexts/WorkflowContext'
import { AgentType, Connection } from '@/types'
import { WorkflowTemplate } from '@/types/templates'
import { WorkflowVersionControl } from '@/lib/versioning/VersionControl'
import { WorkflowMetadata } from '@/types/versioning'

export function useWorkflow() {
  const { state, dispatch } = useWorkflowContext()
  const versionControl = useMemo(() => new WorkflowVersionControl(), [])

  const addNode = useCallback((agent: AgentType, position: { x: number; y: number }) => {
    dispatch({
      type: WorkflowActionType.ADD_NODE,
      payload: { agent, position }
    })
  }, [dispatch])

  const removeNode = useCallback((nodeId: string) => {
    dispatch({
      type: WorkflowActionType.REMOVE_NODE,
      payload: { nodeId }
    })
  }, [dispatch])

  const selectNode = useCallback((nodeId: string) => {
    dispatch({
      type: WorkflowActionType.SELECT_NODE,
      payload: { nodeId }
    })
  }, [dispatch])

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    dispatch({
      type: WorkflowActionType.UPDATE_NODE,
      payload: { nodeId, data }
    })
  }, [dispatch])

  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    dispatch({
      type: WorkflowActionType.UPDATE_NODE_POSITION,
      payload: { nodeId, position }
    })
  }, [dispatch])

  const addConnection = useCallback((connection: Omit<Connection, 'id'>) => {
    dispatch({
      type: WorkflowActionType.ADD_CONNECTION,
      payload: connection
    })
  }, [dispatch])

  const removeConnection = useCallback((connectionId: string) => {
    dispatch({
      type: WorkflowActionType.REMOVE_CONNECTION,
      payload: { connectionId }
    })
  }, [dispatch])

  const selectConnection = useCallback((connectionId: string | null) => {
    dispatch({
      type: WorkflowActionType.SELECT_CONNECTION,
      payload: { connectionId }
    })
  }, [dispatch])

  const updateViewport = useCallback((viewport: { x?: number; y?: number; zoom?: number }) => {
    dispatch({
      type: WorkflowActionType.UPDATE_VIEWPORT,
      payload: viewport
    })
  }, [dispatch])

  const clearWorkflow = useCallback(() => {
    dispatch({ type: WorkflowActionType.CLEAR_WORKFLOW })
  }, [dispatch])

  const loadWorkflow = useCallback((nodes: any[], connections: Connection[]) => {
    dispatch({
      type: WorkflowActionType.LOAD_WORKFLOW,
      payload: { nodes, connections }
    })
  }, [dispatch])

  const loadTemplate = useCallback((template: WorkflowTemplate) => {
    console.log('🔍 useWorkflow Debug - loadTemplate called with:', template);
    console.log('🔍 useWorkflow Debug - Dispatching LOAD_TEMPLATE action...');
    dispatch({
      type: WorkflowActionType.LOAD_TEMPLATE,
      payload: { template }
    })
  }, [dispatch])

  const undo = useCallback(() => {
    dispatch({ type: WorkflowActionType.UNDO })
  }, [dispatch])

  const redo = useCallback(() => {
    dispatch({ type: WorkflowActionType.REDO })
  }, [dispatch])

  const selectedNode = state.selectedNodeId 
    ? state.nodes.find(node => node.id === state.selectedNodeId) || null 
    : null

  const selectedConnection = state.selectedConnectionId
    ? state.connections.find(conn => conn.id === state.selectedConnectionId) || null
    : null

  const canUndo = state.history.past.length > 0
  const canRedo = state.history.future.length > 0

  // Version control actions
  const saveWorkflowVersion = useCallback(async (message: string, tags?: string[]) => {
    try {
      // Initialize workflow if not already done
      const workflowId = 'current-workflow-id' // In a real app, this would be dynamic
      const metadata: WorkflowMetadata = {
        name: 'Current Workflow',
        description: 'User workflow',
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          autoSave: true,
          errorHandling: 'stop',
          maxRetries: 3,
          timeout: 30000,
          variables: {}
        }
      }

      await versionControl.initializeWorkflow(workflowId, metadata)

      // Convert workflow nodes to ReactFlow nodes format
      const reactFlowNodes = state.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      }))

      // Convert connections to ReactFlow edges format
      const reactFlowEdges = state.connections.map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle
      }))

      const newVersion = await versionControl.saveVersion(
        reactFlowNodes,
        reactFlowEdges,
        message,
        metadata,
        tags
      )
      
      console.log('Workflow saved as new version:', newVersion)
      return newVersion
    } catch (error) {
      console.error('Error saving workflow version:', error)
      throw error
    }
  }, [state.nodes, state.connections, versionControl])

  const restoreWorkflowVersion = useCallback(async (versionId: string) => {
    try {
      const restoredWorkflow = await versionControl.restoreVersion(versionId)
      
      // Convert ReactFlow nodes back to workflow nodes
      const workflowNodes = restoredWorkflow.nodes.map(node => ({
        id: node.id,
        type: node.type || 'dynamic',
        position: node.position,
        data: node.data
      }))

      // Convert ReactFlow edges back to connections
      const workflowConnections = restoredWorkflow.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || 'output',
        targetHandle: edge.targetHandle || 'input'
      }))

      dispatch({
        type: WorkflowActionType.LOAD_WORKFLOW,
        payload: { nodes: workflowNodes, connections: workflowConnections }
      })
      
      console.log('Workflow restored:', restoredWorkflow)
      return restoredWorkflow
    } catch (error) {
      console.error('Error restoring workflow version:', error)
      throw error
    }
  }, [dispatch, versionControl])

  const getVersionHistory = useCallback(async () => {
    try {
      const workflowId = 'current-workflow-id'
      const metadata: WorkflowMetadata = {
        name: 'Current Workflow',
        description: 'User workflow',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await versionControl.initializeWorkflow(workflowId, metadata)
      return await versionControl.getVersionHistory()
    } catch (error) {
      console.error('Error getting version history:', error)
      return []
    }
  }, [versionControl])

  return {
    // State
    nodes: state.nodes,
    connections: state.connections,
    selectedNodeId: state.selectedNodeId,
    selectedConnectionId: state.selectedConnectionId,
    selectedNode,
    selectedConnection,
    canvasViewport: state.canvasViewport,
    canUndo,
    canRedo,

    // Actions
    addNode,
    removeNode,
    selectNode,
    updateNodeData,
    updateNodePosition,
    addConnection,
    removeConnection,
    selectConnection,
    updateViewport,
    clearWorkflow,
    loadWorkflow,
    loadTemplate,
    undo,
    redo,

    // Version control actions
    saveWorkflowVersion,
    restoreWorkflowVersion,
    getVersionHistory
  }
}