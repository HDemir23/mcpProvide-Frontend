import { Node, Edge } from 'reactflow';
import { WorkflowVersion, WorkflowSnapshot, WorkflowMetadata, ChangesSummary, VersionChange, VersionComparison } from '../../types/versioning';

export class WorkflowVersionControl {
  private storage: VersionStorage;
  private currentWorkflowId: string | null = null;

  constructor(storage: VersionStorage = new LocalVersionStorage()) {
    this.storage = storage;
  }

  /**
   * Initialize version control for a workflow
   */
  async initializeWorkflow(workflowId: string, metadata: WorkflowMetadata): Promise<void> {
    this.currentWorkflowId = workflowId;
    
    // Check if workflow already has versions
    const existingVersions = await this.storage.getVersions(workflowId);
    if (existingVersions.length === 0) {
      // Create initial version
      await this.saveVersion([], [], 'Initial commit', metadata);
    }
  }

  /**
   * Save a new version of the workflow
   */
  async saveVersion(
    nodes: Node[], 
    edges: Edge[], 
    message: string, 
    metadata: WorkflowMetadata,
    tags?: string[]
  ): Promise<WorkflowVersion> {
    if (!this.currentWorkflowId) {
      throw new Error('No workflow initialized');
    }

    const snapshot = this.createSnapshot(nodes, edges, metadata);
    const previousVersion = await this.getLatestVersion();
    
    const version: WorkflowVersion = {
      id: this.generateVersionId(),
      workflowId: this.currentWorkflowId,
      version: await this.getNextVersionNumber(),
      message,
      timestamp: new Date(),
      author: this.getCurrentUser(),
      snapshot,
      parentVersion: previousVersion?.id,
      tags,
      isStable: tags?.includes('stable') || false
    };

    // Calculate changes if there's a previous version
    if (previousVersion) {
      version.changesSummary = this.calculateChangesSummary(previousVersion.snapshot, snapshot);
    }

    await this.storage.saveVersion(version);
    return version;
  }

  /**
   * Get version history for current workflow
   */
  async getVersionHistory(): Promise<WorkflowVersion[]> {
    if (!this.currentWorkflowId) {
      throw new Error('No workflow initialized');
    }
    return this.storage.getVersions(this.currentWorkflowId);
  }

  /**
   * Get a specific version
   */
  async getVersion(versionId: string): Promise<WorkflowVersion | null> {
    return this.storage.getVersion(versionId);
  }

  /**
   * Get the latest version
   */
  async getLatestVersion(): Promise<WorkflowVersion | null> {
    if (!this.currentWorkflowId) return null;
    
    const versions = await this.storage.getVersions(this.currentWorkflowId);
    return versions.length > 0 ? versions[versions.length - 1] : null;
  }

  /**
   * Restore workflow to a specific version
   */
  async restoreVersion(versionId: string): Promise<{ nodes: Node[]; edges: Edge[]; metadata: WorkflowMetadata }> {
    const version = await this.storage.getVersion(versionId);
    if (!version) {
      throw new Error(`Version ${versionId} not found`);
    }

    return {
      nodes: version.snapshot.nodes,
      edges: version.snapshot.edges,
      metadata: version.snapshot.metadata
    };
  }

  /**
   * Compare two versions
   */
  async compareVersions(fromVersionId: string, toVersionId: string): Promise<VersionComparison> {
    const fromVersion = await this.storage.getVersion(fromVersionId);
    const toVersion = await this.storage.getVersion(toVersionId);

    if (!fromVersion || !toVersion) {
      throw new Error('One or both versions not found');
    }

    const changes = this.calculateDetailedChanges(fromVersion.snapshot, toVersion.snapshot);
    const summary = this.calculateChangesSummary(fromVersion.snapshot, toVersion.snapshot);

    return {
      fromVersion,
      toVersion,
      changes,
      summary
    };
  }

  /**
   * Tag a version
   */
  async tagVersion(versionId: string, tags: string[]): Promise<void> {
    const version = await this.storage.getVersion(versionId);
    if (!version) {
      throw new Error(`Version ${versionId} not found`);
    }

    version.tags = [...(version.tags || []), ...tags];
    version.isStable = tags.includes('stable') || version.isStable;
    
    await this.storage.updateVersion(version);
  }

  /**
   * Get versions by tag
   */
  async getVersionsByTag(tag: string): Promise<WorkflowVersion[]> {
    if (!this.currentWorkflowId) return [];
    
    const versions = await this.storage.getVersions(this.currentWorkflowId);
    return versions.filter(version => version.tags?.includes(tag));
  }

  /**
   * Get stable versions only
   */
  async getStableVersions(): Promise<WorkflowVersion[]> {
    if (!this.currentWorkflowId) return [];
    
    const versions = await this.storage.getVersions(this.currentWorkflowId);
    return versions.filter(version => version.isStable);
  }

