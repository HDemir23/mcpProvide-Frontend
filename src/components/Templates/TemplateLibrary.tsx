'use client'

import React, { useState, useMemo } from 'react';
import { WorkflowTemplate, TemplateCategory, TemplateFilter } from '../../types/templates';
import { WORKFLOW_TEMPLATES, getFeaturedTemplates, getPopularTemplates, searchTemplates, getTemplateStats } from '../../lib/templates/TemplateData';
import TemplateCard from './TemplateCard';
import TemplatePreview from './TemplatePreview';
import styles from './TemplateLibrary.module.scss';

interface TemplateLibraryProps {
  onSelectTemplate?: (template: WorkflowTemplate) => void;
  onImportTemplate?: (template: WorkflowTemplate) => void;
}

export default function TemplateLibrary({ onSelectTemplate, onImportTemplate }: TemplateLibraryProps) {
  const [activeTab, setActiveTab] = useState<'featured' | 'categories' | 'search'>('featured');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const stats = getTemplateStats();

  const filteredTemplates = useMemo(() => {
    switch (activeTab) {
      case 'featured':
        return getFeaturedTemplates();
      case 'categories':
        return selectedCategory 
          ? WORKFLOW_TEMPLATES.filter(template => template.category === selectedCategory)
          : WORKFLOW_TEMPLATES;
      case 'search':
        return searchQuery ? searchTemplates(searchQuery) : [];
      default:
        return WORKFLOW_TEMPLATES;
    }
  }, [activeTab, selectedCategory, searchQuery]);

  const categories = Object.values(TemplateCategory);

  const handlePreviewTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleImportTemplate = (template: WorkflowTemplate) => {
    onImportTemplate?.(template);
    setShowPreview(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className={styles.templateLibrary}>
      <div className={styles.header}>
        <h2>Template Library</h2>
        <div className={styles.stats}>
          <span>{stats.totalTemplates} templates</span>
          <span>⭐ {stats.averageRating.toFixed(1)} avg rating</span>
          <span>🔥 {getPopularTemplates(1)[0]?.usageCount} max usage</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'featured' ? styles.active : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          ⭐ Featured
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'categories' ? styles.active : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📂 Categories
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'search' ? styles.active : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search
        </button>
      </div>

      {activeTab === 'search' && (
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search templates by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <div className={styles.searchResults}>
              {filteredTemplates.length} result{filteredTemplates.length !== 1 ? 's' : ''} for "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className={styles.categoryFilter}>
          <button
            className={`${styles.categoryButton} ${selectedCategory === null ? styles.active : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories ({WORKFLOW_TEMPLATES.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({stats.categoryCounts[category] || 0})
            </button>
          ))}
        </div>
      )}

      {activeTab === 'featured' && (
        <div className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h3>⭐ Featured Templates</h3>
            <p>Hand-picked templates to get you started quickly</p>
          </div>
        </div>
      )}

      <div className={styles.templateGrid}>
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={() => handlePreviewTemplate(template)}
              onSelect={() => onSelectTemplate?.(template)}
              onImport={() => onImportTemplate?.(template)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            {activeTab === 'search' ? (
              <>
                <span className={styles.emptyIcon}>🔍</span>
                <h3>No templates found</h3>
                <p>Try different search terms or browse categories</p>
              </>
            ) : (
              <>
                <span className={styles.emptyIcon}>📦</span>
                <h3>No templates available</h3>
                <p>Check back later for new templates</p>
              </>
            )}
          </div>
        )}
      </div>

      {activeTab === 'featured' && (
        <div className={styles.additionalSections}>
          <div className={styles.section}>
            <h3>🔥 Most Popular</h3>
            <div className={styles.horizontalScroll}>
              {getPopularTemplates().map(template => (
                <div key={template.id} className={styles.miniCard}>
                  <h4>{template.name}</h4>
                  <p>{template.usageCount} uses</p>
                  <button onClick={() => handlePreviewTemplate(template)}>
                    Preview
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3>🏷️ Popular Tags</h3>
            <div className={styles.tagCloud}>
              {stats.popularTags.slice(0, 8).map(({ tag, count }) => (
                <button
                  key={tag}
                  className={styles.tagButton}
                  onClick={() => {
                    setSearchQuery(tag);
                    setActiveTab('search');
                  }}
                >
                  {tag} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPreview && selectedTemplate && (
        <TemplatePreview
          template={selectedTemplate}
          onClose={() => setShowPreview(false)}
          onImport={() => handleImportTemplate(selectedTemplate)}
        />
      )}
    </div>
  );
}