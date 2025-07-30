'use client'

import React, { useState } from 'react';
import { WorkflowTemplate } from '../../types/templates';
import styles from './TemplatePreview.module.scss';

interface TemplatePreviewProps {
  template: WorkflowTemplate;
  onClose: () => void;
  onImport: () => void;
}

export default function TemplatePreview({ template, onClose, onImport }: TemplatePreviewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'setup'>('overview');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & Content': return '🤖';
      case 'Data Processing': return '📊';
      case 'Automation': return '⚙️';
      case 'Integration': return '🔗';
      case 'Analytics': return '📈';
      case 'Communication': return '💬';
      case 'Utility': return '🛠️';
      case 'Business Process': return '💼';
      default: return '📋';
    }
  };

  const getNodeTypeIcon = (nodeType: string) => {
    const iconMap: Record<string, string> = {
      'manual_trigger': '▶️',
      'webhook_trigger': '🌐',
      'schedule_trigger': '⏰',
      'email_trigger': '📧',
      'file_trigger': '📁',
      'http_request': '🌐',
      'email_send': '📤',
      'database': '🗄️',
      'file_operation': '📄',
      'llm_chat': '🤖',
      'text_classifier': '🏷️',
      'image_analyzer': '👁️',
      'if_condition': '❓',
      'switch': '🔀',
      'filter': '🔍',
      'json_parser': '📄',
      'csv_parser': '📊',
      'data_transformer': '🔄',
      'delay': '⏱️',
      'code': '💻',
      'merge': '🔗'
    };
    return iconMap[nodeType] || '📋';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.categoryIcon}>
              {getCategoryIcon(template.category)}
            </div>
            <div>
              <h2>{template.name}</h2>
              <p className={styles.category}>{template.category}</p>
            </div>
            {template.featured && (
              <div className={styles.featuredBadge}>⭐ Featured</div>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📋 Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'workflow' ? styles.active : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            🔄 Workflow
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'setup' ? styles.active : ''}`}
            onClick={() => setActiveTab('setup')}
          >
            ⚙️ Setup
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.description}>
                <h3>Description</h3>
                <p>{template.description}</p>
              </div>

              <div className={styles.metadata}>
                <div className={styles.metadataGrid}>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Difficulty:</span>
                    <span 
                      className={styles.difficulty}
                      style={{ color: getDifficultyColor(template.difficulty) }}
                    >
                      {template.difficulty}
                    </span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Time to set up:</span>
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Nodes:</span>
                    <span>{template.nodes.length}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Connections:</span>
                    <span>{template.edges.length}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Version:</span>
                    <span>v{template.version}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>Updated:</span>
                    <span>{formatDate(template.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.tags}>
                <h3>Tags</h3>
                <div className={styles.tagList}>
                  {template.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    ⭐ {template.rating?.toFixed(1) || 'N/A'}
                  </span>
                  <span className={styles.statLabel}>Rating</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    📊 {template.usageCount?.toLocaleString() || 0}
                  </span>
                  <span className={styles.statLabel}>Uses</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className={styles.workflow}>
              <div className={styles.workflowOverview}>
                <h3>Workflow Structure</h3>
                <p>This workflow contains {template.nodes.length} nodes connected by {template.edges.length} edges.</p>
              </div>

              <div className={styles.nodeList}>
                <h4>Nodes in this workflow:</h4>
                {template.nodes.map((node, index) => (
                  <div key={node.id} className={styles.nodeItem}>
                    <span className={styles.nodeIcon}>
                      {getNodeTypeIcon(node.data?.nodeType?.id || 'unknown')}
                    </span>
                    <div className={styles.nodeInfo}>
                      <span className={styles.nodeName}>
                        {node.data?.nodeType?.name || `Node ${index + 1}`}
                      </span>
                      <span className={styles.nodeType}>
                        {node.data?.nodeType?.category || 'Unknown'}
                      </span>
                    </div>
                    <span className={styles.nodePosition}>
                      ({Math.round(node.position.x)}, {Math.round(node.position.y)})
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.connectionList}>
                <h4>Connections:</h4>
                {template.edges.map((edge, index) => (
                  <div key={edge.id} className={styles.connectionItem}>
                    <span className={styles.connectionIndex}>{index + 1}.</span>
                    <span className={styles.connectionFlow}>
                      Node → Node via {edge.sourceHandle} → {edge.targetHandle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className={styles.setup}>
              <div className={styles.setupInstructions}>
                <h3>Setup Instructions</h3>
                <div className={styles.stepList}>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>1</span>
                    <div className={styles.stepContent}>
                      <h4>Import Template</h4>
                      <p>Click the "Import Template" button to add this workflow to your canvas.</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>2</span>
                    <div className={styles.stepContent}>
                      <h4>Configure Nodes</h4>
                      <p>Update node properties with your specific values (API keys, endpoints, etc.).</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>3</span>
                    <div className={styles.stepContent}>
                      <h4>Test Workflow</h4>
                      <p>Run the workflow to ensure all connections and configurations work properly.</p>
                    </div>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>4</span>
                    <div className={styles.stepContent}>
                      <h4>Deploy</h4>
                      <p>Save and activate your workflow for production use.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.requirements}>
                <h3>Requirements</h3>
                <ul className={styles.requirementList}>
                  <li>✅ All node types are available in your installation</li>
                  <li>⚠️ You may need to configure API keys and credentials</li>
                  <li>⚠️ Some nodes may require external services</li>
                  <li>ℹ️ Review and test all connections before deployment</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.authorInfo}>
            {template.author && (
              <span>Created by {template.author}</span>
            )}
          </div>
          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.importButton} onClick={onImport}>
              📥 Import Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}