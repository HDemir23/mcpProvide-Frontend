'use client'

import { useMemo } from 'react'
import { agentTypes } from '@/lib/agents/agentTypes'
import { AgentType } from '@/types'
import DraggableAgentCard from './DraggableAgentCard'
import styles from './Sidebar.module.scss'

export default function Sidebar() {
  const agents = useMemo(() => agentTypes, [])

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>AI Agents</h2>
        <p>Drag agents to canvas</p>
      </div>
      
      <div className={styles.agentList}>
        {agents.map((agent: AgentType) => (
          <DraggableAgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}