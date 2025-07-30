import { registerBuiltInExecutors } from './execution/ExecutorRegistry';

// Initialize all executors when the app starts
let isInitialized = false;

export const initializeExecutionEngine = () => {
  if (isInitialized) {
    return;
  }

  try {
    registerBuiltInExecutors();
    isInitialized = true;
    console.log('✅ Execution engine initialized with built-in executors');
  } catch (error) {
    console.error('❌ Failed to initialize execution engine:', error);
  }
};

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  initializeExecutionEngine();
}