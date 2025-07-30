import { render, screen, fireEvent } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import Canvas from './Canvas'
import { Node } from '@/types'
import { vi } from 'vitest'

// Mock @dnd-kit/core
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core')
  return {
    ...actual,
    useDroppable: () => ({
      setNodeRef: vi.fn(),
      isOver: false,
    })
  }
})

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>
}

const mockNodes: Node[] = [
  {
    id: 'node-1',
    type: 'agent',
    position: { x: 100, y: 100 },
    data: {
      agentType: {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Test agent',
        provider: 'openai',
        model: 'gpt-4',
        icon: '🤖',
        maxTokens: 8000,
        costPer1K: 10
      },
      config: {}
    }
  }
]

test('renders empty canvas state', () => {
  render(
    <TestWrapper>
      <Canvas nodes={[]} connections={[]} />
    </TestWrapper>
  )
  
  expect(screen.getByText('Canvas Area')).toBeInTheDocument()
  expect(screen.getByText('Drag AI agents here to create your workflow')).toBeInTheDocument()
})

test('renders nodes when provided', () => {
  render(
    <TestWrapper>
      <Canvas nodes={mockNodes} connections={[]} />
    </TestWrapper>
  )
  
  expect(screen.getByText('GPT-4')).toBeInTheDocument()
  expect(screen.getByText('🤖')).toBeInTheDocument()
})

test('renders canvas controls', () => {
  render(
    <TestWrapper>
      <Canvas nodes={[]} connections={[]} />
    </TestWrapper>
  )
  
  expect(screen.getByTitle('Reset Zoom')).toBeInTheDocument()
  expect(screen.getByText('100%')).toBeInTheDocument()
})

test('zoom reset button works', () => {
  render(
    <TestWrapper>
      <Canvas nodes={[]} connections={[]} />
    </TestWrapper>
  )
  
  const resetButton = screen.getByTitle('Reset Zoom')
  fireEvent.click(resetButton)
  
  expect(screen.getByText('100%')).toBeInTheDocument()
})