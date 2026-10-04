'use client'

import { useState } from 'react'
import { DragEndEvent } from '@dnd-kit/core'
import Layout from '@/components/Layout'
import EnhancedSidebar from '@/components/Sidebar/EnhancedSidebar'
import Canvas from '@/components/Canvas'
import { NodeForm } from '@/components/Node'
import ExecutionPanel from '@/components/ExecutionPanel/ExecutionPanel'
import VersionHistory from '@/components/VersionControl/VersionHistory'
import DndProvider from '@/contexts/DndProvider'
import { WorkflowProvider } from '@/contexts/WorkflowContext'
import { useWorkflow } from '@/hooks/useWorkflow'
import { NodeFactory } from '@/lib/NodeFactory'

function HomeContent() {
  const {
    nodes,
    connections,
    selectedNodeId,
    selectedConnectionId,
    selectedNode,
    addNode,
    removeNode,
    selectNode,
    updateNodeData,
    updateNodePosition,
    addConnection,
    removeConnection,
    selectConnection,
    loadTemplate,
    saveWorkflowVersion,
    restoreWorkflowVersion,
  } = useWorkflow()

  const [showVersionHistory, setShowVersionHistory] = useState(false)

  const handleSaveVersion = async () => {
    const message = prompt('Enter a version message:')
    if (message) {
      try {
        await saveWorkflowVersion(message)
        alert('Version saved successfully!')
      } catch (error: any) {
        alert(`Error saving version: ${error.message || error}`)
      }
    }
  }

  const handleRestoreVersion = async (versionId: string) => {
    try {
      await restoreWorkflowVersion(versionId)
      alert('Version restored successfully!')
    } catch (error: any) {
      alert(`Error restoring version: ${error.message || error}`)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === 'canvas-droppable') {
      // Handle both legacy agent drops and new nodeType drops
      const agent = active.data.current?.agent
      const nodeType = active.data.current?.nodeType

      if (agent) {
        // Legacy agent handling
        const canvasElement = document.querySelector('.react-flow__renderer')
        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect()
          const position = {
            x: Math.max(
              10,
              (event.activatorEvent as MouseEvent).clientX - rect.left - 75
            ),
            y: Math.max(
              10,
              (event.activatorEvent as MouseEvent).clientY - rect.top - 40
            ),
          }
          addNode(agent, position)
        } else {
          const position = {
            x: Math.random() * 400 + 50,
            y: Math.random() * 300 + 50,
          }
          addNode(agent, position)
        }
      } else if (nodeType) {
        // New node type handling
        const canvasElement = document.querySelector('.react-flow__renderer')
        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect()
          const position = {
            x: Math.max(
              10,
              (event.activatorEvent as MouseEvent).clientX - rect.left - 90
            ),
            y: Math.max(
              10,
              (event.activatorEvent as MouseEvent).clientY - rect.top - 50
            ),
          }

          // Create new node using NodeFactory
          const newNode = NodeFactory.createNode(nodeType.id, position)
          // Pass the properly formatted dynamic node data
          const dynamicNodeAgent = {
            id: nodeType.id, // Use nodeType ID for agent compatibility
            name: nodeType.name,
            type: nodeType.category,
            description: nodeType.description,
            nodeType: newNode.data.nodeType, // Include the full nodeType for dynamic rendering
            properties: newNode.data.properties,
            executionState: newNode.data.executionState,
          }
          addNode(dynamicNodeAgent as any, position)
        }
      }
    }
  }

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <Layout
        sidebar={<EnhancedSidebar onLoadTemplate={loadTemplate} />}
        canvas={
          <Canvas
            nodes={nodes}
            connections={connections}
            selectedNodeId={selectedNodeId}
            selectedConnectionId={selectedConnectionId}
            onSelectNode={selectNode}
            onDeleteNode={removeNode}
            onUpdateNodePosition={updateNodePosition}
            onAddConnection={addConnection}
            onSelectConnection={selectConnection}
            onDeleteConnection={removeConnection}
          />
        }
        rightPanel={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%',
            }}
          >
            {/* Version Control */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button onClick={handleSaveVersion}>💾 Save Version</button>
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
              >
                {showVersionHistory ? '✕ Hide History' : '📋 Version History'}
              </button>
            </div>
            {showVersionHistory && (
              <div
                style={{
                  height: '300px',
                  overflow: 'auto',
                  border: '1px solid #e5e7eb',
                  marginBottom: '8px',
                }}
              >
                <VersionHistory
                  workflowId="current-workflow-id"
                  onRestoreVersion={(version) =>
                    handleRestoreVersion(version.id)
                  }
                />
              </div>
            )}

            <ExecutionPanel
              nodes={nodes.map((node) => ({
                id: node.id,
                type: 'dynamic',
                position: node.position,
                data: node.data,
              }))}
              edges={connections.map((conn) => ({
                id: conn.id,
                source: conn.source,
                target: conn.target,
                sourceHandle: conn.sourceHandle,
                targetHandle: conn.targetHandle,
              }))}
              workflowName="My Workflow"
            />

            {selectedNode ? (
              <NodeForm
                node={selectedNode}
                onUpdate={updateNodeData}
                onClose={() => selectNode('')}
              />
            ) : (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#666',
                  flex: 1,
                }}
              >
                <h2>Properties</h2>
                <p>Select a node to configure its settings</p>
              </div>
            )}
          </div>
        }
      />
    </DndProvider>
  )
}

export default function Home() {
  return (
    <WorkflowProvider>
      <HomeContent />
    </WorkflowProvider>
  )
}