  /**
   * Delete a version (with safety checks)
   */
  async deleteVersion(versionId: string): Promise<void> {
    const version = await this.storage.getVersion(versionId);
    if (!version) {
      throw new Error(`Version ${versionId} not found`);
    }

    // Don't allow deletion of stable versions
    if (version.isStable) {
      throw new Error('Cannot delete stable versions');
    }

    // Don't allow deletion if it's the only version
    const allVersions = await this.storage.getVersions(version.workflowId);
    if (allVersions.length <= 1) {
      throw new Error('Cannot delete the only version');
    }

    await this.storage.deleteVersion(versionId);
  }

  /**
   * Auto-save with version control
   */
  async autoSave(nodes: Node[], edges: Edge[], metadata: WorkflowMetadata): Promise<WorkflowVersion | null> {
    const latestVersion = await this.getLatestVersion();
    
    if (latestVersion) {
      const currentSnapshot = this.createSnapshot(nodes, edges, metadata);
      
      // Only save if there are significant changes
      if (this.hasSignificantChanges(latestVersion.snapshot, currentSnapshot)) {
        return this.saveVersion(nodes, edges, 'Auto-save', metadata, ['auto-save']);
      }
    }
    
    return null;
  }

  // Private helper methods

  private createSnapshot(nodes: Node[], edges: Edge[], metadata: WorkflowMetadata): WorkflowSnapshot {
    const snapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges)), // Deep clone
      metadata: { ...metadata },
      checksum: ''
    };
    
    snapshot.checksum = this.calculateChecksum(snapshot);
    return snapshot;
  }

  private calculateChecksum(snapshot: Omit<WorkflowSnapshot, 'checksum'>): string {
    const content = JSON.stringify({
      nodes: snapshot.nodes,
      edges: snapshot.edges,
      metadata: snapshot.metadata
    });
    
    // Simple hash function (in production, use a proper crypto hash)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private calculateChangesSummary(oldSnapshot: WorkflowSnapshot, newSnapshot: WorkflowSnapshot): ChangesSummary {
    const oldNodeIds = new Set(oldSnapshot.nodes.map(n => n.id));
    const newNodeIds = new Set(newSnapshot.nodes.map(n => n.id));
    const oldEdgeIds = new Set(oldSnapshot.edges.map(e => e.id));
    const newEdgeIds = new Set(newSnapshot.edges.map(e => e.id));

    const nodesAdded = newSnapshot.nodes.filter(n => !oldNodeIds.has(n.id)).length;
    const nodesRemoved = oldSnapshot.nodes.filter(n => !newNodeIds.has(n.id)).length;
    const nodesModified = this.countModifiedNodes(oldSnapshot.nodes, newSnapshot.nodes);

    const edgesAdded = newSnapshot.edges.filter(e => !oldEdgeIds.has(e.id)).length;
    const edgesRemoved = oldSnapshot.edges.filter(e => !newEdgeIds.has(e.id)).length;
    const edgesModified = this.countModifiedEdges(oldSnapshot.edges, newSnapshot.edges);

    return {
      nodesAdded,
      nodesRemoved,
      nodesModified,
      edgesAdded,
      edgesRemoved,
      edgesModified,
      propertiesChanged: this.getChangedProperties(oldSnapshot, newSnapshot)
    };
  }

  private calculateDetailedChanges(oldSnapshot: WorkflowSnapshot, newSnapshot: WorkflowSnapshot): VersionChange[] {
    const changes: VersionChange[] = [];
    
    // Node changes
    const oldNodes = new Map(oldSnapshot.nodes.map(n => [n.id, n]));
    const newNodes = new Map(newSnapshot.nodes.map(n => [n.id, n]));

    // Added nodes
    for (const [id, node] of newNodes) {
      if (!oldNodes.has(id)) {
        changes.push({
          type: 'node_added',
          elementId: id,
          elementType: 'node',
          newValue: node,
          description: `Added node: ${node.data?.nodeType?.name || 'Unknown'}`
        });
      }
    }

    // Removed nodes
    for (const [id, node] of oldNodes) {
      if (!newNodes.has(id)) {
        changes.push({
          type: 'node_removed',
          elementId: id,
          elementType: 'node',
          oldValue: node,
          description: `Removed node: ${node.data?.nodeType?.name || 'Unknown'}`
        });
      }
    }

    // Modified nodes
    for (const [id, newNode] of newNodes) {
      const oldNode = oldNodes.get(id);
      if (oldNode && JSON.stringify(oldNode) !== JSON.stringify(newNode)) {
        changes.push({
          type: 'node_modified',
          elementId: id,
          elementType: 'node',
          oldValue: oldNode,
          newValue: newNode,
          description: `Modified node: ${newNode.data?.nodeType?.name || 'Unknown'}`
        });
      }
    }

    // Edge changes (similar logic)
    const oldEdges = new Map(oldSnapshot.edges.map(e => [e.id, e]));
    const newEdges = new Map(newSnapshot.edges.map(e => [e.id, e]));

    for (const [id, edge] of newEdges) {
      if (!oldEdges.has(id)) {
        changes.push({
          type: 'edge_added',
          elementId: id,
          elementType: 'edge',
          newValue: edge,
          description: `Added connection: ${edge.source} → ${edge.target}`
        });
      }
    }

    for (const [id, edge] of oldEdges) {
      if (!newEdges.has(id)) {
        changes.push({
          type: 'edge_removed',
          elementId: id,
          elementType: 'edge',
          oldValue: edge,
          description: `Removed connection: ${edge.source} → ${edge.target}`
        });
      }
    }

    return changes;
  }

  private countModifiedNodes(oldNodes: Node[], newNodes: Node[]): number {
    const newNodesMap = new Map(newNodes.map(n => [n.id, n]));
    let modified = 0;

    for (const oldNode of oldNodes) {
      const newNode = newNodesMap.get(oldNode.id);
      if (newNode && JSON.stringify(oldNode) !== JSON.stringify(newNode)) {
        modified++;
      }
    }

    return modified;
  }

  private countModifiedEdges(oldEdges: Edge[], newEdges: Edge[]): number {
    const newEdgesMap = new Map(newEdges.map(e => [e.id, e]));
    let modified = 0;

    for (const oldEdge of oldEdges) {
      const newEdge = newEdgesMap.get(oldEdge.id);
      if (newEdge && JSON.stringify(oldEdge) !== JSON.stringify(newEdge)) {
        modified++;
      }
    }

    return modified;
  }

  private getChangedProperties(oldSnapshot: WorkflowSnapshot, newSnapshot: WorkflowSnapshot): string[] {
    const changes: string[] = [];
    
    if (oldSnapshot.metadata.name !== newSnapshot.metadata.name) {
      changes.push('name');
    }
    if (oldSnapshot.metadata.description !== newSnapshot.metadata.description) {
      changes.push('description');
    }
    
    return changes;
  }

  private hasSignificantChanges(oldSnapshot: WorkflowSnapshot, newSnapshot: WorkflowSnapshot): boolean {
    const summary = this.calculateChangesSummary(oldSnapshot, newSnapshot);
    
    return (
      summary.nodesAdded > 0 ||
      summary.nodesRemoved > 0 ||
      summary.nodesModified > 0 ||
      summary.edgesAdded > 0 ||
      summary.edgesRemoved > 0 ||
      summary.edgesModified > 0 ||
      summary.propertiesChanged.length > 0
    );
  }

  private generateVersionId(): string {
    return `version-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getNextVersionNumber(): Promise<string> {
    if (!this.currentWorkflowId) return '1.0.0';
    
    const versions = await this.storage.getVersions(this.currentWorkflowId);
    const latestVersion = versions[versions.length - 1];
    
    if (!latestVersion) return '1.0.0';
    
    const [major, minor, patch] = latestVersion.version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private getCurrentUser(): string {
    // In a real application, this would get the current user from auth
    return 'Current User';
  }
}

// Storage interface and implementations

export interface VersionStorage {
  saveVersion(version: WorkflowVersion): Promise<void>;
  getVersion(versionId: string): Promise<WorkflowVersion | null>;
  getVersions(workflowId: string): Promise<WorkflowVersion[]>;
  updateVersion(version: WorkflowVersion): Promise<void>;
  deleteVersion(versionId: string): Promise<void>;
}

export class LocalVersionStorage implements VersionStorage {
  private readonly storageKey = 'workflow_versions';

  async saveVersion(version: WorkflowVersion): Promise<void> {
    const versions = await this.getAllVersions();
    versions[version.id] = version;
    localStorage.setItem(this.storageKey, JSON.stringify(versions));
  }

  async getVersion(versionId: string): Promise<WorkflowVersion | null> {
    const versions = await this.getAllVersions();
    return versions[versionId] || null;
  }

  async getVersions(workflowId: string): Promise<WorkflowVersion[]> {
    const versions = await this.getAllVersions();
    return Object.values(versions)
      .filter(v => v.workflowId === workflowId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async updateVersion(version: WorkflowVersion): Promise<void> {
    const versions = await this.getAllVersions();
    versions[version.id] = version;
    localStorage.setItem(this.storageKey, JSON.stringify(versions));
  }

  async deleteVersion(versionId: string): Promise<void> {
    const versions = await this.getAllVersions();
    delete versions[versionId];
    localStorage.setItem(this.storageKey, JSON.stringify(versions));
  }

  private async getAllVersions(): Promise<Record<string, WorkflowVersion>> {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    
    // Convert date strings back to Date objects
    Object.values(parsed).forEach((version: any) => {
      version.timestamp = new Date(version.timestamp);
      version.snapshot.metadata.createdAt = new Date(version.snapshot.metadata.createdAt);
      version.snapshot.metadata.updatedAt = new Date(version.snapshot.metadata.updatedAt);
      if (version.snapshot.metadata.lastExecuted) {
        version.snapshot.metadata.lastExecuted = new Date(version.snapshot.metadata.lastExecuted);
      }
    });
    
    return parsed;
  }
}