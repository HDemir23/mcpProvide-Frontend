import { NodeFactory } from '../NodeFactory';

// Import all node definitions
import { TriggerNodes } from './TriggerNodes';
import { ActionNodes } from './ActionNodes';
import { AINodes } from './AINodes';
import { ConditionNodes } from './ConditionNodes';
import { MCPNodes } from './MCPNodes';

// Register all node types
export const registerAllNodes = () => {
  // Register all node categories
  NodeFactory.registerMultipleNodeTypes(TriggerNodes);
  NodeFactory.registerMultipleNodeTypes(ActionNodes);
  NodeFactory.registerMultipleNodeTypes(AINodes);
  NodeFactory.registerMultipleNodeTypes(ConditionNodes);
  NodeFactory.registerMultipleNodeTypes(MCPNodes);

  // Register Data and Utility nodes if they exist
  try {
    import('./DataNodes').then(module => {
      if (module.DataNodes) {
        NodeFactory.registerMultipleNodeTypes(module.DataNodes);
      }
    });
    
    import('./UtilityNodes').then(module => {
      if (module.UtilityNodes) {
        NodeFactory.registerMultipleNodeTypes(module.UtilityNodes);
      }
    });
  } catch (error) {
    console.warn('Some node categories not found:', error);
  }
};

// Export all node definitions for reference
export * from './TriggerNodes';
export * from './ActionNodes';
export * from './AINodes';
export * from './ConditionNodes';
export * from './DataNodes';
export * from './UtilityNodes';
export * from './MCPNodes';

// Export factory
export { NodeFactory } from '../NodeFactory';