'use client'

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { AgentType } from '@/types'

interface DndProviderProps {
  children: React.ReactNode
  onDragEnd?: (event: DragEndEvent) => void
}

export default function DndProvider({ children, onDragEnd }: DndProviderProps) {
  const [activeAgent, setActiveAgent] = useState<AgentType | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const agent = event.active.data.current?.agent
    if (agent) {
      setActiveAgent(agent)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveAgent(null)
    onDragEnd?.(event)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay>
        {activeAgent ? (
          <div style={{ 
            padding: '8px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{activeAgent.icon}</span>
            <span>{activeAgent.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}