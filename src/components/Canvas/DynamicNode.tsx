'use client'

import React, { memo, useState, useCallback, useMemo } from 'react'
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow'
import { DynamicNodeData, NodeFactory } from '../../lib/NodeFactory'
import { HandleDefinition, PropertyDefinition } from '../../types/nodeTypes'
import styles from './DynamicNode.module.scss'

// Map handle positions to ReactFlow positions
const positionMap = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
}

// Get handle color based on data type
const getHandleColor = (dataType: string): string => {
  switch (dataType) {
    case 'string': return '#10B981'
    case 'number': return '#3B82F6'
    case 'boolean': return '#F59E0B'
    case 'object': return '#8B5CF6'
    case 'array': return '#EF4444'
    case 'any': return '#6B7280'
    default: return '#6B7280'
  }
}

// Execution status indicator
const ExecutionStatus = ({ status }: { status: 'idle' | 'running' | 'success' | 'error' }) => {
  const statusConfig = {
    idle: { color: '#6B7280', icon: '⚪' },
    running: { color: '#F59E0B', icon: '🟡' },
    success: { color: '#10B981', icon: '🟢' },
    error: { color: '#EF4444', icon: '🔴' },
  }

  const config = statusConfig[status]
  
  return (
    <div 
      className={styles.executionStatus}
      style={{ color: config.color }}
      title={`Status: ${status}`}
    >
      {config.icon}
    </div>
  )
}

// Property renderer component
const NodePropertyRenderer = ({ 
  properties, 
  values, 
  onChange,
  isExpanded,
  errors 
}: { 
  properties: PropertyDefinition[], 
  values: Record<string, any>, 
  onChange: (name: string, value: any) => void,
  isExpanded: boolean,
  errors: Record<string, string>
}) => {
  if (properties.length === 0) return null

  const displayProperties = isExpanded ? properties : properties.slice(0, 2)

  return (
    <div className={styles.properties}>
      {displayProperties.map(prop => (
        <div key={prop.name} className={styles.property}>
          <label className={styles.propertyLabel}>
            {prop.label || prop.name}
            {prop.required && <span className={styles.required}>*</span>}:
          </label>
          {renderPropertyInput(prop, values[prop.name], (value) => onChange(prop.name, value))}
          {errors[prop.name] && (
            <div className={styles.propertyError}>{errors[prop.name]}</div>
          )}
          {prop.description && (
            <div className={styles.propertyDescription}>{prop.description}</div>
          )}
        </div>
      ))}
      {!isExpanded && properties.length > 2 && (
        <div className={styles.moreProperties}>
          +{properties.length - 2} more properties
        </div>
      )}
    </div>
  )
}

// Render property input based on type
const renderPropertyInput = (prop: PropertyDefinition, value: any, onChange: (value: any) => void) => {
  switch (prop.type) {
    case 'string':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={prop.placeholder}
          className={styles.propertyInput}
        />
      )
    case 'number':
      return (
        <input
          type="number"
          value={value || prop.default || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          min={prop.min}
          max={prop.max}
          step={prop.step}
          className={styles.propertyInput}
        />
      )
    case 'boolean':
      return (
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className={styles.propertyCheckbox}
        />
      )
    case 'select':
      return (
        <select
          value={value || prop.default || ''}
          onChange={(e) => onChange(e.target.value)}
          className={styles.propertySelect}
        >
          {prop.options?.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={prop.placeholder}
          className={styles.propertyTextarea}
          rows={2}
        />
      )
    case 'json':
      return (
        <textarea
          value={value || '{}'}
          onChange={(e) => onChange(e.target.value)}
          placeholder={prop.placeholder || '{}'}
          className={styles.propertyTextarea}
          rows={3}
        />
      )
    case 'condition_builder':
      return (
        <div className={styles.conditionBuilder}>
          <span>Condition Builder</span>
          <button 
            className={styles.configureButton}
            onClick={() => {/* Open condition builder modal */}}
          >
            Configure
          </button>
        </div>
      )
    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={styles.propertyInput}
        />
      )
  }
}

