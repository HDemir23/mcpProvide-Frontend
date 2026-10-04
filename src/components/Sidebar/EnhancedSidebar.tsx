'use client'

import React, { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { NodeCategory } from '../../types/nodeTypes'
import { NodeFactory } from '../../lib/NodeFactory'
import { initializeNodeLibrary } from '../../lib/initializeNodes'
import DraggableNodeCard from './DraggableNodeCard'
import SearchInput from './SearchInput'
import CategoryTab from './CategoryTab'
import TemplateLibrary from '../Templates/TemplateLibrary'
import { WorkflowTemplate } from '../../types/templates'
import styles from './EnhancedSidebar.module.scss'

interface EnhancedSidebarProps {
  onLoadTemplate?: (template: WorkflowTemplate) => void;
}

export default function EnhancedSidebar({ onLoadTemplate }: EnhancedSidebarProps = {}) {
  const [activeTab, setActiveTab] = useState<'nodes' | 'templates'>('nodes')
  const [activeCategory, setActiveCategory] = useState<NodeCategory>(NodeCategory.TRIGGER)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize node library
  useEffect(() => {
    if (!isClient) return

    const initNodes = async () => {
      try {
        initializeNodeLibrary()
        // Give a small delay to ensure all nodes are registered
        setTimeout(() => {
          setIsLoading(false)
        }, 100)
      } catch (error) {
        console.error('Failed to initialize nodes:', error)
        setIsLoading(false)
      }
    }

    initNodes()
  }, [isClient])

  const categories = useMemo(() => [
    { key: NodeCategory.TRIGGER, name: 'Triggers', icon: '⚡', color: '#10B981' },
    { key: NodeCategory.ACTION, name: 'Actions', icon: '🔧', color: '#3B82F6' },
    { key: NodeCategory.CONDITION, name: 'Logic', icon: '🔀', color: '#EF4444' },
    { key: NodeCategory.AI, name: 'AI', icon: '🤖', color: '#F59E0B' },
    { key: NodeCategory.DATA, name: 'Data', icon: '📊', color: '#8B5CF6' },
    { key: NodeCategory.UTILITY, name: 'Utilities', icon: '⚙️', color: '#6B7280' }
  ], [])

  const filteredNodes = useMemo(() => {
    if (!isClient || isLoading) return []
    
    let nodes = NodeFactory.getNodesByCategory(activeCategory)
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      nodes = nodes.filter(node => 
        node.name.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query) ||
        node.subType.toLowerCase().includes(query)
      )
    }
    
    return nodes
  }, [activeCategory, searchQuery, isLoading, isClient])

  const getNodeCount = (category: NodeCategory) => {
    if (!isClient || isLoading) return 0
    return NodeFactory.getNodesByCategory(category).length
  }

  const handleLoadTemplate = (template: WorkflowTemplate) => {
    console.log('🔍 EnhancedSidebar Debug - handleLoadTemplate called with:', template);
    console.log('🔍 EnhancedSidebar Debug - onLoadTemplate handler exists:', !!onLoadTemplate);
    
    if (onLoadTemplate) {
      console.log('🔍 EnhancedSidebar Debug - Calling onLoadTemplate...');
      onLoadTemplate(template);
    } else {
      // Fallback: show alert if no handler provided
      console.warn('⚠️ EnhancedSidebar Debug - No onLoadTemplate handler provided');
      alert(`Loading template: ${template.name}`);
    }
  };

  // Show loading state on server and initial client render
  if (!isClient) {
    return (
      <div className={styles.enhancedSidebar}>
        <div className={styles.header}>
          <h2>Library</h2>
          <p>Loading...</p>
        </div>
        <div className={styles.loadingState}>
          <span className={styles.loadingSpinner}>⏳</span>
          <p>Initializing library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.enhancedSidebar}>
      <div className={styles.header}>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${activeTab === 'nodes' ? styles.active : ''}`}
            onClick={() => setActiveTab('nodes')}
          >
            📋 Nodes
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'templates' ? styles.active : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            📚 Templates
          </button>
        </div>
        {activeTab === 'nodes' && (
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search nodes..."
          />
        )}
      </div>
      
      {activeTab === 'nodes' ? (
        <>
          <div className={styles.categories}>
            {categories.map(category => (
              <CategoryTab
                key={category.key}
                category={category}
                active={activeCategory === category.key}
                onClick={() => setActiveCategory(category.key)}
                count={getNodeCount(category.key)}
              />
            ))}
          </div>
          
          <div className={styles.nodeList}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <span className={styles.loadingSpinner}>⏳</span>
                <p>Loading node library...</p>
                <small>Initializing nodes...</small>
              </div>
            ) : filteredNodes.length > 0 ? (
              filteredNodes.map(nodeType => (
                <DraggableNodeCard
                  key={nodeType.id}
                  nodeType={nodeType}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                {searchQuery ? (
                  <>
                    <span className={styles.emptyIcon}>🔍</span>
                    <p>No nodes found for "{searchQuery}"</p>
                    <small>Try a different search term</small>
                  </>
                ) : (
                  <>
                    <span className={styles.emptyIcon}>📦</span>
                    <p>No nodes in this category</p>
                    <small>Check if nodes are properly initialized</small>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className={styles.footer}>
            <div className={styles.stats}>
              Total: {isClient && !isLoading ? NodeFactory.getNodeCount() : 0} nodes
            </div>
          </div>
        </>
      ) : (
        <div className={styles.templateSection}>
          <TemplateLibrary
            onImportTemplate={handleLoadTemplate}
            onSelectTemplate={handleLoadTemplate}
          />
        </div>
      )}
    </div>
  )
}