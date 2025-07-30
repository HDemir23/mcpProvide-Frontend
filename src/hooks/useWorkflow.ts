'use client'

import { useCallback } from 'react'
import { useWorkflowContext, WorkflowActionType } from '@/contexts/WorkflowContext'
import { AgentType, Connection } from '@/types'

export function useWorkflow() {
  const { state, dispatch } = useWorkflowContext()

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
    undo,
    redo
  }
}