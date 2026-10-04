import { NodeCategory, NodeSubType, NodeTypeDefinition } from '../../types/nodeTypes';

export const LLMChatNode: NodeTypeDefinition = {
  id: 'llm_chat', 
  name: 'AI Chat',
  category: NodeCategory.AI,
  subType: NodeSubType.LLM_CHAT,
  description: 'Chat with Large Language Models',
  icon: '🤖',
  color: '#F59E0B',
  inputs: [
    {
      id: 'prompt_input',
      name: 'Prompt',
      type: 'input',
      position: 'left',
      dataType: 'string',
      required: true,
      multiple: false
    },
    {
      id: 'context_input',
      name: 'Context',
      type: 'input',
      position: 'top',
      dataType: 'string',
      required: false,
      multiple: true
    }
  ],
  outputs: [
    {
      id: 'ai_response',
      name: 'AI Response',
      type: 'output',
      position: 'right',
      dataType: 'string',
      required: false,
      multiple: true
    },
    {
      id: 'token_usage',
      name: 'Token Usage',
      type: 'output',
      position: 'bottom',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'model',
      type: 'select',
      label: 'AI Model',
      options: ['gpt-4', 'gpt-4o', 'claude-4', 'claude-3.5-sonnet', 'claude-3-opus', 'claude-3-sonnet', 'gemini-2.5-pro', 'gemini-pro', 'gpt-3.5-turbo'],
      default: 'gpt-4',
      required: true
    },
    {
      name: 'temperature',
      type: 'number',
      label: 'Temperature',
      min: 0,
      max: 2,
      step: 0.1,
      default: 0.7,
      description: 'Controls randomness (0=deterministic, 2=very random)'
    },
    {
      name: 'max_tokens',
      type: 'number',
      label: 'Max Tokens',
      default: 1000,
      min: 1,
      max: 4000,
      description: 'Maximum number of tokens to generate'
    },
    {
      name: 'system_prompt',
      type: 'textarea',
      label: 'System Prompt',
      placeholder: 'You are a helpful assistant...',
      description: 'System instructions for the AI model'
    },
    {
      name: 'top_p',
      type: 'number',
      label: 'Top P',
      min: 0,
      max: 1,
      step: 0.01,
      default: 1,
      description: 'Nucleus sampling parameter'
    }
  ],
  executeFunction: 'LLMChatExecutor'
};

export const TextClassifierNode: NodeTypeDefinition = {
  id: 'text_classifier',
  name: 'Text Classifier',
  category: NodeCategory.AI,
  subType: NodeSubType.TEXT_CLASSIFIER,
  description: 'Classify text into categories using AI',
  icon: '🏷️',
  color: '#EC4899',
  inputs: [
    {
      id: 'text_input',
      name: 'Text',
      type: 'input',
      position: 'left',
      dataType: 'string',
      required: true,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'classification',
      name: 'Classification',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    },
    {
      id: 'confidence',
      name: 'Confidence',
      type: 'output',
      position: 'bottom',
      dataType: 'number',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'categories',
      type: 'json',
      label: 'Categories',
      default: '["positive", "negative", "neutral"]',
      placeholder: '["category1", "category2", "category3"]',
      required: true,
      description: 'Array of classification categories'
    },
    {
      name: 'model',
      type: 'select',
      label: 'Model Provider',
      options: ['openai', 'huggingface', 'custom'],
      default: 'openai',
      required: true
    },
    {
      name: 'confidence_threshold',
      type: 'number',
      label: 'Confidence Threshold',
      min: 0,
      max: 1,
      step: 0.01,
      default: 0.5,
      description: 'Minimum confidence score to accept classification'
    },
    {
      name: 'custom_prompt',
      type: 'textarea',
      label: 'Custom Prompt',
      placeholder: 'Classify the following text into one of these categories...',
      description: 'Custom classification prompt (optional)'
    }
  ],
  executeFunction: 'TextClassifierExecutor'
};

export const ImageAnalyzerNode: NodeTypeDefinition = {
  id: 'image_analyzer',
  name: 'Image Analyzer',
  category: NodeCategory.AI,
  subType: NodeSubType.IMAGE_ANALYZER,
  description: 'Analyze images using AI vision models',
  icon: '👁️',
  color: '#10B981',
  inputs: [
    {
      id: 'image_input',
      name: 'Image',
      type: 'input',
      position: 'left',
      dataType: 'object',
      required: true,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'analysis_result',
      name: 'Analysis',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    },
    {
      id: 'detected_objects',
      name: 'Objects',
      type: 'output',
      position: 'bottom',
      dataType: 'array',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'analysis_type',
      type: 'select',
      label: 'Analysis Type',
      options: ['description', 'object_detection', 'text_extraction', 'face_detection'],
      default: 'description',
      required: true,
      description: 'Type of image analysis to perform'
    },
    {
      name: 'model',
      type: 'select',
      label: 'Vision Model',
      options: ['gpt-4o-vision', 'gpt-4-vision', 'claude-4-vision', 'claude-3.5-sonnet-vision', 'claude-3-vision', 'gemini-2.5-pro-vision', 'google-vision'],
      default: 'gpt-4-vision',
      required: true
    },
    {
      name: 'detail_level',
      type: 'select',
      label: 'Detail Level',
      options: ['low', 'high'],
      default: 'high',
      description: 'Level of detail in analysis'
    },
    {
      name: 'custom_prompt',
      type: 'textarea',
      label: 'Custom Prompt',
      placeholder: 'Describe what you see in this image...',
      description: 'Custom analysis prompt (optional)'
    }
  ],
  executeFunction: 'ImageAnalyzerExecutor'
};

