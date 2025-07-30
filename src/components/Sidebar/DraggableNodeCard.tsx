'use client'

import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { NodeTypeDefinition } from '../../types/nodeTypes'
import styles from './DraggableNodeCard.module.scss'

interface DraggableNodeCardProps {
  nodeType: NodeTypeDefinition
}

export default function DraggableNodeCard({ nodeType }: DraggableNodeCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `node-${nodeType.id}`,
    data: { nodeType }
  })


  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${styles.nodeCard} ${styles[nodeType.category]} ${isDragging ? styles.dragging : ''}`}
    >
      <div 
        className={styles.nodeIcon}
        style={{ backgroundColor: nodeType.color }}
      >
        {nodeType.icon}
      </div>
      
      <div className={styles.nodeInfo}>
        <h4 className={styles.nodeName}>{nodeType.name}</h4>
        <p className={styles.nodeDescription}>{nodeType.description}</p>
        
        <div className={styles.nodeStats}>
          <div className={styles.handleCounts}>
            <span className={styles.inputCount}>
              {nodeType.inputs.length}→
            </span>
            <span className={styles.outputCount}>
              →{nodeType.outputs.length}
            </span>
          </div>
          <div className={styles.category}>
            {nodeType.category}
          </div>
        </div>
      </div>
      
      <div className={styles.dragHandle}>
        <div className={styles.dragDots}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}