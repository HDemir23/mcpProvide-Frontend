'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Node, Connection, AgentType } from '@/types'

export interface WorkflowState {
  nodes: Node[]
  connections: Connection[]
  selectedNodeId: string | null
  selectedConnectionId: string | null
  canvasViewport: {
    x: number
    y: number
    zoom: number
  }
  history: {
    past: WorkflowState[]
    present: WorkflowState | null
    future: WorkflowState[]
  }
}

export enum WorkflowActionType {
  ADD_NODE = 'ADD_NODE',
  REMOVE_NODE = 'REMOVE_NODE',
  UPDATE_NODE = 'UPDATE_NODE',
  UPDATE_NODE_POSITION = 'UPDATE_NODE_POSITION',
  SELECT_NODE = 'SELECT_NODE',
  ADD_CONNECTION = 'ADD_CONNECTION',
  REMOVE_CONNECTION = 'REMOVE_CONNECTION',
  SELECT_CONNECTION = 'SELECT_CONNECTION',
  UPDATE_VIEWPORT = 'UPDATE_VIEWPORT',
  CLEAR_WORKFLOW = 'CLEAR_WORKFLOW',
  LOAD_WORKFLOW = 'LOAD_WORKFLOW',
  UNDO = 'UNDO',
  REDO = 'REDO'
}

// Union type for adding different kinds of nodes
type AddNodeAgent = AgentType | (AgentType & {
  nodeType?: any
  properties?: Record<string, any>
  executionState?: 'idle' | 'running' | 'success' | 'error'
})

export type WorkflowAction =
  | { type: WorkflowActionType.ADD_NODE; payload: { agent: AddNodeAgent; position: { x: number; y: number } } }
  | { type: WorkflowActionType.REMOVE_NODE; payload: { nodeId: string } }
  | { type: WorkflowActionType.UPDATE_NODE; payload: { nodeId: string; data: any } }
  | { type: WorkflowActionType.UPDATE_NODE_POSITION; payload: { nodeId: string; position: { x: number; y: number } } }
  | { type: WorkflowActionType.SELECT_NODE; payload: { nodeId: string | null } }
  | { type: WorkflowActionType.ADD_CONNECTION; payload: Omit<Connection, 'id'> }
  | { type: WorkflowActionType.REMOVE_CONNECTION; payload: { connectionId: string } }
  | { type: WorkflowActionType.SELECT_CONNECTION; payload: { connectionId: string | null } }
  | { type: WorkflowActionType.UPDATE_VIEWPORT; payload: { x?: number; y?: number; zoom?: number } }
  | { type: WorkflowActionType.CLEAR_WORKFLOW }
  | { type: WorkflowActionType.LOAD_WORKFLOW; payload: { nodes: Node[]; connections: Connection[] } }
  | { type: WorkflowActionType.UNDO }
  | { type: WorkflowActionType.REDO }

const initialState: WorkflowState = {
  nodes: [],
  connections: [],
  selectedNodeId: null,
  selectedConnectionId: null,
  canvasViewport: { x: 0, y: 0, zoom: 1 },
  history: {
    past: [],
    present: null,
    future: []
  }
}

