'use client'

import { useState, useCallback } from 'react'
import { Node, AgentType } from '@/types'
import styles from './NodeForm.module.scss'

interface NodeFormProps {
  node: Node
  onUpdate: (nodeId: string, data: any) => void
  onClose: () => void
}

export default function NodeForm({ node, onUpdate, onClose }: NodeFormProps) {
  // Check if this is a dynamic node (new format) or legacy node (old format)
  const isDynamicNode = node.data.nodeType && node.data.properties !== undefined
  
  const [formData, setFormData] = useState(() => {
    if (isDynamicNode) {
      // For dynamic nodes, use properties
      return { ...node.data.properties }
    } else {
      // For legacy nodes, use config
      return {
        taskDescription: node.data.config?.taskDescription || '',
        temperature: node.data.config?.temperature || 0.7,
        maxTokens: node.data.config?.maxTokens || 1000,
        systemPrompt: node.data.config?.systemPrompt || '',
        selectedModel: node.data.config?.selectedModel || node.data.agentType?.model,
        customPrice: node.data.config?.customPrice || node.data.agentType?.costPer1K,
      }
    }
  })

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (isDynamicNode) {
      // For dynamic nodes, update properties
      onUpdate(node.id, {
        ...node.data,
        properties: {
          ...node.data.properties,
          ...formData
        }
      })
    } else {
      // For legacy nodes, update config
      onUpdate(node.id, {
        ...node.data,
        config: {
          ...node.data.config,
          ...formData
        }
      })
    }
    onClose()
  }, [node.id, node.data, formData, onUpdate, onClose, isDynamicNode])

  const handleChange = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }, [])

  // Render dynamic form for new node types
  const renderDynamicForm = () => {
    const nodeType = node.data.nodeType
    return (
      <div className={styles.nodeForm}>
        <div className={styles.header}>
          <div className={styles.agentInfo}>
            <span className={styles.icon}>{nodeType.icon}</span>
            <div>
              <h3>{nodeType.name}</h3>
              <p>{nodeType.description}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {nodeType.properties.map((prop: any) => (
            <div key={prop.name} className={styles.field}>
              <label htmlFor={prop.name}>{prop.label || prop.name}</label>
              {prop.type === 'string' && (
                <input
                  id={prop.name}
                  type="text"
                  value={formData[prop.name] || ''}
                  onChange={(e) => handleChange(prop.name, e.target.value)}
                  placeholder={prop.placeholder}
                  required={prop.required}
                />
              )}
              {prop.type === 'textarea' && (
                <textarea
                  id={prop.name}
                  value={formData[prop.name] || ''}
                  onChange={(e) => handleChange(prop.name, e.target.value)}
                  placeholder={prop.placeholder}
                  required={prop.required}
                  rows={3}
                />
              )}
              {prop.type === 'json' && (
                <textarea
                  id={prop.name}
                  value={formData[prop.name] || '{}'}
                  onChange={(e) => handleChange(prop.name, e.target.value)}
                  placeholder={prop.placeholder}
                  required={prop.required}
                  rows={4}
                />
              )}
              {prop.type === 'number' && (
                <input
                  id={prop.name}
                  type="number"
                  value={formData[prop.name] || ''}
                  onChange={(e) => handleChange(prop.name, parseFloat(e.target.value))}
                  placeholder={prop.placeholder}
                  required={prop.required}
                  min={prop.min}
                  max={prop.max}
                  step={prop.step}
                />
              )}
              {prop.type === 'select' && (
                <select
                  id={prop.name}
                  value={formData[prop.name] || ''}
                  onChange={(e) => handleChange(prop.name, e.target.value)}
                  required={prop.required}
                >
                  <option value="">Select...</option>
                  {prop.options?.map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              {prop.type === 'boolean' && (
                <input
                  id={prop.name}
                  type="checkbox"
                  checked={formData[prop.name] || false}
                  onChange={(e) => handleChange(prop.name, e.target.checked)}
                />
              )}
            </div>
          ))}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Render legacy form for AI agent nodes
  const renderLegacyForm = () => (
    <div className={styles.nodeForm}>
      <div className={styles.header}>
        <div className={styles.agentInfo}>
          <span className={styles.icon}>{node.data.agentType?.icon}</span>
          <div>
            <h3>{node.data.agentType?.name}</h3>
            <p>{node.data.agentType?.description}</p>
          </div>
        </div>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="taskDescription">Task Description</label>
          <textarea
            id="taskDescription"
            value={formData.taskDescription || ''}
            onChange={(e) => handleChange('taskDescription', e.target.value)}
            placeholder="Describe what this agent should do..."
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="systemPrompt">System Prompt (Optional)</label>
          <textarea
            id="systemPrompt"
            value={formData.systemPrompt || ''}
            onChange={(e) => handleChange('systemPrompt', e.target.value)}
            placeholder="System instructions for the agent..."
            rows={2}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="selectedModel">Model</label>
          <select
            id="selectedModel"
            value={formData.selectedModel || ''}
            onChange={(e) => handleChange('selectedModel', e.target.value)}
          >
            <option value={node.data.agentType?.model}>{node.data.agentType?.model} (Default)</option>
            {node.data.agentType?.provider === 'openai' && (
              <>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </>
            )}
            {node.data.agentType?.provider === 'google' && (
              <>
                <option value="gemini-pro">Gemini Pro</option>
                <option value="gemini-pro-vision">Gemini Pro Vision</option>
              </>
            )}
            {node.data.agentType?.provider === 'anthropic' && (
              <>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
              </>
            )}
          </select>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="temperature">Temperature</label>
            <input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={formData.temperature || 0.7}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            />
            <span className={styles.rangeValue}>{formData.temperature || 0.7}</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="maxTokens">Max Tokens</label>
            <input
              id="maxTokens"
              type="number"
              min="1"
              max={node.data.agentType?.maxTokens || 4000}
              value={formData.maxTokens || 1000}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="customPrice">Custom Price ($/1K tokens)</label>
          <input
            id="customPrice"
            type="number"
            min="0"
            step="0.001"
            value={formData.customPrice || ''}
            onChange={(e) => handleChange('customPrice', parseFloat(e.target.value))}
            placeholder={`Default: $${node.data.agentType?.costPer1K || 0}`}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.saveButton}>
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  )

  return isDynamicNode ? renderDynamicForm() : renderLegacyForm()
}