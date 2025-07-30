import { AgentType } from '@/types'
import styles from './AgentCard.module.scss'

interface AgentCardProps {
  agent: AgentType
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div 
      className={styles.agentCard}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify(agent))
      }}
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