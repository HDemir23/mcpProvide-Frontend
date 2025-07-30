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
      options: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'gemini-pro'],
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
      options: ['gpt-4-vision', 'claude-3-vision', 'google-vision'],
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
      options: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet'],
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

export const AINodes: NodeTypeDefinition[] = [
  LLMChatNode,
  TextClassifierNode,
  ImageAnalyzerNode,
  TextSummarizerNode
];