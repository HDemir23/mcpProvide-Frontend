/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Connection from './Connection';

describe('Connection', () => {
  const mockOnSelect = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnDelete.mockClear();
  });

  const defaultConnection = {
    id: 'conn-1',
    source: 'node-1',
    target: 'node-2',
    type: 'default' as const
  };

  const sourcePosition = { x: 100, y: 100 };
  const targetPosition = { x: 300, y: 200 };

  it('renders connection path', () => {
    render(
      <svg>
        <Connection
          connection={defaultConnection}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const paths = document.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('calls onSelect when clicked', () => {
    render(
      <svg>
        <Connection
          connection={defaultConnection}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const path = document.querySelector('path[stroke="var(--connection-color, #666)"]');
    fireEvent.click(path!);
    expect(mockOnSelect).toHaveBeenCalledWith('conn-1');
  });

  it('shows delete button when selected', () => {
    render(
      <svg>
        <Connection
          connection={defaultConnection}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          isSelected={true}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const deleteButton = screen.getByTitle('Delete connection');
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <svg>
        <Connection
          connection={defaultConnection}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          isSelected={true}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const deleteButton = screen.getByTitle('Delete connection');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith('conn-1');
  });

  it('renders connection label when provided', () => {
    const connectionWithLabel = {
      ...defaultConnection,
      label: 'Success'
    };

    render(
      <svg>
        <Connection
          connection={connectionWithLabel}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders dashed line for conditional connections', () => {
    const conditionalConnection = {
      ...defaultConnection,
      type: 'conditional' as const
    };

    render(
      <svg>
        <Connection
          connection={conditionalConnection}
          sourcePosition={sourcePosition}
          targetPosition={targetPosition}
          onSelect={mockOnSelect}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const dashedPath = document.querySelector('path[stroke-dasharray="5,5"]');
    expect(dashedPath).toBeInTheDocument();
  });
});