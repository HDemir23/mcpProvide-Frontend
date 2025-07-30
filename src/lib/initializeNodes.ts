import { NodeFactory } from './NodeFactory';
import { TriggerNodes } from './nodes/TriggerNodes';
import { ActionNodes } from './nodes/ActionNodes';
import { AINodes } from './nodes/AINodes';
import { ConditionNodes } from './nodes/ConditionNodes';
import { DataNodes } from './nodes/DataNodes';
import { UtilityNodes } from './nodes/UtilityNodes';

// Initialize all node types when the app starts
let isInitialized = false;

export const initializeNodeLibrary = () => {
  if (isInitialized) {
    return;
  }

  try {
    // Register all node types synchronously
    NodeFactory.registerMultipleNodeTypes(TriggerNodes);
    NodeFactory.registerMultipleNodeTypes(ActionNodes);
    NodeFactory.registerMultipleNodeTypes(AINodes);
    NodeFactory.registerMultipleNodeTypes(ConditionNodes);
    NodeFactory.registerMultipleNodeTypes(DataNodes);
    NodeFactory.registerMultipleNodeTypes(UtilityNodes);
    
    NodeFactory.markAsInitialized();
    isInitialized = true;
    console.log(`✅ Node library initialized with ${NodeFactory.getRegistrySize()} node types`);
  } catch (error) {
    console.error('❌ Failed to initialize node library:', error);
  }
};

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  initializeNodeLibrary();
}