const DynamicNode = memo(({ data, selected, id }: NodeProps<DynamicNodeData>) => {
  const { nodeType, properties, executionState, onDelete, onSelect, isSelected } = data
  const [isExpanded, setIsExpanded] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { setNodes } = useReactFlow()

  const handlePropertyChange = useCallback((name: string, value: any) => {
    // Update node properties
    setNodes((nodes) => 
      nodes.map((node) => {
        if (node.id === id) {
          const updatedNode = NodeFactory.updateNodeProperties(node as any, { [name]: value })
          
          // Validate properties
          const errors = NodeFactory.validateNodeData(nodeType.id, updatedNode.data.properties)
          const errorMap: Record<string, string> = {}
          errors.forEach(error => {
            const match = error.match(/Property '([^']+)'/)
            if (match) {
              errorMap[match[1]] = error
            }
          })
          setValidationErrors(errorMap)
          
          return updatedNode
        }
        return node
      })
    )
  }, [id, nodeType.id, setNodes])

  // Memoize expensive computations
  const hasErrors = useMemo(() => Object.keys(validationErrors).length > 0, [validationErrors])
  
  const inputHandles = useMemo(() => 
    nodeType.inputs.map((input: HandleDefinition) => (
      <Handle
        key={input.id}
        type="target"
        position={positionMap[input.position]}
        id={input.id}
        style={{ 
          background: getHandleColor(input.dataType),
          border: `2px solid ${getHandleColor(input.dataType)}`,
          width: 12,
          height: 12,
        }}
        title={`${input.name} (${input.dataType})`}
      />
    )), [nodeType.inputs]
  )

  const outputHandles = useMemo(() => 
    nodeType.outputs.map((output: HandleDefinition) => (
      <Handle
        key={output.id}
        type="source" 
        position={positionMap[output.position]}
        id={output.id}
        style={{ 
          background: getHandleColor(output.dataType),
          border: `2px solid ${getHandleColor(output.dataType)}`,
          width: 12,
          height: 12,
        }}
        title={`${output.name} (${output.dataType})`}
      />
    )), [nodeType.outputs]
  )

  const nodeClassName = useMemo(() => 
    `${styles.dynamicNode} ${styles[nodeType.category]} ${selected ? styles.selected : ''} ${hasErrors ? styles.hasErrors : ''}`,
    [nodeType.category, selected, hasErrors]
  )

  return (
    <div 
      className={nodeClassName}
      style={{ borderColor: hasErrors ? '#EF4444' : nodeType.color }}
    >
      {/* Render input handles */}
      {inputHandles}
      
      {/* Render output handles */}
      {outputHandles}
      
      {/* Node header */}
      <div className={styles.header} onClick={onSelect}>
        <span className={styles.icon}>{nodeType.icon}</span>
        <span className={styles.name}>{nodeType.name}</span>
        <ExecutionStatus status={executionState} />
        <div className={styles.headerButtons}>
          {nodeType.properties.length > 0 && (
            <button
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              title="Expand/Collapse Properties"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {onDelete && (
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${nodeType.name} node?`)) {
                  onDelete();
                }
              }}
              title="Delete Node"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Node description */}
      <div className={styles.description}>
        {nodeType.description}
      </div>
      
      {/* Node properties (only show if expanded or if there are few properties) */}
      {(isExpanded || nodeType.properties.length <= 2) && (
        <NodePropertyRenderer 
          properties={nodeType.properties}
          values={properties}
          onChange={handlePropertyChange}
          isExpanded={isExpanded}
          errors={validationErrors}
        />
      )}
      
      {/* Validation errors summary */}
      {hasErrors && !isExpanded && (
        <div className={styles.errorSummary}>
          ⚠️ {Object.keys(validationErrors).length} configuration error{Object.keys(validationErrors).length > 1 ? 's' : ''}
        </div>
      )}
      
      {/* Handle labels */}
      <div className={styles.handleLabels}>
        {nodeType.inputs.map((input: HandleDefinition) => (
          <div
            key={input.id}
            className={`${styles.handleLabel} ${styles[input.position]}`}
          >
            {input.name}
          </div>
        ))}
        {nodeType.outputs.map((output: HandleDefinition) => (
          <div
            key={output.id}
            className={`${styles.handleLabel} ${styles[output.position]}`}
          >
            {output.name}
          </div>
        ))}
      </div>
    </div>
  )
})

DynamicNode.displayName = 'DynamicNode'

export default DynamicNode