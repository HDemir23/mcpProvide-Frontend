'use client'

import React, { useState } from 'react';
import { WorkflowTemplate } from '../../types/templates';
import { generateCustomModeConfig, hasCustomModeOutput } from '../../lib/templates/TemplateData';
import styles from './TemplateCard.module.scss';

interface TemplateCardProps {
  template: WorkflowTemplate;
  onPreview: () => void;
  onSelect: () => void;
  onImport: () => void;
  onGenerateCustomModes?: () => void;
}

export default function TemplateCard({ template, onPreview, onSelect, onImport, onGenerateCustomModes }: TemplateCardProps) {
  const [showCustomModeOutput, setShowCustomModeOutput] = useState(false);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleGenerateOutput = async () => {
    if (hasCustomModeOutput(template)) {
      const output = generateCustomModeConfig(template);
      await copyToClipboard(output);
      setShowCustomModeOutput(true);
    }
  };

  return (
    <div className={`${styles.templateCard} ${template.featured ? styles.featured : ''}`}>
      {template.featured && (
        <div className={styles.featuredBadge}>
          ⭐ Featured
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.categoryIcon}>
          {getCategoryIcon(template.category)}
        </div>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{template.name}</h3>
          <p className={styles.category}>{template.category}</p>
        </div>
        <div className={styles.version}>
          v{template.version}
        </div>
      </div>

      <p className={styles.description}>{template.description}</p>

      <div className={styles.tags}>
        {template.tags.slice(0, 3).map(tag => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
        {template.tags.length > 3 && (
          <span className={styles.moreTagsIndicator}>
            +{template.tags.length - 3}
          </span>
        )}
      </div>

      <div className={styles.metadata}>
        <div className={styles.difficulty}>
          <span 
            className={styles.difficultyDot}
            style={{ backgroundColor: getDifficultyColor(template.difficulty) }}
          />
          {template.difficulty}
        </div>
        <div className={styles.time}>
          ⏱️ {template.estimatedTime}
        </div>
        <div className={styles.nodes}>
          📋 {template.nodes.length} nodes
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.rating}>
          ⭐ {template.rating?.toFixed(1) || 'N/A'}
        </div>
        <div className={styles.usage}>
          📊 {template.usageCount?.toLocaleString() || 0} uses
        </div>
        <div className={styles.updated}>
          Updated {formatDate(template.updatedAt)}
        </div>
      </div>

      {hasCustomModeOutput(template) && (
        <div className={styles.customModeSection}>
          <div className={styles.customModeBadge}>
            🎯 Custom Mode Generator
          </div>
          <p className={styles.customModeDescription}>
            This template generates ready-to-use custom mode configurations
          </p>
          {showCustomModeOutput && (
            <div className={styles.outputSection}>
              <div className={styles.outputHeader}>
                <span>Generated Configuration:</span>
                <button 
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(generateCustomModeConfig(template))}
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
              <pre className={styles.codeOutput}>
                {generateCustomModeConfig(template)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button 
          className={styles.previewButton}
          onClick={onPreview}
        >
          👁️ Preview
        </button>
        {hasCustomModeOutput(template) ? (
          <button 
            className={styles.generateButton}
            onClick={handleGenerateOutput}
          >
            🎯 Generate Config
          </button>
        ) : (
          <button 
            className={styles.importButton}
            onClick={onImport}
          >
            📥 Import
          </button>
        )}
        {onGenerateCustomModes && (
          <button 
            className={styles.yamlButton}
            onClick={onGenerateCustomModes}
            title="Generate Custom Modes YAML"
          >
            📄 YAML
          </button>
        )}
      </div>

      {template.author && (
        <div className={styles.author}>
          by {template.author}
        </div>
      )}
    </div>
  );
}