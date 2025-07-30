'use client'

import React, { useCallback, useRef } from 'react'
import { useDroppable } from '@dnd-kit/core'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ConnectionLineType,
  BackgroundVariant,
  OnConnectStart,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  NodeDragHandler,
  OnSelectionChangeParams,
  ConnectionMode,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Node as NodeType, Connection as ConnectionType, AgentType } from '@/types'
import CustomNode from './CustomNode'
import CustomEdge from './CustomEdge'
import DynamicNode from './DynamicNode'
import styles from './Canvas.module.scss'

// Register custom node and edge types
const nodeTypes = {
  agent: CustomNode,
  dynamic: DynamicNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

interface CanvasProps {
  nodes: NodeType[]
  connections: ConnectionType[]
  selectedNodeId?: string | null
  selectedConnectionId?: string | null
  onAddNode?: (agent: AgentType, position: { x: number; y: number }) => void
  onSelectNode?: (nodeId: string) => void
  onDeleteNode?: (nodeId: string) => void
  onUpdateNodePosition?: (nodeId: string, position: { x: number; y: number }) => void
  onAddConnection?: (connection: Omit<ConnectionType, 'id'>) => void
  onSelectConnection?: (connectionId: string) => void
  onDeleteConnection?: (connectionId: string) => void
}

export default function Canvas({ 
  nodes, 
  connections,
  selectedNodeId, 
  selectedConnectionId,
  onSelectNode, 
  onDeleteNode,
  onUpdateNodePosition,
  onAddConnection,
  onSelectConnection,
  onDeleteConnection
}: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Convert our nodes to ReactFlow format
  const reactFlowNodes: Node[] = nodes.map(node => ({
    id: node.id,
    type: node.type, // Use the type from the node itself (set by the reducer)
    position: node.position,
    data: {
      ...node.data,
      onSelect: () => onSelectNode?.(node.id),
      onDelete: () => onDeleteNode?.(node.id),
      isSelected: selectedNodeId === node.id,
    },
    selected: selectedNodeId === node.id,
    draggable: true,
  }))

  // Convert our connections to ReactFlow edges
  const reactFlowEdges: Edge[] = connections.map(connection => ({
    id: connection.id,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    type: 'custom',
    animated: false,
    style: { 
      stroke: connection.sourceHandle?.includes('output') ? '#00d4ff' : '#ff6b35', 
      strokeWidth: 2 
    },
    selected: selectedConnectionId === connection.id,
    data: {
      onSelect: () => onSelectConnection?.(connection.id),
      onDelete: () => onDeleteConnection?.(connection.id),
    },
  }))

  const [rfNodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes)
  const [rfEdges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges)

  // Update ReactFlow nodes when props change
  React.useEffect(() => {
    setNodes(reactFlowNodes)
  }, [nodes, selectedNodeId, setNodes])

  // Update ReactFlow edges when props change
  React.useEffect(() => {
    setEdges(reactFlowEdges)
  }, [connections, selectedConnectionId, setEdges])

  // Handle new connections with handle support
  const onConnect = useCallback((params: Connection) => {
    if (params.source && params.target && onAddConnection) {
      onAddConnection({
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      })
    }
  }, [onAddConnection])

  // Handle node position changes
  const onNodeDragStop: NodeDragHandler = useCallback((event, node) => {
    if (onUpdateNodePosition) {
      onUpdateNodePosition(node.id, node.position)
    }
  }, [onUpdateNodePosition])

  // Handle selection changes
  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    if (params.nodes.length > 0) {
      onSelectNode?.(params.nodes[0].id)
      onSelectConnection?.('')
    } else if (params.edges.length > 0) {
      onSelectConnection?.(params.edges[0].id)
      onSelectNode?.('')
    } else {
      onSelectNode?.('')
      onSelectConnection?.('')
    }
  }, [onSelectNode, onSelectConnection])

  // Handle edge clicks for selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation()
    onSelectConnection?.(edge.id)
    onSelectNode?.('')
  }, [onSelectConnection, onSelectNode])

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'canvas-droppable'
  })

  return (
    <div className={styles.canvas} ref={reactFlowWrapper}>
      <div ref={setDroppableRef} style={{ width: '100%', height: '100%' }}>
        <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        snapToGrid={true}
        snapGrid={[10, 10]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-left"
        panOnScroll={true}
        selectionOnDrag={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={false}
        className={styles.reactflow}
        fitView={false}
        connectionMode={ConnectionMode.Loose}
        multiSelectionKeyCode="Shift"
        deleteKeyCode="Delete"
      >
        <Controls 
          className={styles.controls}
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        <MiniMap 
          className={styles.minimap}
          zoomable={true}
          pannable={true}
          nodeColor="#ff6b35"
          nodeStrokeWidth={2}
          nodeStrokeColor="#ffffff"
          maskColor="rgba(0, 0, 0, 0.2)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#333333"
        />
        </ReactFlow>
      </div>
    </div>
  )
}