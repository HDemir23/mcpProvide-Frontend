import { Node, Edge } from 'reactflow';
import { WorkflowTemplate } from '../../types/templates';
import { NodeFactory } from '../NodeFactory';

export class TemplateManager {
  /**
   * Import a template and convert it to nodes and edges for the canvas
   */
  static importTemplate(template: WorkflowTemplate): { nodes: Node[]; edges: Edge[] } {
    // Generate new IDs for all nodes to avoid conflicts
    const nodeIdMap = new Map<string, string>();
    
    // Create nodes with new IDs
    const newNodes = template.nodes.map(templateNode => {
      const nodeType = templateNode.data?.nodeType;
      if (!nodeType) {
        throw new Error(`Template node missing nodeType: ${templateNode.id}`);
      }

      // Create a new node with the same type and position
      const newNode = NodeFactory.createNode(nodeType.id, templateNode.position);
      
      // Map old ID to new ID
      nodeIdMap.set(templateNode.id, newNode.id);
      
      // Copy over any custom properties from the template
      if (templateNode.data?.properties) {
        newNode.data.properties = {
          ...newNode.data.properties,
          ...templateNode.data.properties
        };
      }
      
      return newNode;
    });

    // Create edges with updated node IDs
    const newEdges: Edge[] = template.edges.map((templateEdge, index) => {
      const newSourceId = nodeIdMap.get(templateEdge.source);
      const newTargetId = nodeIdMap.get(templateEdge.target);
      
      if (!newSourceId || !newTargetId) {
        throw new Error(`Invalid edge reference in template: ${templateEdge.id}`);
      }

      return {
        id: `edge-${Date.now()}-${index}`,
        source: newSourceId,
        target: newTargetId,
        sourceHandle: templateEdge.sourceHandle,
        targetHandle: templateEdge.targetHandle,
        type: 'custom',
        animated: false,
        style: { 
          stroke: '#00d4ff', 
          strokeWidth: 2 
        }
      };
    });

    return { nodes: newNodes, edges: newEdges };
  }

  /**
   * Export current workflow as a template
   */
  static exportAsTemplate(
    nodes: Node[], 
    edges: Edge[], 
    metadata: {
      name: string;
      description: string;
      category: string;
      tags: string[];
      difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
      estimatedTime: string;
    }
  ): WorkflowTemplate {
    // Clean up node data for template storage
    const templateNodes = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        // Reset execution state
        executionState: 'idle',
        // Keep only essential properties
        nodeType: node.data.nodeType,
        properties: node.data.properties
      }
    }));

    // Clean up edge data
    const templateEdges = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle
    }));

    const template: WorkflowTemplate = {
      id: `custom-${Date.now()}`,
      name: metadata.name,
      description: metadata.description,
      category: metadata.category as any,
      tags: metadata.tags,
      difficulty: metadata.difficulty,
      estimatedTime: metadata.estimatedTime,
      author: 'User Generated',
      version: '1.0.0',
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: templateNodes,
      edges: templateEdges,
      featured: false,
      rating: 0,
      usageCount: 0
    };

    return template;
  }

  /**
   * Validate template integrity
   */
  static validateTemplate(template: WorkflowTemplate): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (!template.name?.trim()) errors.push('Template name is required');
    if (!template.description?.trim()) errors.push('Template description is required');
    if (!template.nodes?.length) errors.push('Template must have at least one node');

    // Check node integrity
    template.nodes?.forEach((node, index) => {
      if (!node.data?.nodeType) {
        errors.push(`Node ${index + 1} missing nodeType definition`);
      }
      if (!NodeFactory.getNodeType(node.data?.nodeType?.id)) {
        errors.push(`Node ${index + 1} has unknown node type: ${node.data?.nodeType?.id}`);
      }
    });

    // Check edge integrity
    const nodeIds = new Set(template.nodes?.map(n => n.id) || []);
    template.edges?.forEach((edge, index) => {
      if (!nodeIds.has(edge.source)) {
        errors.push(`Edge ${index + 1} references unknown source node: ${edge.source}`);
      }
      if (!nodeIds.has(edge.target)) {
        errors.push(`Edge ${index + 1} references unknown target node: ${edge.target}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get template statistics
   */
  static getTemplateAnalytics(template: WorkflowTemplate) {
    const nodeTypes = template.nodes.map(n => n.data?.nodeType?.category).filter(Boolean);
    const nodeCounts = nodeTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalNodes: template.nodes.length,
      totalEdges: template.edges.length,
      nodeTypeBreakdown: nodeCounts,
      complexity: this.calculateComplexity(template),
      estimatedExecutionTime: this.estimateExecutionTime(template)
    };
  }

  private static calculateComplexity(template: WorkflowTemplate): 'Low' | 'Medium' | 'High' {
    const nodeCount = template.nodes.length;
    const edgeCount = template.edges.length;
    const complexityScore = nodeCount + (edgeCount * 0.5);

    if (complexityScore <= 5) return 'Low';
    if (complexityScore <= 15) return 'Medium';
    return 'High';
  }

  private static estimateExecutionTime(template: WorkflowTemplate): string {
    // Simple heuristic based on node types and count
    const nodeCount = template.nodes.length;
    const aiNodes = template.nodes.filter(n => n.data?.nodeType?.category === 'ai').length;
    const httpNodes = template.nodes.filter(n => n.data?.nodeType?.category === 'action').length;
    
    let timeSeconds = nodeCount * 2; // Base time per node
    timeSeconds += aiNodes * 10; // AI nodes take longer
    timeSeconds += httpNodes * 3; // HTTP requests take longer
    
    if (timeSeconds <= 30) return '< 30 seconds';
    if (timeSeconds <= 120) return '1-2 minutes';
    if (timeSeconds <= 300) return '2-5 minutes';
    return '> 5 minutes';
  }

  /**
   * Clone a template with modifications
   */
  static cloneTemplate(
    template: WorkflowTemplate, 
    modifications: Partial<WorkflowTemplate>
  ): WorkflowTemplate {
    return {
      ...template,
      ...modifications,
      id: `${template.id}-clone-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };
  }
}