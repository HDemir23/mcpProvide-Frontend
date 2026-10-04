'use client'

import React, { useState } from 'react';
import { VersionComparison, VersionChange } from '../../types/versioning';
import styles from './VersionComparator.module.scss';

interface VersionComparatorProps {
  comparison: VersionComparison;
  onClose: () => void;
}

export default function VersionComparator({ comparison, onClose }: VersionComparatorProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'visual'>('summary');

  const { fromVersion, toVersion, changes, summary } = comparison;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getChangeTypeIcon = (type: VersionChange['type']) => {
    switch (type) {
      case 'node_added': return '➕';
      case 'node_removed': return '➖';
      case 'node_modified': return '✏️';
      case 'edge_added': return '🔗';
      case 'edge_removed': return '🔓';
      case 'edge_modified': return '🔄';
      case 'property_changed': return '⚙️';
      default: return '📝';
    }
  };

  const getChangeTypeColor = (type: VersionChange['type']) => {
    switch (type) {
      case 'node_added':
      case 'edge_added':
        return '#10B981'; // Green
      case 'node_removed':
      case 'edge_removed':
        return '#EF4444'; // Red
      case 'node_modified':
      case 'edge_modified':
      case 'property_changed':
        return '#F59E0B'; // Orange
      default:
        return '#6B7280'; // Gray
    }
  };

  const getTotalChanges = () => {
    return summary.nodesAdded + summary.nodesRemoved + summary.nodesModified +
           summary.edgesAdded + summary.edgesRemoved + summary.edgesModified;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Helper function for node type breakdown
  const getNodeTypeBreakdown = (nodes: any[]): [string, number][] => {
    const breakdown = nodes.reduce((acc, node) => {
      const category = node.data?.nodeType?.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown).sort(([,a], [,b]) => (b as number) - (a as number)) as [string, number][];
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.versionInfo}>
            <h2>Version Comparison</h2>
            <div className={styles.versionRange}>
              <span className={styles.fromVersion}>
                v{fromVersion.version} ({formatDate(fromVersion.timestamp)})
              </span>
              <span className={styles.arrow}>→</span>
              <span className={styles.toVersion}>
                v{toVersion.version} ({formatDate(toVersion.timestamp)})
              </span>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'summary' ? styles.active : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            📊 Summary
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
            onClick={() => setActiveTab('details')}
          >
            📋 Details ({changes.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'visual' ? styles.active : ''}`}
            onClick={() => setActiveTab('visual')}
          >
            👁️ Visual Diff
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'summary' && (
            <div className={styles.summary}>
              <div className={styles.summaryStats}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{getTotalChanges()}</div>
                  <div className={styles.statLabel}>Total Changes</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {toVersion.snapshot.nodes.length - fromVersion.snapshot.nodes.length}
                  </div>
                  <div className={styles.statLabel}>Net Node Change</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>
                    {toVersion.snapshot.edges.length - fromVersion.snapshot.edges.length}
                  </div>
                  <div className={styles.statLabel}>Net Edge Change</div>
                </div>
              </div>

              <div className={styles.changeCategories}>
                <h3>Changes by Category</h3>
                <div className={styles.categoryGrid}>
                  <div className={styles.categoryCard}>
                    <h4>Nodes</h4>
                    <div className={styles.categoryStats}>
                      <div className={styles.categoryStat}>
                        <span className={styles.addedCount}>+{summary.nodesAdded}</span>
                        <span className={styles.addedLabel}>Added</span>
                      </div>
                      <div className={styles.categoryStat}>
                        <span className={styles.removedCount}>-{summary.nodesRemoved}</span>
                        <span className={styles.removedLabel}>Removed</span>
                      </div>
                      <div className={styles.categoryStat}>
                        <span className={styles.modifiedCount}>~{summary.nodesModified}</span>
                        <span className={styles.modifiedLabel}>Modified</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.categoryCard}>
                    <h4>Connections</h4>
                    <div className={styles.categoryStats}>
                      <div className={styles.categoryStat}>
                        <span className={styles.addedCount}>+{summary.edgesAdded}</span>
                        <span className={styles.addedLabel}>Added</span>
                      </div>
                      <div className={styles.categoryStat}>
                        <span className={styles.removedCount}>-{summary.edgesRemoved}</span>
                        <span className={styles.removedLabel}>Removed</span>
                      </div>
                      <div className={styles.categoryStat}>
                        <span className={styles.modifiedCount}>~{summary.edgesModified}</span>
                        <span className={styles.modifiedLabel}>Modified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {summary.propertiesChanged.length > 0 && (
                <div className={styles.propertiesChanged}>
                  <h3>Properties Changed</h3>
                  <div className={styles.propertyList}>
                    {summary.propertiesChanged.map(prop => (
                      <span key={prop} className={styles.propertyTag}>
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className={styles.details}>
              {changes.length === 0 ? (
                <div className={styles.noChanges}>
                  <span className={styles.noChangesIcon}>✨</span>
                  <p>No changes between these versions</p>
                </div>
              ) : (
                <div className={styles.changeList}>
                  {changes.map((change, index) => (
                    <div 
                      key={index}
                      className={styles.changeItem}
                      style={{ borderLeft: `4px solid ${getChangeTypeColor(change.type)}` }}
                    >
                      <div className={styles.changeHeader}>
                        <span className={styles.changeIcon}>
                          {getChangeTypeIcon(change.type)}
                        </span>
                        <span className={styles.changeType}>
                          {change.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={styles.changeElementType}>
                          {change.elementType}
                        </span>
                      </div>
                      <div className={styles.changeDescription}>
                        {change.description}
                      </div>
                      <div className={styles.changeElement}>
                        Element ID: <code>{change.elementId}</code>
                      </div>
                      
                      {(change.oldValue || change.newValue) && (
                        <div className={styles.changeValues}>
                          {change.oldValue && (
                            <div className={styles.oldValue}>
                              <strong>Before:</strong>
                              <pre>{JSON.stringify(change.oldValue, null, 2)}</pre>
                            </div>
                          )}
                          {change.newValue && (
                            <div className={styles.newValue}>
                              <strong>After:</strong>
                              <pre>{JSON.stringify(change.newValue, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'visual' && (
            <div className={styles.visual}>
              <div className={styles.visualHeader}>
                <h3>Visual Workflow Comparison</h3>
                <p>Side-by-side view of workflow structure changes</p>
              </div>

              <div className={styles.visualComparison}>
                <div className={styles.versionColumn}>
                  <h4>v{fromVersion.version} (Before)</h4>
                  <div className={styles.workflowSummary}>
                    <div className={styles.workflowStats}>
                      <span>{fromVersion.snapshot.nodes.length} nodes</span>
                      <span>{fromVersion.snapshot.edges.length} connections</span>
                    </div>
                    <div className={styles.nodeTypeBreakdown}>
                      {getNodeTypeBreakdown(fromVersion.snapshot.nodes).map(([type, count]) => (
                        <div key={type} className={styles.nodeTypeItem}>
                          <span className={styles.nodeTypeCount}>{count}</span>
                          <span className={styles.nodeTypeName}>{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.changesColumn}>
                  <div className={styles.changesSummaryVisual}>
                    <div className={styles.changeFlow}>
                      <div className={styles.changeArrow}>→</div>
                      <div className={styles.changeCount}>
                        {getTotalChanges()} changes
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.versionColumn}>
                  <h4>v{toVersion.version} (After)</h4>
                  <div className={styles.workflowSummary}>
                    <div className={styles.workflowStats}>
                      <span>{toVersion.snapshot.nodes.length} nodes</span>
                      <span>{toVersion.snapshot.edges.length} connections</span>
                    </div>
                    <div className={styles.nodeTypeBreakdown}>
                      {getNodeTypeBreakdown(toVersion.snapshot.nodes).map(([type, count]) => (
                        <div key={type} className={styles.nodeTypeItem}>
                          <span className={styles.nodeTypeCount}>{count}</span>
                          <span className={styles.nodeTypeName}>{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}