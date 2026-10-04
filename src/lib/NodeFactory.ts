import { Node } from 'reactflow';
import { NodeCategory, NodeTypeDefinition, NodeSubType } from '../types/nodeTypes';

export interface DynamicNodeData {
  nodeType: NodeTypeDefinition;
  properties: Record<string, any>;
  executionState: 'idle' | 'running' | 'success' | 'error';
  onDelete?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export class NodeFactory {
  private static nodeRegistry = new Map<string, NodeTypeDefinition>();
  private static initialized = false;
  
  static registerNodeType(definition: NodeTypeDefinition): void {
    this.nodeRegistry.set(definition.id, definition);
  }
  
  static registerMultipleNodeTypes(definitions: NodeTypeDefinition[]): void {
    definitions.forEach(definition => this.registerNodeType(definition));
  }
  
  static markAsInitialized(): void {
    this.initialized = true;
  }
  
  static createNode(nodeTypeId: string, position: { x: number; y: number }): Node<DynamicNodeData> {
    const definition = this.nodeRegistry.get(nodeTypeId);
    if (!definition) {
      throw new Error(`Node type ${nodeTypeId} not found`);
    }
    
    return {
      id: `${nodeTypeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'dynamic',
      position,
      data: {
        nodeType: definition,
        properties: this.getDefaultProperties(definition),
        executionState: 'idle'
      }
    };
  }
  
  static getAvailableNodes(): NodeTypeDefinition[] {
    return Array.from(this.nodeRegistry.values());
  }
  
  static getNodesByCategory(category: NodeCategory): NodeTypeDefinition[] {
    return this.getAvailableNodes().filter(node => node.category === category);
  }
  
  static getNodeType(nodeTypeId: string): NodeTypeDefinition | undefined {
    return this.nodeRegistry.get(nodeTypeId);
  }
  
  static getAllCategories(): NodeCategory[] {
    const categories = new Set<NodeCategory>();
    this.getAvailableNodes().forEach(node => categories.add(node.category));
    return Array.from(categories);
  }
  
  static getNodeCount(category?: NodeCategory): number {
    if (category) {
      return this.getNodesByCategory(category).length;
    }
    return this.getAvailableNodes().length;
  }
  
  static getNodesBySubType(subType: NodeSubType): NodeTypeDefinition[] {
    return this.getAvailableNodes().filter(node => node.subType === subType);
  }
  
  static searchNodes(query: string): NodeTypeDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getAvailableNodes().filter(node => 
      node.name.toLowerCase().includes(lowerQuery) ||
      node.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  static cloneNode(node: Node<DynamicNodeData>, newPosition: { x: number; y: number }): Node<DynamicNodeData> {
    return {
      ...node,
      id: `${node.data.nodeType.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: newPosition,
      data: {
        ...node.data,
        properties: { ...node.data.properties }
      }
    };
  }
  
  static updateNodeProperties(node: Node<DynamicNodeData>, properties: Record<string, any>): Node<DynamicNodeData> {
    return {
      ...node,
      data: {
        ...node.data,
        properties: { ...node.data.properties, ...properties }
      }
    };
  }
  
  static isInitialized(): boolean {
    return this.initialized;
  }
  
  static getRegistrySize(): number {
    return this.nodeRegistry.size;
  }
  
  private static getDefaultProperties(definition: NodeTypeDefinition): Record<string, any> {
    const defaultProps: Record<string, any> = {};
    
    definition.properties.forEach(prop => {
      if (prop.default !== undefined) {
        defaultProps[prop.name] = prop.default;
      } else {
        // Set sensible defaults based on property type
        switch (prop.type) {
          case 'string':
          case 'textarea':
            defaultProps[prop.name] = '';
            break;
          case 'number':
            defaultProps[prop.name] = prop.min || 0;
            break;
          case 'boolean':
            defaultProps[prop.name] = false;
            break;
          case 'select':
            defaultProps[prop.name] = prop.options?.[0] || '';
            break;
          case 'json':
            defaultProps[prop.name] = '{}';
            break;
          case 'condition_builder':
            defaultProps[prop.name] = [];
            break;
          default:
            defaultProps[prop.name] = null;
        }
      }
    });
    
    return defaultProps;
  }
  
  static validateNodeData(nodeTypeId: string, properties: Record<string, any>): string[] {
    const definition = this.nodeRegistry.get(nodeTypeId);
    if (!definition) {
      return [`Node type ${nodeTypeId} not found`];
    }
    
    const errors: string[] = [];
    
    definition.properties.forEach(prop => {
      const value = properties[prop.name];
      
      // Check required properties
      if (prop.required !== false && (value === undefined || value === null || value === '')) {
        errors.push(`Property '${prop.name}' is required`);
        return;
      }
      
      // Type-specific validation
      if (value !== undefined && value !== null && value !== '') {
        switch (prop.type) {
          case 'number':
            if (isNaN(Number(value))) {
              errors.push(`Property '${prop.name}' must be a number`);
            } else {
              const numValue = Number(value);
              if (prop.min !== undefined && numValue < prop.min) {
                errors.push(`Property '${prop.name}' must be at least ${prop.min}`);
              }
              if (prop.max !== undefined && numValue > prop.max) {
                errors.push(`Property '${prop.name}' must be at most ${prop.max}`);
              }
            }
            break;
          case 'select':
            if (prop.options && !prop.options.includes(value)) {
              errors.push(`Property '${prop.name}' must be one of: ${prop.options.join(', ')}`);
            }
            break;
          case 'json':
            try {
              JSON.parse(value);
            } catch {
              errors.push(`Property '${prop.name}' must be valid JSON`);
            }
            break;
        }
      }
    });
    
    return errors;
  }
}