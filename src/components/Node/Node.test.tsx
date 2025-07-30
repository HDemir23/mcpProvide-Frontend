/// <reference types="vitest/globals" />
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Node from './Node'
import { AgentType } from '@/types'

describe('Node', () => {
  const mockOnSelect = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
    mockOnDelete.mockClear()
  })

  const defaultNode = {
    id: 'node-1',
    type: 'agent' as const,
    position: { x: 100, y: 100 },
    data: {
      agentType: {
        id: 'gpt-3.5-turbo',
        name: 'Data Analysis',
        description: 'Analyze data and generate insights',
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        icon: '📊',
        maxTokens: 16385,
        costPer1K: 1,
      } as AgentType,
      config: {
        temperature: 0.7,
        maxTokens: 1000,
        taskDescription: 'Analyze the provided data',
        systemPrompt: 'You are a data analyst',
      },
    },
  }

  it('renders node with agent information', () => {
    render(
      <Node
        node={defaultNode}
        isSelected={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Data Analysis')).toBeInTheDocument()
    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('Analyze the provided data')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', () => {
    render(
      <Node
        node={defaultNode}
        isSelected={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    )

    const nodeElement = screen.getByText('Data Analysis').closest('div')
    fireEvent.click(nodeElement!)
    expect(mockOnSelect).toHaveBeenCalledWith('node-1')
  })

  it('shows selected state when isSelected is true', () => {
    const { container } = render(
      <Node
        node={defaultNode}
        isSelected={true}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    )

    const nodeElement = container.querySelector('[class*="selected"]')
    expect(nodeElement).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <Node
        node={defaultNode}
        isSelected={true}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByTitle('Delete node')
    fireEvent.click(deleteButton)
    expect(mockOnDelete).toHaveBeenCalledWith('node-1')
  })

  it('shows ready to configure status', () => {
    render(
      <Node
        node={defaultNode}
        isSelected={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Ready to configure')).toBeInTheDocument()
    expect(screen.getByText('$1/1K')).toBeInTheDocument()
  })
})