export const TextSummarizerNode: NodeTypeDefinition = {
  id: 'text_summarizer',
  name: 'Text Summarizer',
  category: NodeCategory.AI,
  subType: NodeSubType.LLM_CHAT,
  description: 'Summarize long text using AI',
  icon: '📝',
  color: '#8B5CF6',
  inputs: [
    {
      id: 'text_input',
      name: 'Text',
      type: 'input',
      position: 'left',
      dataType: 'string',
      required: true,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'summary',
      name: 'Summary',
      type: 'output',
      position: 'right',
      dataType: 'string',
      required: false,
      multiple: true
    },
    {
      id: 'key_points',
      name: 'Key Points',
      type: 'output',
      position: 'bottom',
      dataType: 'array',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'summary_length',
      type: 'select',
      label: 'Summary Length',
      options: ['short', 'medium', 'long'],
      default: 'medium',
      required: true,
      description: 'Desired length of the summary'
    },
    {
      name: 'model',
      type: 'select',
      label: 'AI Model',
      options: ['gpt-4', 'gpt-4o', 'claude-4', 'claude-3.5-sonnet', 'claude-3-opus', 'claude-3-sonnet', 'gemini-2.5-pro', 'gemini-pro', 'gpt-3.5-turbo'],
      default: 'gpt-4',
      required: true
    },
    {
      name: 'focus_areas',
      type: 'string',
      label: 'Focus Areas',
      placeholder: 'key findings, recommendations, conclusions',
      description: 'Comma-separated areas to focus on in summary'
    },
    {
      name: 'extract_key_points',
      type: 'boolean',
      label: 'Extract Key Points',
      default: true,
      description: 'Extract bullet points of key information'
    }
  ],
  executeFunction: 'TextSummarizerExecutor'
};

export const AIAgentNode: NodeTypeDefinition = {
  id: 'ai_agent',
  name: 'AI Agent Manager',
  category: NodeCategory.AI,
  subType: NodeSubType.LLM_CHAT,
  description: 'Micromanage and coordinate multiple AI models for complex tasks',
  icon: '🎯',
  color: '#FF6B35',
  inputs: [
    {
      id: 'task_input',
      name: 'Task',
      type: 'input',
      position: 'left',
      dataType: 'string',
      required: true,
      multiple: false
    },
    {
      id: 'context_input',
      name: 'Context',
      type: 'input',
      position: 'top',
      dataType: 'object',
      required: false,
      multiple: true
    },
    {
      id: 'ai_responses',
      name: 'AI Responses',
      type: 'input',
      position: 'bottom',
      dataType: 'array',
      required: false,
      multiple: true
    }
  ],
  outputs: [
    {
      id: 'delegated_tasks',
      name: 'Delegated Tasks',
      type: 'output',
      position: 'right',
      dataType: 'array',
      required: false,
      multiple: true
    },
    {
      id: 'final_result',
      name: 'Final Result',
      type: 'output',
      position: 'bottom',
      dataType: 'object',
      required: false,
      multiple: false
    },
    {
      id: 'task_assignments',
      name: 'Task Assignments',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'primary_model',
      type: 'select',
      label: 'Primary AI Model (Manager)',
      options: ['gemini-2.5-pro', 'gpt-4o', 'claude-4', 'claude-3.5-sonnet', 'gpt-4'],
      default: 'gemini-2.5-pro',
      required: true,
      description: 'The main AI model that will coordinate other models'
    },
    {
      name: 'task_config',
      type: 'json',
      label: 'Task Configuration',
      default: '{\n  "styling": "claude-3.5-sonnet",\n  "algorithms": "claude-4",\n  "functions": "gpt-4o",\n  "documentation": "gemini-2.5-pro"\n}',
      placeholder: '{"task_type": "model_name", ...}',
      required: true,
      description: 'JSON configuration mapping task types to specific AI models'
    },
    {
      name: 'coordination_strategy',
      type: 'select',
      label: 'Coordination Strategy',
      options: ['sequential', 'parallel', 'hierarchical', 'collaborative'],
      default: 'hierarchical',
      required: true,
      description: 'How the manager coordinates tasks between AI models'
    },
    {
      name: 'task_timeout',
      type: 'number',
      label: 'Task Timeout (seconds)',
      min: 10,
      max: 300,
      default: 60,
      description: 'Maximum time to wait for each AI task'
    },
    {
      name: 'quality_threshold',
      type: 'number',
      label: 'Quality Threshold',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.8,
      description: 'Minimum quality score required for task completion'
    },
    {
      name: 'retry_failed_tasks',
      type: 'boolean',
      label: 'Retry Failed Tasks',
      default: true,
      description: 'Automatically retry tasks that fail or don\'t meet quality threshold'
    },
    {
      name: 'max_retries',
      type: 'number',
      label: 'Max Retries',
      min: 0,
      max: 5,
      default: 2,
      description: 'Maximum number of retries for failed tasks'
    },
    {
      name: 'manager_instructions',
      type: 'textarea',
      label: 'Manager Instructions',
      placeholder: 'You are coordinating multiple AI models to complete complex tasks. Break down the input task and delegate appropriately based on the task configuration...',
      description: 'Instructions for the primary AI model on how to manage other models'
    },
    {
      name: 'final_review',
      type: 'boolean',
      label: 'Final Review',
      default: true,
      description: 'Have the manager review and integrate all task results'
    }
  ],
  executeFunction: 'AIAgentExecutor'
};

