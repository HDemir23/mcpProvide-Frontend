'use client'

import { useCallback } from 'react'
import { Node as NodeType } from '@/types'
import styles from './Node.module.scss'

interface NodeProps {
  node: NodeType
  isSelected?: boolean
  onSelect?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
}

export default function Node({ node, isSelected, onSelect, onDelete }: NodeProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(node.id)
  }, [node.id, onSelect])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(node.id)
  }, [node.id, onDelete])

  // Check if this is a dynamic node or legacy node
  const isDynamicNode = node.data.nodeType && node.data.properties !== undefined
  const hasConfiguration = isDynamicNode
    ? Object.values(node.data.properties || {}).some(value => value && value !== '' && value !== '{}')
    : (node.data.config?.taskDescription || node.data.config?.systemPrompt)

  return (
    <div 
      className={`${styles.node} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      style={{
        left: node.position.x,
        top: node.position.y
      }}
    >
      <div className={styles.header}>
        <div className={styles.agentInfo}>
          <div className={styles.icon}>
            {isDynamicNode ? node.data.nodeType.icon : node.data.agentType?.icon}
          </div>
          <div className={styles.details}>
            <h4 className={styles.name}>
              {isDynamicNode ? node.data.nodeType.name : node.data.agentType?.name}
            </h4>
            <span className={styles.provider}>
              {isDynamicNode ? node.data.nodeType.category : node.data.agentType?.provider}
            </span>
          </div>
        </div>
        <button className={styles.deleteButton} onClick={handleDelete} title="Delete node">
          ×
        </button>
      </div>

      {hasConfiguration && (
        <div className={styles.content}>
          {isDynamicNode ? (
            <p className={styles.task}>
              {/* Show first configured property for dynamic nodes */}
              {Object.entries(node.data.properties || {}).find(([key, value]) => value && value !== '' && value !== '{}')?.join(': ').slice(0, 50)}...
            </p>
          ) : (
            node.data.config?.taskDescription && (
              <p className={styles.task}>
                {node.data.config.taskDescription.slice(0, 50)}
                {node.data.config.taskDescription.length > 50 ? '...' : ''}
              </p>
            )
          )}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.status}>
          <div className={`${styles.statusDot} ${styles.ready}`}></div>
          <span>Ready to configure</span>
        </div>
        <div className={styles.cost}>
          {isDynamicNode ? 'MCP' : `$${node.data.agentType?.costPer1K || 0}/1K`}
        </div>
      </div>

      {/* Connection points */}
      <div className={styles.connectionPoints}>
        <div 
          className={`${styles.connectionPoint} ${styles.input}`} 
          data-connection-type="input"
          onMouseDown={(e) => {
            e.stopPropagation()
            // Connection drag will be handled by parent
          }}
        >
          <div className={styles.connector}></div>
        </div>
        <div 
          className={`${styles.connectionPoint} ${styles.output}`} 
          data-connection-type="output"
          onMouseDown={(e) => {
            e.stopPropagation()
            // Connection drag will be handled by parent
          }}
        >
          <div className={styles.connector}></div>
        </div>
      </div>
    </div>
  )
}