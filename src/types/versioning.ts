import { Node, Edge } from 'reactflow';

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: string;
  message: string;
  timestamp: Date;
  author: string;
  snapshot: WorkflowSnapshot;
  parentVersion?: string;
  tags?: string[];
  isStable?: boolean;
  changesSummary?: ChangesSummary;
}

export interface WorkflowSnapshot {
  nodes: Node[];
  edges: Edge[];
  metadata: WorkflowMetadata;
  checksum: string;
}

export interface WorkflowMetadata {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
  executionCount?: number;
  settings?: WorkflowSettings;
}

export interface WorkflowSettings {
  autoSave: boolean;
  errorHandling: 'stop' | 'continue' | 'retry';
  maxRetries: number;
  timeout: number;
  variables: Record<string, any>;
}

export interface ChangesSummary {
  nodesAdded: number;
  nodesRemoved: number;
  nodesModified: number;
  edgesAdded: number;
  edgesRemoved: number;
  edgesModified: number;
  propertiesChanged: string[];
}

export interface VersionComparison {
  fromVersion: WorkflowVersion;
  toVersion: WorkflowVersion;
  changes: VersionChange[];
  summary: ChangesSummary;
}

export interface VersionChange {
  type: 'node_added' | 'node_removed' | 'node_modified' | 'edge_added' | 'edge_removed' | 'edge_modified' | 'property_changed';
  elementId: string;
  elementType: 'node' | 'edge' | 'property';
  oldValue?: any;
  newValue?: any;
  description: string;
}

export interface VersionBranch {
  id: string;
  name: string;
  description: string;
  baseVersion: string;
  headVersion: string;
  createdAt: Date;
  author: string;
  isMain: boolean;
  status: 'active' | 'merged' | 'abandoned';
}

export interface MergeRequest {
  id: string;
  sourceBranch: string;
  targetBranch: string;
  title: string;
  description: string;
  author: string;
  createdAt: Date;
  status: 'open' | 'merged' | 'closed';
  changes: VersionChange[];
  conflicts?: MergeConflict[];
}

export interface MergeConflict {
  elementId: string;
  elementType: 'node' | 'edge';
  conflictType: 'modify_modify' | 'add_add' | 'remove_modify';
  sourceValue: any;
  targetValue: any;
  description: string;
}