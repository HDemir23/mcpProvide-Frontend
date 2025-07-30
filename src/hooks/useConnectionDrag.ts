'use client'

import { useState, useCallback, useRef } from 'react'

interface ConnectionDragState {
  isDragging: boolean
  sourceNodeId: string | null
  sourceHandle: 'input' | 'output' | null
  currentPosition: { x: number; y: number } | null
}

export function useConnectionDrag() {
  const [dragState, setDragState] = useState<ConnectionDragState>({
    isDragging: false,
    sourceNodeId: null,
    sourceHandle: null,
    currentPosition: null
  })
  
  const canvasRef = useRef<HTMLDivElement>(null)

  const startConnection = useCallback((
    nodeId: string, 
    handle: 'input' | 'output',
    position: { x: number; y: number }
  ) => {
    setDragState({
      isDragging: true,
      sourceNodeId: nodeId,
      sourceHandle: handle,
      currentPosition: position
    })
  }, [])

  const updateConnectionPosition = useCallback((position: { x: number; y: number }) => {
    setDragState(prev => prev.isDragging ? {
      ...prev,
      currentPosition: position
    } : prev)
  }, [])

  const endConnection = useCallback((
    targetNodeId?: string,
    targetHandle?: 'input' | 'output'
  ) => {
    const result = dragState.isDragging && dragState.sourceNodeId && targetNodeId ? {
      source: dragState.sourceNodeId,
      target: targetNodeId,
      sourceHandle: dragState.sourceHandle!,
      targetHandle: targetHandle!
    } : null

    setDragState({
      isDragging: false,
      sourceNodeId: null,
      sourceHandle: null,
      currentPosition: null
    })

    return result
  }, [dragState])

  const cancelConnection = useCallback(() => {
    setDragState({
      isDragging: false,
      sourceNodeId: null,
      sourceHandle: null,
      currentPosition: null
    })
  }, [])

  return {
    dragState,
    startConnection,
    updateConnectionPosition,
    endConnection,
    cancelConnection,
    canvasRef
  }
}