export const AIModelManagerNode: NodeTypeDefinition = {
  id: 'ai_model_manager',
  name: 'AI Model Manager',
  category: NodeCategory.AI,
  subType: NodeSubType.LLM_CHAT,
  description: 'Manage and configure AI models with centralized settings',
  icon: '⚙️',
  color: '#8B5CF6',
  inputs: [
    {
      id: 'model_config',
      name: 'Model Config',
      type: 'input',
      position: 'left',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'configured_models',
      name: 'Configured Models',
      type: 'output',
      position: 'right',
      dataType: 'array',
      required: false,
      multiple: true
    },
    {
      id: 'model_status',
      name: 'Model Status',
      type: 'output',
      position: 'bottom',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'available_models',
      type: 'json',
      label: 'Available AI Models',
      default: '{\n  "gpt-4": {"provider": "openai", "max_tokens": 4000, "cost_per_1k": 0.03},\n  "gpt-4o": {"provider": "openai", "max_tokens": 4000, "cost_per_1k": 0.025},\n  "claude-4": {"provider": "anthropic", "max_tokens": 4000, "cost_per_1k": 0.03},\n  "claude-3.5-sonnet": {"provider": "anthropic", "max_tokens": 4000, "cost_per_1k": 0.025},\n  "gemini-2.5-pro": {"provider": "google", "max_tokens": 8000, "cost_per_1k": 0.02}\n}',
      required: true,
      description: 'JSON configuration of available AI models and their properties'
    },
    {
      name: 'default_model',
      type: 'select',
      label: 'Default Model',
      options: ['gpt-4o', 'claude-4', 'claude-3.5-sonnet', 'gemini-2.5-pro', 'gpt-4'],
      default: 'gpt-4o',
      required: true,
      description: 'Default AI model to use when none is specified'
    },
    {
      name: 'load_balancing',
      type: 'select',
      label: 'Load Balancing Strategy',
      options: ['round_robin', 'least_cost', 'fastest_response', 'none'],
      default: 'none',
      description: 'How to distribute requests across multiple models'
    },
    {
      name: 'rate_limits',
      type: 'json',
      label: 'Rate Limits',
      default: '{\n  "requests_per_minute": 60,\n  "requests_per_hour": 3600,\n  "concurrent_requests": 5\n}',
      description: 'Rate limiting configuration for API calls'
    },
    {
      name: 'fallback_models',
      type: 'json',
      label: 'Fallback Chain',
      default: '["gpt-4o", "claude-3.5-sonnet", "gemini-2.5-pro"]',
      description: 'Array of models to try if primary model fails'
    },
    {
      name: 'auto_retry',
      type: 'boolean',
      label: 'Auto Retry Failed Requests',
      default: true,
      description: 'Automatically retry failed requests with fallback models'
    },
    {
      name: 'cost_optimization',
      type: 'boolean',
      label: 'Enable Cost Optimization',
      default: false,
      description: 'Automatically route to cheapest suitable model'
    }
  ],
  executeFunction: 'AIModelManagerExecutor'
};

