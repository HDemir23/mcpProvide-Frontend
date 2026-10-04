'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WorkflowVersion, VersionComparison } from '../../types/versioning';
import { WorkflowVersionControl } from '../../lib/versioning/VersionControl';
import VersionComparator from './VersionComparator';
import styles from './VersionHistory.module.scss';

interface VersionHistoryProps {
  workflowId: string;
  onRestoreVersion?: (version: WorkflowVersion) => void;
  onCompareVersions?: (comparison: VersionComparison) => void;
}

export default function VersionHistory({ workflowId, onRestoreVersion, onCompareVersions }: VersionHistoryProps) {
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showComparator, setShowComparator] = useState(false);
  const [comparison, setComparison] = useState<VersionComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'stable' | 'tagged'>('all');

  const versionControl = useMemo(() => new WorkflowVersionControl(), []);

  const loadVersionHistory = useCallback(async () => {
    try {
      setLoading(true);
      await versionControl.initializeWorkflow(workflowId, {
        name: 'Current Workflow',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      let versionList: WorkflowVersion[];
      
      switch (filter) {
        case 'stable':
          versionList = await versionControl.getStableVersions();
          break;
        case 'tagged':
          versionList = (await versionControl.getVersionHistory()).filter(v => v.tags && v.tags.length > 0);
          break;
        default:
          versionList = await versionControl.getVersionHistory();
      }

      setVersions(versionList.reverse()); // Show newest first
    } catch (error) {
      console.error('Failed to load version history:', error);
    } finally {
      setLoading(false);
    }
  }, [workflowId, filter, versionControl]);

  useEffect(() => {
    loadVersionHistory();
  }, [loadVersionHistory]);

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    } else {
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  const handleCompareVersions = async () => {
    if (selectedVersions.length !== 2) return;

    try {
      const comparison = await versionControl.compareVersions(selectedVersions[0], selectedVersions[1]);
      setComparison(comparison);
      setShowComparator(true);
      onCompareVersions?.(comparison);
    } catch (error) {
      console.error('Failed to compare versions:', error);
    }
  };

  const handleRestoreVersion = async (version: WorkflowVersion) => {
    if (confirm(`Are you sure you want to restore to version ${version.version}? This will create a new version with the restored state.`)) {
      try {
        onRestoreVersion?.(version);
      } catch (error) {
        console.error('Failed to restore version:', error);
      }
    }
  };

  const handleTagVersion = async (versionId: string, tags: string[]) => {
    try {
      await versionControl.tagVersion(versionId, tags);
      loadVersionHistory(); // Refresh the list
    } catch (error) {
      console.error('Failed to tag version:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getVersionIcon = (version: WorkflowVersion) => {
    if (version.isStable) return '🏷️';
    if (version.tags?.includes('auto-save')) return '💾';
    if (version.tags?.includes('backup')) return '🔄';
    return '📝';
  };

  const getChangesSummary = (version: WorkflowVersion) => {
    if (!version.changesSummary) return null;
    
    const { changesSummary } = version;
    const totalChanges = 
      changesSummary.nodesAdded + 
      changesSummary.nodesRemoved + 
      changesSummary.nodesModified +
      changesSummary.edgesAdded + 
      changesSummary.edgesRemoved + 
      changesSummary.edgesModified;

    if (totalChanges === 0) return 'No changes';

    const changes: string[] = [];
    if (changesSummary.nodesAdded) changes.push(`+${changesSummary.nodesAdded} nodes`);
    if (changesSummary.nodesRemoved) changes.push(`-${changesSummary.nodesRemoved} nodes`);
    if (changesSummary.nodesModified) changes.push(`~${changesSummary.nodesModified} nodes`);
    if (changesSummary.edgesAdded) changes.push(`+${changesSummary.edgesAdded} edges`);
    if (changesSummary.edgesRemoved) changes.push(`-${changesSummary.edgesRemoved} edges`);

    return changes.join(', ');
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner}>⏳</span>
        <p>Loading version history...</p>
      </div>
    );
  }

  return (
    <div className={styles.versionHistory}>
      <div className={styles.header}>
        <h3>Version History</h3>
        <div className={styles.controls}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className={styles.filterSelect}
          >
            <option value="all">All Versions</option>
            <option value="stable">Stable Only</option>
            <option value="tagged">Tagged Only</option>
          </select>
          
          {selectedVersions.length === 2 && (
            <button 
              className={styles.compareButton}
              onClick={handleCompareVersions}
            >
              Compare Selected
            </button>
          )}
        </div>
      </div>

      {versions.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📝</span>
          <p>No versions found</p>
          <small>Versions will appear as you save changes</small>
        </div>
      ) : (
        <div className={styles.versionList}>
          {versions.map((version, index) => (
            <div 
              key={version.id}
              className={`${styles.versionItem} ${selectedVersions.includes(version.id) ? styles.selected : ''}`}
            >
              <div className={styles.versionHeader}>
                <div className={styles.versionInfo}>
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(version.id)}
                    onChange={() => handleVersionSelect(version.id)}
                    className={styles.versionCheckbox}
                  />
                  <span className={styles.versionIcon}>
                    {getVersionIcon(version)}
                  </span>
                  <div className={styles.versionDetails}>
                    <div className={styles.versionNumber}>
                      v{version.version}
                      {index === 0 && <span className={styles.currentBadge}>Current</span>}
                    </div>
                    <div className={styles.versionMessage}>{version.message}</div>
                  </div>
                </div>
                
                <div className={styles.versionMeta}>
                  <span className={styles.versionDate}>
                    {formatDate(version.timestamp)}
                  </span>
                  <span className={styles.versionAuthor}>
                    by {version.author}
                  </span>
                </div>
              </div>

              {version.tags && version.tags.length > 0 && (
                <div className={styles.versionTags}>
                  {version.tags.map(tag => (
                    <span key={tag} className={styles.versionTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.versionChanges}>
                <span className={styles.changesLabel}>Changes:</span>
                <span className={styles.changesSummary}>
                  {getChangesSummary(version) || 'Initial version'}
                </span>
              </div>

              <div className={styles.versionActions}>
                <button 
                  className={styles.actionButton}
                  onClick={() => handleRestoreVersion(version)}
                  disabled={index === 0}
                >
                  🔄 Restore
                </button>
                <button 
                  className={styles.actionButton}
                  onClick={() => {
                    const tags = prompt('Enter tags (comma-separated):');
                    if (tags) {
                      handleTagVersion(version.id, tags.split(',').map(t => t.trim()));
                    }
                  }}
                >
                  🏷️ Tag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showComparator && comparison && (
        <VersionComparator
          comparison={comparison}
          onClose={() => setShowComparator(false)}
        />
      )}
    </div>
  );
}