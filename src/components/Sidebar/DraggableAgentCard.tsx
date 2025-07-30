'use client'

import { useDraggable } from '@dnd-kit/core'
import { AgentType } from '@/types'
import styles from './AgentCard.module.scss'

interface DraggableAgentCardProps {
  agent: AgentType
}

export default function DraggableAgentCard({ agent }: DraggableAgentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: agent.id,
    data: { agent }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined

  return (
    <div 
      ref={setNodeRef}
      className={styles.agentCard}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className={styles.icon}>{agent.icon}</div>
      <div className={styles.content}>
        <h3 className={styles.name}>{agent.name}</h3>
        <p className={styles.description}>{agent.description}</p>
        <div className={styles.meta}>
          <span className={styles.provider}>{agent.provider}</span>
          <span className={styles.cost}>${agent.costPer1K}/1K tokens</span>
        </div>
      </div>
    </div>
  )
}