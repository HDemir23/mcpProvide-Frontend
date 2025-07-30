import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import Sidebar from './Sidebar'
import { vi } from 'vitest'

// Mock the dnd-kit/core module
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core')
  return {
    ...actual,
    useDraggable: () => ({
      attributes: {},
      listeners: {},
      setNodeRef: () => {},
      transform: null,
      isDragging: false,
    })
  }
})

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>
}

test('renders sidebar with AI agents', () => {
  render(
    <TestWrapper>
      <Sidebar />
    </TestWrapper>
  )
  
  expect(screen.getByText('AI Agents')).toBeInTheDocument()
  expect(screen.getByText('Drag agents to canvas')).toBeInTheDocument()
  expect(screen.getByText('GPT-4 Turbo')).toBeInTheDocument()
  expect(screen.getByText('Claude 3 Sonnet')).toBeInTheDocument()
  expect(screen.getByText('Gemini Pro')).toBeInTheDocument()
})

test('displays agent information correctly', () => {
  render(
    <TestWrapper>
      <Sidebar />
    </TestWrapper>
  )
  
  expect(screen.getByText('Most capable OpenAI model')).toBeInTheDocument()
  expect(screen.getByText('$10/1K tokens')).toBeInTheDocument()
  expect(screen.getAllByText('openai')[0]).toBeInTheDocument()
})