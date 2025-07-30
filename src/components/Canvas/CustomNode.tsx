'use client'

import React, { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { AgentType } from '@/types'
import styles from './CustomNode.module.scss'

interface CustomNodeData {
  agentType: AgentType
  config: Record<string, any>
  onSelect?: () => void
  onDelete?: () => void
  isSelected?: boolean
}

interface CustomNodeProps {
  data: CustomNodeData
  selected?: boolean
}

function CustomNode({ data, selected }: CustomNodeProps) {
  const { agentType, config, onSelect, onDelete, isSelected } = data

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }

  const hasConfiguration = config?.taskDescription || config?.systemPrompt

  return (
    <div 
      className={`${styles.customNode} ${selected || isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      {/* Multiple Handles - n8n Style */}
      {/* Top Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="input-top"
        className={`${styles.handle} ${styles.handleTop}`}
        style={{ background: '#ff6b35', left: '30%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="output-top"
        className={`${styles.handle} ${styles.handleTop}`}
        style={{ background: '#00d4ff', left: '70%' }}
        isConnectable={true}
      />

      {/* Left Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-left"
        className={`${styles.handle} ${styles.handleLeft}`}
        style={{ background: '#ff6b35', top: '40%' }}
        isConnectable={true}
      />

      {/* Right Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="output-right"
        className={`${styles.handle} ${styles.handleRight}`}
        style={{ background: '#00d4ff', top: '40%' }}
        isConnectable={true}
      />

      <div className={styles.header}>
        <div className={styles.agentInfo}>
          <div className={styles.icon}>{agentType.icon}</div>
          <div className={styles.details}>
            <h4 className={styles.name}>{agentType.name}</h4>
            <span className={styles.provider}>{agentType.provider}</span>
          </div>
        </div>
        <button className={styles.deleteButton} onClick={handleDelete} title="Delete node">
          ×
        </button>
      </div>

      {hasConfiguration && (
        <div className={styles.content}>
          {config.taskDescription && (
            <p className={styles.task}>
              {config.taskDescription.slice(0, 50)}
              {config.taskDescription.length > 50 ? '...' : ''}
            </p>
          )}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.status}>
          <div className={`${styles.statusDot} ${styles.ready}`}></div>
          <span>Ready to configure</span>
        </div>
        <div className={styles.cost}>
          ${config.customPrice || agentType.costPer1K}/1K
        </div>
      </div>

      {/* Bottom Handles */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="input-bottom"
        className={`${styles.handle} ${styles.handleBottom}`}
        style={{ background: '#ff6b35', left: '30%' }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output-bottom"
        className={`${styles.handle} ${styles.handleBottom}`}
        style={{ background: '#00d4ff', left: '70%' }}
        isConnectable={true}
      />
    </div>
  )
}

export default memo(CustomNode)