export const AIModelSelectorNode: NodeTypeDefinition = {
  id: 'ai_model_selector',
  name: 'AI Model Selector',
  category: NodeCategory.AI,
  subType: NodeSubType.LLM_CHAT,
  description: 'Dynamically select AI model based on task requirements',
  icon: '🔀',
  color: '#10B981',
  inputs: [
    {
      id: 'task_input',
      name: 'Task',
      type: 'input',
      position: 'left',
      dataType: 'string',
      required: true,
      multiple: false
    },
    {
      id: 'requirements',
      name: 'Requirements',
      type: 'input',
      position: 'top',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'selected_model',
      name: 'Selected Model',
      type: 'output',
      position: 'right',
      dataType: 'string',
      required: false,
      multiple: false
    },
    {
      id: 'model_config',
      name: 'Model Config',
      type: 'output',
      position: 'bottom',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'selection_criteria',
      type: 'select',
      label: 'Selection Criteria',
      options: ['task_type', 'cost', 'speed', 'quality', 'custom'],
      default: 'task_type',
      required: true,
      description: 'Primary criteria for model selection'
    },
    {
      name: 'task_model_mapping',
      type: 'json',
      label: 'Task-Model Mapping',
      default: '{\n  "coding": "gpt-4o",\n  "writing": "claude-3.5-sonnet",\n  "analysis": "claude-4",\n  "research": "gemini-2.5-pro",\n  "creative": "claude-3.5-sonnet"\n}',
      description: 'Mapping of task types to preferred models'
    },
    {
      name: 'quality_threshold',
      type: 'number',
      label: 'Quality Threshold',
      min: 0,
      max: 1,
      step: 0.1,
      default: 0.8,
      description: 'Minimum quality score required'
    },
    {
      name: 'max_cost_per_request',
      type: 'number',
      label: 'Max Cost Per Request ($)',
      min: 0,
      max: 1,
      step: 0.01,
      default: 0.1,
      description: 'Maximum acceptable cost per request'
    },
    {
      name: 'custom_selection_logic',
      type: 'textarea',
      label: 'Custom Selection Logic',
      placeholder: 'if (task.includes("code")) return "gpt-4o";\nif (task.length > 1000) return "claude-4";\nreturn "claude-3.5-sonnet";',
      description: 'JavaScript code for custom model selection'
    }
  ],
  executeFunction: 'AIModelSelectorExecutor'
};

export const AIModelMonitorNode: NodeTypeDefinition = {
  id: 'ai_model_monitor',
  name: 'AI Model Monitor',
  category: NodeCategory.AI,
  subType: NodeSubType.LLM_CHAT,
  description: 'Monitor AI model performance, costs, and usage metrics',
  icon: '📊',
  color: '#F59E0B',
  inputs: [
    {
      id: 'model_requests',
      name: 'Model Requests',
      type: 'input',
      position: 'left',
      dataType: 'array',
      required: false,
      multiple: true
    }
  ],
  outputs: [
    {
      id: 'performance_metrics',
      name: 'Performance Metrics',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    },
    {
      id: 'cost_analysis',
      name: 'Cost Analysis',
      type: 'output',
      position: 'bottom',
      dataType: 'object',
      required: false,
      multiple: false
    },
    {
      id: 'alerts',
      name: 'Alerts',
      type: 'output',
      position: 'top',
      dataType: 'array',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'monitoring_interval',
      type: 'number',
      label: 'Monitoring Interval (seconds)',
      min: 1,
      max: 3600,
      default: 60,
      description: 'How often to collect metrics'
    },
    {
      name: 'cost_alert_threshold',
      type: 'number',
      label: 'Cost Alert Threshold ($)',
      min: 0,
      max: 1000,
      step: 0.01,
      default: 10.0,
      description: 'Alert when costs exceed this amount'
    },
    {
      name: 'performance_alert_threshold',
      type: 'number',
      label: 'Performance Alert Threshold (ms)',
      min: 100,
      max: 30000,
      default: 5000,
      description: 'Alert when response time exceeds this'
    },
    {
      name: 'track_metrics',
      type: 'json',
      label: 'Metrics to Track',
      default: '["response_time", "token_usage", "cost", "error_rate", "quality_score"]',
      description: 'Array of metrics to monitor'
    },
    {
      name: 'export_format',
      type: 'select',
      label: 'Export Format',
      options: ['json', 'csv', 'prometheus', 'grafana'],
      default: 'json',
      description: 'Format for exporting metrics'
    },
    {
      name: 'retention_days',
      type: 'number',
      label: 'Data Retention (days)',
      min: 1,
      max: 365,
      default: 30,
      description: 'How long to keep monitoring data'
    }
  ],
  executeFunction: 'AIModelMonitorExecutor'
};

export const AINodes: NodeTypeDefinition[] = [
  LLMChatNode,
  TextClassifierNode,
  ImageAnalyzerNode,
  TextSummarizerNode,
  AIAgentNode,
  AIModelManagerNode,
  AIModelSelectorNode,
  AIModelMonitorNode
];