'use client'

import { useMemo } from 'react'
import { Connection as ConnectionType } from '@/types'
import styles from './Connection.module.scss'

interface ConnectionProps {
  connection: ConnectionType
  sourcePosition: { x: number; y: number }
  targetPosition: { x: number; y: number }
  isSelected?: boolean
  onSelect?: (connectionId: string) => void
  onDelete?: (connectionId: string) => void
}

export default function Connection({ 
  connection, 
  sourcePosition, 
  targetPosition, 
  isSelected, 
  onSelect, 
  onDelete 
}: ConnectionProps) {
  const path = useMemo(() => {
    const dx = targetPosition.x - sourcePosition.x
    const dy = targetPosition.y - sourcePosition.y
    
    // Bezier curve control points for smooth connection
    const controlOffset = Math.abs(dx) * 0.4
    const cp1x = sourcePosition.x + controlOffset
    const cp1y = sourcePosition.y
    const cp2x = targetPosition.x - controlOffset  
    const cp2y = targetPosition.y
    
    return `M ${sourcePosition.x} ${sourcePosition.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetPosition.x} ${targetPosition.y}`
  }, [sourcePosition, targetPosition])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(connection.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(connection.id)
  }

  return (
    <g className={`${styles.connection} ${isSelected ? styles.selected : ''}`}>
      {/* Main connection path */}
      <path
        d={path}
        className={styles.connectionPath}
        onClick={handleClick}
        fill="none"
        stroke="var(--connection-color, #666)"
        strokeWidth="2"
        strokeDasharray="none"
      />
      
      {/* Invisible wider path for easier click targeting */}
      <path
        d={path}
        className={styles.connectionHitArea}
        onClick={handleClick}
        fill="none"
        stroke="transparent"
        strokeWidth="12"
      />
      
      {/* Arrow marker */}
      <defs>
        <marker
          id={`arrow-${connection.id}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="3"
          markerUnits="strokeWidth"
          markerWidth="4"
          markerHeight="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="var(--connection-color, #666)" />
        </marker>
      </defs>
      
      {/* Apply arrow marker to main path */}
      <path
        d={path}
        fill="none"
        stroke="var(--connection-color, #666)"
        strokeWidth="2"
        markerEnd={`url(#arrow-${connection.id})`}
        pointerEvents="none"
      />
      
      {/* Delete button when selected */}
      {isSelected && (
        <foreignObject
          x={(sourcePosition.x + targetPosition.x) / 2 - 12}
          y={(sourcePosition.y + targetPosition.y) / 2 - 12}
          width="24"
          height="24"
        >
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            title="Delete connection"
          >
            ×
          </button>
        </foreignObject>
      )}
      
      {/* Connection label */}
      {/* Connection labels removed for now */}
    </g>
  )
}