function addToHistory(state: WorkflowState): WorkflowState {
  if (state.history.present) {
    return {
      ...state,
      history: {
        past: [...state.history.past, state.history.present].slice(-50), // Keep last 50 states
        present: {
          nodes: state.nodes,
          connections: state.connections,
          selectedNodeId: state.selectedNodeId,
          selectedConnectionId: state.selectedConnectionId,
          canvasViewport: state.canvasViewport,
          history: state.history
        },
        future: []
      }
    }
  }
  return state
}

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case WorkflowActionType.ADD_NODE: {
      const newState = addToHistory(state)
      const agent = action.payload.agent as any // Use any to avoid type issues temporarily
      
      // Check if this is a new dynamic node (has nodeType) or legacy agent
      const isDynamicNode = agent.nodeType !== undefined
      
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: isDynamicNode ? 'dynamic' : 'agent',
        position: action.payload.position,
        data: isDynamicNode ? {
          // Dynamic node format
          nodeType: agent.nodeType,
          properties: agent.properties || {},
          executionState: agent.executionState || 'idle'
        } as any : {
          // Legacy agent format
          agentType: agent,
          config: {}
        } as any
      }
      return {
        ...newState,
        nodes: [...newState.nodes, newNode],
        selectedNodeId: newNode.id
      }
    }

    case WorkflowActionType.REMOVE_NODE: {
      const newState = addToHistory(state)
      return {
        ...newState,
        nodes: newState.nodes.filter(node => node.id !== action.payload.nodeId),
        connections: newState.connections.filter(conn => 
          conn.source !== action.payload.nodeId && conn.target !== action.payload.nodeId
        ),
        selectedNodeId: newState.selectedNodeId === action.payload.nodeId ? null : newState.selectedNodeId
      }
    }

    case WorkflowActionType.UPDATE_NODE: {
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.nodeId
            ? { ...node, data: action.payload.data }
            : node
        )
      }
    }

    case WorkflowActionType.UPDATE_NODE_POSITION: {
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.nodeId
            ? { ...node, position: action.payload.position }
            : node
        )
      }
    }

    case WorkflowActionType.SELECT_NODE: {
      return {
        ...state,
        selectedNodeId: action.payload.nodeId,
        selectedConnectionId: null
      }
    }

    case WorkflowActionType.ADD_CONNECTION: {
      const newState = addToHistory(state)
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        ...action.payload
      }
      return {
        ...newState,
        connections: [...newState.connections, newConnection]
      }
    }

    case WorkflowActionType.REMOVE_CONNECTION: {
      const newState = addToHistory(state)
      return {
        ...newState,
        connections: newState.connections.filter(conn => conn.id !== action.payload.connectionId),
        selectedConnectionId: newState.selectedConnectionId === action.payload.connectionId ? null : newState.selectedConnectionId
      }
    }

    case WorkflowActionType.SELECT_CONNECTION: {
      return {
        ...state,
        selectedConnectionId: action.payload.connectionId,
        selectedNodeId: null
      }
    }

    case WorkflowActionType.UPDATE_VIEWPORT: {
      return {
        ...state,
        canvasViewport: {
          ...state.canvasViewport,
          ...action.payload
        }
      }
    }

    case WorkflowActionType.CLEAR_WORKFLOW: {
      const newState = addToHistory(state)
      return {
        ...newState,
        nodes: [],
        connections: [],
        selectedNodeId: null,
        selectedConnectionId: null
      }
    }

    case WorkflowActionType.LOAD_WORKFLOW: {
      const newState = addToHistory(state)
      return {
        ...newState,
        nodes: action.payload.nodes,
        connections: action.payload.connections,
        selectedNodeId: null,
        selectedConnectionId: null
      }
    }

    case WorkflowActionType.UNDO: {
      if (state.history.past.length === 0) return state
      const previous = state.history.past[state.history.past.length - 1]
      const newPast = state.history.past.slice(0, -1)
      return {
        ...previous,
        history: {
          past: newPast,
          present: {
            nodes: state.nodes,
            connections: state.connections,
            selectedNodeId: state.selectedNodeId,
            selectedConnectionId: state.selectedConnectionId,
            canvasViewport: state.canvasViewport,
            history: state.history
          },
          future: [state.history.present, ...state.history.future].filter((s): s is WorkflowState => s !== null).slice(0, 50)
        }
      }
    }

    case WorkflowActionType.REDO: {
      if (state.history.future.length === 0) return state
      const next = state.history.future[0]
      const newFuture = state.history.future.slice(1)
      return {
        ...next!,
        history: {
          past: [...state.history.past, {
            nodes: state.nodes,
            connections: state.connections,
            selectedNodeId: state.selectedNodeId,
            selectedConnectionId: state.selectedConnectionId,
            canvasViewport: state.canvasViewport,
            history: state.history
          }],
          present: next,
          future: newFuture
        }
      }
    }

    default:
      return state
  }
}

interface WorkflowContextType {
  state: WorkflowState
  dispatch: React.Dispatch<WorkflowAction>
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState)

  return (
    <WorkflowContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflowContext() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error('useWorkflowContext must be used within a WorkflowProvider')
  }
  return context
}