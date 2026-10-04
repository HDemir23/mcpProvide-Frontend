import { WorkflowTemplate, TemplateCategory, CustomModeConfig } from '../../types/templates';

// Template node definition for creating nodes dynamically
interface TemplateNodeDef {
  id: string;
  nodeType: string;
  position: { x: number; y: number };
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  // Custom Mode Generation Templates
  {
    id: 'researcher_mode_template',
    name: '📚 AI Researcher Mode',
    description: 'Generate a research-focused AI mode configuration for comprehensive codebase analysis and information gathering',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Research', 'Mode', 'Configuration', 'Analysis'],
    difficulty: 'Beginner',
    estimatedTime: '5 minutes',
    author: 'MCPTree',
    version: '1.0.0',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    featured: true,
    rating: 5.0,
    usageCount: 500,
    customModeOutput: {
      slug: 'researcher',
      name: '📚Researcher',
      roleDefinition: 'You are Research Kilo, your job is to provide research information about the existing codebase.',
      customInstructions: "It's important that you take in requests for research and return accurate contextual and semantic search results. You can look at specific files and help answer the questions being asked. You should identify the file code occurs in, what it does, what impact changing it will have. Your main object is to provide extra context when needed.",
      groups: ['read', 'mcp']
    },
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: {
            trigger_name: 'Research Request Input'
          }
        }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'gpt-4o',
            system_prompt: 'You are Research Kilo, a specialized research assistant focused on codebase analysis. Your role is to provide accurate, contextual information about code structure, functionality, and relationships.',
            temperature: 0.3
          }
        }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 600, y: 200 },
        data: { 
          nodeTypeId: 'config_generator',
          properties: {
            output_format: 'yaml',
            template_type: 'custom_mode'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'trigger_data',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'ai_response',
        targetHandle: 'config_input'
      }
    ]
  },
  
  {
    id: 'designer_mode_template',
    name: '🎨 AI Designer Mode',
    description: 'Generate a design-focused AI mode configuration for UI/UX design and branding tasks',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Design', 'UI', 'UX', 'Mode', 'Configuration'],
    difficulty: 'Beginner',
    estimatedTime: '5 minutes',
    author: 'MCPTree',
    version: '1.0.0',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    featured: true,
    rating: 4.9,
    usageCount: 425,
    customModeOutput: {
      slug: 'designer',
      name: '🎨 Designer',
      roleDefinition: 'You excel at looking at my branding and crafting beautiful UIs. You pay attention to branding that already exists, and will use MCP tools if available to pull in additional branding information if necessary.',
      groups: ['read', 'edit', 'browser', 'command', 'mcp']
    },
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: {
            trigger_name: 'Design Task Input'
          }
        }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'claude-3.5-sonnet',
            system_prompt: 'You are a design expert focused on UI/UX and branding. You excel at creating beautiful, consistent designs that align with existing branding guidelines.',
            temperature: 0.7
          }
        }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 600, y: 200 },
        data: { 
          nodeTypeId: 'config_generator',
          properties: {
            output_format: 'yaml',
            template_type: 'custom_mode'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'trigger_data',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'ai_response',
        targetHandle: 'config_input'
      }
    ]
  },

  {
    id: 'micromanager_mode_template',
    name: '👴🏻 MicroManager AI Mode',
    description: 'Generate a strategic workflow orchestrator mode that coordinates complex tasks by delegating to specialized AI modes',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Management', 'Orchestration', 'Delegation', 'Workflow'],
    difficulty: 'Advanced',
    estimatedTime: '10 minutes',
    author: 'MCPTree',
    version: '1.0.0',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    featured: true,
    rating: 4.8,
    usageCount: 275,
    customModeOutput: {
      slug: 'micromanager',
      name: '👴🏻 MicroManager',
      roleDefinition: 'You are Kilo, a strategic workflow orchestrator who coordinates complex tasks by delegating them to appropriate specialized modes. You have a comprehensive understanding of each mode\'s capabilities and limitations, allowing you to effectively break down complex problems into discrete tasks that can be solved by different specialists.',
      customInstructions: 'Your role is to coordinate complex workflows by delegating tasks to specialized modes, not to perform the tasks themselves. As an orchestrator, you should:\n\n1. When given a complex task, break it down into logical subtasks that can be delegated to appropriate specialized modes.\n2. Task Delegation Guidelines: For each subtask, use the new_task tool to delegate to the appropriate mode based on task complexity and requirements.\n3. Track and manage the progress of all subtasks.\n4. Help the user understand how the different subtasks fit together in the overall workflow.',
      groups: ['read'],
      source: 'global'
    },
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: {
            trigger_name: 'Complex Task Input'
          }
        }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 400, y: 200 },
        data: { 
          nodeTypeId: 'ai_agent',
          properties: {
            primary_model: 'claude-4',
            task_config: '{\n  "task_analysis": "gpt-4o",\n  "delegation_strategy": "claude-4",\n  "progress_tracking": "gemini-2.5-pro",\n  "workflow_coordination": "claude-3.5-sonnet"\n}',
            coordination_strategy: 'hierarchical',
            manager_instructions: 'You are a strategic workflow orchestrator. Break down complex tasks into smaller, manageable subtasks and delegate them to appropriate specialized modes.'
          }
        }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 750, y: 200 },
        data: { 
          nodeTypeId: 'config_generator',
          properties: {
            output_format: 'yaml',
            template_type: 'custom_mode'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'trigger_data',
        targetHandle: 'task_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'final_result',
        targetHandle: 'config_input'
      }
    ]
  },

  {
    id: 'development_team_hierarchy',
    name: '👨‍💻 Full Development Team Modes',
    description: 'Generate a complete hierarchy of development-focused AI modes: Intern, Junior, MidLevel, and Senior developers with proper escalation paths',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Development', 'Team', 'Hierarchy', 'Programming'],
    difficulty: 'Advanced',
    estimatedTime: '15 minutes',
    author: 'MCPTree',
    version: '1.0.0',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    featured: true,
    rating: 4.9,
    usageCount: 180,
    customModeOutput: {
      modes: [
        {
          slug: 'intern',
          name: '👶🏻 Intern',
          roleDefinition: 'You are my assistant programmer named Kilo Jr. Your job is to implement the exact code I tell you to implement and nothing else.',
          groups: ['read', 'edit', 'browser', 'command', 'mcp'],
          customInstructions: 'If you fail to complete your task after several attempts, complete your task with a message saying you failed and to escalate to the Junior or MidLevel mode.'
        },
        {
          slug: 'junior',
          name: '👦🏻 Junior',
          roleDefinition: 'You are my assistant programmer named Kilo Jr. You are looking to get promoted so aim to build the best code possible when tasked with writing code. If you run into errors you attempt to fix it.',
          groups: ['read', 'edit', 'browser', 'command', 'mcp'],
          customInstructions: 'If you run into the same error several times in a row, complete your task with information about the error, and ask for help from the MidLevel mode.'
        },
        {
          slug: 'midlevel',
          name: '👨🏻 MidLevel',
          roleDefinition: 'You are my assistant programmer named Kilo Mid. Your context is focused on the files you\'ve been given to work on. You will be given general guidance on what to change, but can take a little freedom in how you implement the solutions.',
          groups: ['read', 'edit', 'browser', 'command', 'mcp'],
          customInstructions: 'You should be able to handle most problems, but if you get stuck trying to fix something, you can end your task, with info on the failure and have the Senior mode take over.'
        },
        {
          slug: 'senior',
          name: '👨🏻🦳 Senior',
          roleDefinition: 'You are my expert programmer named Kilo Sr. You are an expert programmer, that is free to implement functionality across multiple files. You take general guidelines about what needs to be done, and solve the toughest problems. You will look at the context around the problem to see the bigger picture of the problem you are working on, even if this means reading multiple files to identify the breadth of the problem before coding.',
          groups: ['read', 'edit', 'browser', 'command', 'mcp'],
          source: 'global'
        }
      ]
    },
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: {
            trigger_name: 'Development Task Assignment'
          }
        }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 400, y: 150 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'claude-3.5-sonnet',
            system_prompt: 'You are Kilo Jr (Intern). Focus on implementing exact specifications with minimal deviation.',
            temperature: 0.2
          }
        }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 400, y: 220 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'gpt-4o',
            system_prompt: 'You are Kilo Jr (Junior). Aim to build quality code and fix errors when encountered.',
            temperature: 0.3
          }
        }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 400, y: 290 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'claude-4',
            system_prompt: 'You are Kilo Mid (MidLevel). Take general guidance and implement solutions with some creative freedom.',
            temperature: 0.4
          }
        }
      },
      {
        id: 'node-5',
        type: 'dynamic',
        position: { x: 400, y: 360 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'claude-4',
            system_prompt: 'You are Kilo Sr (Senior). Expert programmer with full context and multi-file implementation capabilities.',
            temperature: 0.5
          }
        }
      },
      {
        id: 'node-6',
        type: 'dynamic',
        position: { x: 750, y: 250 },
        data: { 
          nodeTypeId: 'config_generator',
          properties: {
            output_format: 'yaml',
            template_type: 'multi_mode'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'trigger_data',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e1-3',
        source: 'node-1',
        target: 'node-3',
        sourceHandle: 'trigger_data',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e1-4',
        source: 'node-1',
        target: 'node-4',
        sourceHandle: 'trigger_data',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e1-5',
        source: 'node-1',
        target: 'node-5',
        sourceHandle: 'trigger_data',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e2-6',
        source: 'node-2',
        target: 'node-6',
        sourceHandle: 'ai_response',
        targetHandle: 'config_input'
      },
      {
        id: 'e3-6',
        source: 'node-3',
        target: 'node-6',
        sourceHandle: 'ai_response',
        targetHandle: 'config_input'
      },
      {
        id: 'e4-6',
        source: 'node-4',
        target: 'node-6',
        sourceHandle: 'ai_response',
        targetHandle: 'config_input'
      },
      {
        id: 'e5-6',
        source: 'node-5',
        target: 'node-6',
        sourceHandle: 'ai_response',
        targetHandle: 'config_input'
      }
    ]
  },

  {
    id: 'ai_content_generator',
    name: 'AI Content Generator',
    description: 'Generate blog posts using AI with automated publishing workflow',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Content', 'Blog', 'Automation'],
    difficulty: 'Intermediate',
    estimatedTime: '15 minutes',
    author: 'Template Library',
    version: '1.0.0',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    featured: true,
    rating: 4.8,
    usageCount: 1250,
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { nodeTypeId: 'manual_trigger' }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: { nodeTypeId: 'llm_chat' }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 600, y: 200 },
        data: { nodeTypeId: 'text_classifier' }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 850, y: 200 },
        data: { nodeTypeId: 'if_condition' }
      },
      {
        id: 'node-5',
        type: 'dynamic',
        position: { x: 1100, y: 150 },
        data: { nodeTypeId: 'http_request' }
      },
      {
        id: 'node-6',
        type: 'dynamic',
        position: { x: 1100, y: 250 },
        data: { nodeTypeId: 'email_send' }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'trigger_data',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'ai_response',
        targetHandle: 'text_input'
      },
      {
        id: 'e3-4',
        source: 'node-3',
        target: 'node-4',
        sourceHandle: 'classification',
        targetHandle: 'condition_input'
      },
      {
        id: 'e4-5',
        source: 'node-4',
        target: 'node-5',
        sourceHandle: 'true_output',
        targetHandle: 'trigger_input'
      },
      {
        id: 'e4-6',
        source: 'node-4',
        target: 'node-6',
        sourceHandle: 'false_output',
        targetHandle: 'email_input'
      }
    ]
  },
  
  {
    id: 'data_processing_pipeline',
    name: 'Data Processing Pipeline',
    description: 'ETL pipeline for processing CSV data with validation and transformation',
    category: TemplateCategory.DATA_PROCESSING,
    tags: ['Data', 'ETL', 'Validation', 'CSV', 'Transform'],
    difficulty: 'Advanced',
    estimatedTime: '30 minutes',
    author: 'Template Library',
    version: '1.2.0',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    featured: true,
    rating: 4.6,
    usageCount: 850,
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { nodeTypeId: 'file_trigger' }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: { nodeTypeId: 'csv_parser' }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 600, y: 200 },
        data: { nodeTypeId: 'filter' }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 850, y: 200 },
        data: { nodeTypeId: 'data_transformer' }
      },
      {
        id: 'node-5',
        type: 'dynamic',
        position: { x: 1100, y: 200 },
        data: { nodeTypeId: 'json_parser' }
      },
      {
        id: 'node-6',
        type: 'dynamic',
        position: { x: 1350, y: 200 },
        data: { nodeTypeId: 'database' }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'file_content',
        targetHandle: 'csv_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'parsed_csv',
        targetHandle: 'filter_input'
      },
      {
        id: 'e3-4',
        source: 'node-3',
        target: 'node-4',
        sourceHandle: 'filtered_output',
        targetHandle: 'data_input'
      },
      {
        id: 'e4-5',
        source: 'node-4',
        target: 'node-5',
        sourceHandle: 'transformed_data',
        targetHandle: 'json_input'
      },
      {
        id: 'e5-6',
        source: 'node-5',
        target: 'node-6',
        sourceHandle: 'parsed_data',
        targetHandle: 'query_input'
      }
    ]
  },

  {
    id: 'webhook_notification_system',
    name: 'Webhook Notification System',
    description: 'Receive webhooks and send notifications across multiple channels',
    category: TemplateCategory.COMMUNICATION,
    tags: ['Webhook', 'Notifications', 'Email', 'Multi-channel'],
    difficulty: 'Beginner',
    estimatedTime: '10 minutes',
    author: 'Template Library',
    version: '1.0.0',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    featured: false,
    rating: 4.3,
    usageCount: 650,
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { nodeTypeId: 'webhook_trigger' }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: { nodeTypeId: 'json_parser' }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 600, y: 200 },
        data: { nodeTypeId: 'if_condition' }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 850, y: 150 },
        data: { nodeTypeId: 'email_send' }
      },
      {
        id: 'node-5',
        type: 'dynamic',
        position: { x: 850, y: 250 },
        data: { nodeTypeId: 'http_request' }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'webhook_data',
        targetHandle: 'json_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'parsed_data',
        targetHandle: 'condition_input'
      },
      {
        id: 'e3-4',
        source: 'node-3',
        target: 'node-4',
        sourceHandle: 'true_output',
        targetHandle: 'email_input'
      },
      {
        id: 'e3-5',
        source: 'node-3',
        target: 'node-5',
        sourceHandle: 'false_output',
        targetHandle: 'trigger_input'
      }
    ]
  },

  {
    id: 'ai_image_analysis',
    name: 'AI Image Analysis Workflow',
    description: 'Analyze uploaded images using AI and categorize them automatically',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Image', 'Analysis', 'Classification'],
    difficulty: 'Intermediate',
    estimatedTime: '20 minutes',
    author: 'Template Library',
    version: '1.1.0',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
    featured: true,
    rating: 4.7,
    usageCount: 420,
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { nodeTypeId: 'file_trigger' }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: { nodeTypeId: 'image_analyzer' }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 600, y: 200 },
        data: { nodeTypeId: 'text_classifier' }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 850, y: 200 },
        data: { nodeTypeId: 'switch' }
      },
      {
        id: 'node-5',
        type: 'dynamic',
        position: { x: 1100, y: 150 },
        data: { nodeTypeId: 'file_operation' }
      },
      {
        id: 'node-6',
        type: 'dynamic',
        position: { x: 1100, y: 250 },
        data: { nodeTypeId: 'database' }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'file_data',
        targetHandle: 'image_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'analysis_result',
        targetHandle: 'text_input'
      },
      {
        id: 'e3-4',
        source: 'node-3',
        target: 'node-4',
        sourceHandle: 'classification',
        targetHandle: 'switch_input'
      },
      {
        id: 'e4-5',
        source: 'node-4',
        target: 'node-5',
        sourceHandle: 'case_1',
        targetHandle: 'file_input'
      },
      {
        id: 'e4-6',
        source: 'node-4',
        target: 'node-6',
        sourceHandle: 'case_2',
        targetHandle: 'query_input'
      }
    ]
  },

  {
    id: 'scheduled_backup',
    name: 'Scheduled Data Backup',
    description: 'Automated daily backup of database data with email notifications',
    category: TemplateCategory.AUTOMATION,
    tags: ['Backup', 'Schedule', 'Database', 'Email'],
    difficulty: 'Beginner',
    estimatedTime: '15 minutes',
    author: 'Template Library',
    version: '1.0.0',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    featured: false,
    rating: 4.2,
    usageCount: 380,
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { nodeTypeId: 'schedule_trigger' }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: { nodeTypeId: 'database' }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 600, y: 200 },
        data: { nodeTypeId: 'file_operation' }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 850, y: 200 },
        data: { nodeTypeId: 'email_send' }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'trigger_time',
        targetHandle: 'query_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'query_result',
        targetHandle: 'file_input'
      },
      {
        id: 'e3-4',
        source: 'node-3',
        target: 'node-4',
        sourceHandle: 'file_output',
        targetHandle: 'email_input'
      }
    ]
  },

  {
    id: 'ai_development_team',
    name: 'AI Development Team Workflow',
    description: 'Coordinate multiple AI models as a development team - styling, algorithms, functions, and documentation',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Team', 'Development', 'Coordination', 'Multi-Model'],
    difficulty: 'Advanced',
    estimatedTime: '25 minutes',
    author: 'Template Library',
    version: '1.0.0',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    featured: true,
    rating: 4.9,
    usageCount: 150,
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: {
            trigger_name: 'Start Development Task'
          }
        }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 400, y: 200 },
        data: { 
          nodeTypeId: 'ai_agent',
          properties: {
            primary_model: 'gemini-2.5-pro',
            task_config: '{\n  "styling": "claude-3.5-sonnet",\n  "algorithms": "claude-4",\n  "functions": "gpt-4o",\n  "documentation": "gemini-2.5-pro",\n  "testing": "claude-3.5-sonnet",\n  "optimization": "claude-4"\n}',
            coordination_strategy: 'hierarchical',
            manager_instructions: 'You are managing a software development team. Break down complex development tasks and assign them to specialized AI models based on their strengths.'
          }
        }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 750, y: 150 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'claude-3.5-sonnet',
            system_prompt: 'You are a styling expert. Focus on CSS, UI/UX design, and frontend aesthetics.'
          }
        }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 750, y: 200 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'claude-4',
            system_prompt: 'You are an algorithms expert. Focus on data structures, algorithms, and optimization.'
          }
        }
      },
      {
        id: 'node-5',
        type: 'dynamic',
        position: { x: 750, y: 250 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: {
            model: 'gpt-4o',
            system_prompt: 'You are a functions expert. Focus on writing clean, efficient functions and APIs.'
          }
        }
      },
      {
        id: 'node-6',
        type: 'dynamic',
        position: { x: 1100, y: 200 },
        data: { 
          nodeTypeId: 'text_summarizer',
          properties: {
            model: 'gemini-2.5-pro',
            summary_length: 'medium'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'trigger_data',
        targetHandle: 'task_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'delegated_tasks',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e2-4',
        source: 'node-2',
        target: 'node-4',
        sourceHandle: 'delegated_tasks',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e2-5',
        source: 'node-2',
        target: 'node-5',
        sourceHandle: 'delegated_tasks',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e3-2',
        source: 'node-3',
        target: 'node-2',
        sourceHandle: 'ai_response',
        targetHandle: 'ai_responses'
      },
      {
        id: 'e4-2',
        source: 'node-4',
        target: 'node-2',
        sourceHandle: 'ai_response',
        targetHandle: 'ai_responses'
      },
      {
        id: 'e5-2',
        source: 'node-5',
        target: 'node-2',
        sourceHandle: 'ai_response',
        targetHandle: 'ai_responses'
      },
      {
        id: 'e2-6',
        source: 'node-2',
        target: 'node-6',
        sourceHandle: 'final_result',
        targetHandle: 'text_input'
      }
    ]
  },

  {
    id: 'ai_content_creation_pipeline',
    name: 'AI Content Creation Pipeline',
    description: 'Multi-AI workflow for creating comprehensive content with research, writing, editing, and optimization',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Content', 'Research', 'Writing', 'SEO'],
    difficulty: 'Intermediate',
    estimatedTime: '20 minutes',
    author: 'Template Library',
    version: '1.0.0',
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26'),
    featured: true,
    rating: 4.7,
    usageCount: 95,
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: {
            trigger_name: 'Content Topic Input'
          }
        }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 400, y: 200 },
        data: { 
          nodeTypeId: 'ai_agent',
          properties: {
            primary_model: 'claude-4',
            task_config: '{\n  "research": "gpt-4o",\n  "writing": "claude-3.5-sonnet",\n  "editing": "claude-4",\n  "seo_optimization": "gemini-2.5-pro",\n  "fact_checking": "gpt-4o"\n}',
            coordination_strategy: 'sequential',
            manager_instructions: 'You are coordinating a content creation pipeline. Ensure each step builds upon the previous one for high-quality content.'
          }
        }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 750, y: 200 },
        data: { 
          nodeTypeId: 'text_classifier',
          properties: {
            categories: '["excellent", "good", "needs_improvement", "poor"]'
          }
        }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 1000, y: 150 },
        data: { 
          nodeTypeId: 'if_condition',
          properties: {
            condition: 'quality >= "good"'
          }
        }
      },
      {
        id: 'node-5',
        type: 'dynamic',
        position: { x: 1250, y: 100 },
        data: { 
          nodeTypeId: 'http_request',
          properties: {
            method: 'POST',
            url: 'https://api.cms.example.com/publish'
          }
        }
      },
      {
        id: 'node-6',
        type: 'dynamic',
        position: { x: 1250, y: 200 },
        data: { 
          nodeTypeId: 'email_send',
          properties: {
            subject: 'Content Review Required'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'trigger_data',
        targetHandle: 'task_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'final_result',
        targetHandle: 'text_input'
      },
      {
        id: 'e3-4',
        source: 'node-3',
        target: 'node-4',
        sourceHandle: 'classification',
        targetHandle: 'condition_input'
      },
      {
        id: 'e4-5',
        source: 'node-4',
        target: 'node-5',
        sourceHandle: 'true_output',
        targetHandle: 'trigger_input'
      },
      {
        id: 'e4-6',
        source: 'node-4',
        target: 'node-6',
        sourceHandle: 'false_output',
        targetHandle: 'email_input'
      }
    ]
  },

  {
    id: 'ai_code_review_system',
    name: 'AI Code Review System',
    description: 'Comprehensive code review using multiple AI models for security, performance, style, and documentation',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Code Review', 'Security', 'Performance', 'Documentation'],
    difficulty: 'Advanced',
    estimatedTime: '30 minutes',
    author: 'Template Library',
    version: '1.0.0',
    createdAt: new Date('2024-01-27'),
    updatedAt: new Date('2024-01-27'),
    featured: false,
    rating: 4.8,
    usageCount: 75,
    nodes: [
      {
        id: 'node-1',
        type: 'dynamic',
        position: { x: 100, y: 200 },
        data: { 
          nodeTypeId: 'webhook_trigger',
          properties: {
            webhook_name: 'Code Commit Trigger'
          }
        }
      },
      {
        id: 'node-2',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: { 
          nodeTypeId: 'json_parser',
          properties: {
            parse_path: '$.code_diff'
          }
        }
      },
      {
        id: 'node-3',
        type: 'dynamic',
        position: { x: 600, y: 200 },
        data: { 
          nodeTypeId: 'ai_agent',
          properties: {
            primary_model: 'claude-4',
            task_config: '{\n  "security_review": "claude-4",\n  "performance_analysis": "gpt-4o",\n  "style_check": "claude-3.5-sonnet",\n  "documentation_review": "gemini-2.5-pro",\n  "bug_detection": "claude-4",\n  "best_practices": "gpt-4o"\n}',
            coordination_strategy: 'parallel',
            manager_instructions: 'You are managing a comprehensive code review. Each AI should focus on their specialty and provide detailed feedback.'
          }
        }
      },
      {
        id: 'node-4',
        type: 'dynamic',
        position: { x: 950, y: 200 },
        data: { 
          nodeTypeId: 'text_summarizer',
          properties: {
            model: 'claude-4',
            summary_length: 'long',
            extract_key_points: true
          }
        }
      },
      {
        id: 'node-5',
        type: 'dynamic',
        position: { x: 1200, y: 200 },
        data: { 
          nodeTypeId: 'http_request',
          properties: {
            method: 'POST',
            url: 'https://api.github.com/repos/user/repo/pulls/comments'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'webhook_data',
        targetHandle: 'json_input'
      },
      {
        id: 'e2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'parsed_data',
        targetHandle: 'task_input'
      },
      {
        id: 'e3-4',
        source: 'node-3',
        target: 'node-4',
        sourceHandle: 'final_result',
        targetHandle: 'text_input'
      },
      {
        id: 'e4-5',
        source: 'node-4',
        target: 'node-5',
        sourceHandle: 'summary',
        targetHandle: 'trigger_input'
      }
    ]
  },

  // Enhanced AI Workflow Templates - Ready to Use
  {
    id: 'ai_research_assistant_workflow',
    name: '📚 AI Research Assistant',
    description: 'Complete research workflow with AI-powered analysis and report generation using GPT-4o and Claude',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Research', 'Analysis', 'Ready-to-Use', 'GPT-4o', 'Claude'],
    difficulty: 'Beginner',
    estimatedTime: '5 minutes',
    author: 'MCPTree Enhanced',
    version: '2.0.0',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    featured: true,
    rating: 5.0,
    usageCount: 1200,
    customModeOutput: {
      slug: 'researcher',
      name: '📚 Research Kilo',
      roleDefinition: 'You are Research Kilo, your job is to provide research information about the existing codebase.',
      customInstructions: "Focus on comprehensive research and analysis. Look at specific files and provide contextual analysis with accurate search results. Identify what code does, its impact, and provide extra context when needed.",
      groups: ['read', 'mcp', 'web_search']
    },
    nodes: [
      {
        id: 'trigger-1',
        type: 'dynamic',
        position: { x: 50, y: 150 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: { trigger_name: 'Research Request' }
        }
      },
      {
        id: 'ai-research',
        type: 'dynamic',
        position: { x: 300, y: 150 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: { 
            model: 'gpt-4o', 
            temperature: 0.3,
            system_prompt: 'You are Research Kilo. Provide comprehensive research and contextual analysis of codebases.'
          }
        }
      },
      {
        id: 'output-1',
        type: 'dynamic',
        position: { x: 550, y: 150 },
        data: { 
          nodeTypeId: 'text_output',
          properties: { format: 'markdown' }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'trigger-1', target: 'ai-research', sourceHandle: 'trigger_data', targetHandle: 'prompt_input' },
      { id: 'e2-3', source: 'ai-research', target: 'output-1', sourceHandle: 'ai_response', targetHandle: 'text_input' }
    ]
  },

  {
    id: 'ai_micromanager_team_workflow',
    name: '👴🏻 AI MicroManager Team',
    description: 'Advanced AI team with MicroManager using Claude-4 to coordinate Claude-3.5 (styling), GPT-4 (algorithms), and Claude-4 (functions)',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Team', 'MicroManager', 'Claude-4', 'GPT-4', 'Coordination', 'Ready-to-Use'],
    difficulty: 'Advanced',
    estimatedTime: '20 minutes',
    author: 'MCPTree Enhanced',
    version: '2.0.0',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    featured: true,
    rating: 5.0,
    usageCount: 800,
    customModeOutput: {
      slug: 'micromanager',
      name: '👴🏻 MicroManager',
      roleDefinition: 'You are MicroManager, a strategic workflow orchestrator responsible for coordinating multiple AI agents.',
      customInstructions: "Break down complex tasks and delegate to specialized agents: Claude-3.5 for styling, GPT-4 for algorithms, Claude-4 for functions. Coordinate workflows and ensure quality across all outputs.",
      groups: ['coordination', 'delegation', 'management']
    },
    nodes: [
      {
        id: 'task-input',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: { trigger_name: 'Development Task' }
        }
      },
      {
        id: 'micromanager',
        type: 'dynamic',
        position: { x: 300, y: 200 },
        data: { 
          nodeTypeId: 'ai_agent',
          properties: { 
            primary_model: 'claude-4',
            coordination_strategy: 'hierarchical',
            manager_instructions: 'Coordinate Claude-3.5 (styling only), GPT-4 (algorithms only), Claude-4 (functions only). Delegate tasks appropriately.'
          }
        }
      },
      {
        id: 'claude-styling',
        type: 'dynamic',
        position: { x: 550, y: 100 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: { 
            model: 'claude-3.5-sonnet',
            system_prompt: 'You are Claude-3.5 Styling Expert. Handle ONLY styling tasks: CSS, SCSS, design systems, UI components. Do not write algorithms or functions.'
          }
        }
      },
      {
        id: 'gpt-algorithms',
        type: 'dynamic',
        position: { x: 550, y: 200 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: { 
            model: 'gpt-4',
            system_prompt: 'You are GPT-4 Algorithm Expert. Handle ONLY algorithmic tasks: data structures, sorting, optimization, mathematical computations. Do not write styling or basic functions.'
          }
        }
      },
      {
        id: 'claude-functions',
        type: 'dynamic',
        position: { x: 550, y: 300 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: { 
            model: 'claude-4',
            system_prompt: 'You are Claude-4 Function Expert. Handle ONLY function implementation: business logic, API calls, data processing, utilities. Do not write styling or algorithms.'
          }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'task-input', target: 'micromanager', sourceHandle: 'trigger_data', targetHandle: 'task_input' },
      { id: 'e2-3', source: 'micromanager', target: 'claude-styling', sourceHandle: 'delegated_tasks', targetHandle: 'prompt_input' },
      { id: 'e2-4', source: 'micromanager', target: 'gpt-algorithms', sourceHandle: 'delegated_tasks', targetHandle: 'prompt_input' },
      { id: 'e2-5', source: 'micromanager', target: 'claude-functions', sourceHandle: 'delegated_tasks', targetHandle: 'prompt_input' }
    ]
  },

  {
    id: 'ai_design_assistant_workflow',
    name: '🎨 AI Design Assistant',
    description: 'UI/UX design workflow with Claude-3.5 for design and code generation',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Design', 'UI/UX', 'Claude-3.5', 'Code Generation', 'Ready-to-Use'],
    difficulty: 'Beginner',
    estimatedTime: '10 minutes',
    author: 'MCPTree Enhanced',
    version: '2.0.0',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    featured: true,
    rating: 4.9,
    usageCount: 950,
    customModeOutput: {
      slug: 'designer',
      name: '🎨 Design Expert',
      roleDefinition: 'You are a design expert focused on UI/UX and branding.',
      customInstructions: "Create beautiful, consistent designs that align with existing branding guidelines. Generate clean, responsive code from design specifications.",
      groups: ['design', 'ui_ux', 'code_generation']
    },
    nodes: [
      {
        id: 'design-brief',
        type: 'dynamic',
        position: { x: 50, y: 150 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: { trigger_name: 'Design Requirements' }
        }
      },
      {
        id: 'designer-ai',
        type: 'dynamic',
        position: { x: 300, y: 150 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: { 
            model: 'claude-3.5-sonnet',
            temperature: 0.7,
            system_prompt: 'You are a design expert. Create beautiful, consistent UI/UX designs and generate clean, responsive code.'
          }
        }
      },
      {
        id: 'code-output',
        type: 'dynamic',
        position: { x: 550, y: 150 },
        data: { 
          nodeTypeId: 'code_generator',
          properties: { output_format: 'react' }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'design-brief', target: 'designer-ai', sourceHandle: 'trigger_data', targetHandle: 'prompt_input' },
      { id: 'e2-3', source: 'designer-ai', target: 'code-output', sourceHandle: 'ai_response', targetHandle: 'design_input' }
    ]
  },

  {
    id: 'ai_content_creation_pipeline',
    name: '✍️ AI Content Creation Pipeline',
    description: 'End-to-end content creation with Gemini-2.5-Pro for research, Claude-3.5 for writing, and GPT-4 for editing',
    category: TemplateCategory.AI_CONTENT,
    tags: ['AI', 'Content', 'Writing', 'Gemini-2.5-Pro', 'Publishing', 'Ready-to-Use'],
    difficulty: 'Intermediate',
    estimatedTime: '15 minutes',
    author: 'MCPTree Enhanced',
    version: '2.0.0',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    featured: true,
    rating: 4.8,
    usageCount: 750,
    customModeOutput: {
      slug: 'content_creator',
      name: '✍️ Content Creator',
      roleDefinition: 'You are a skilled content creator specialized in comprehensive content workflows.',
      customInstructions: "Coordinate research, writing, and editing phases. Ensure high-quality, engaging content optimized for target audience and platform requirements.",
      groups: ['content', 'writing', 'research', 'editing']
    },
    nodes: [
      {
        id: 'topic-input',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: { 
          nodeTypeId: 'manual_trigger',
          properties: { trigger_name: 'Content Topic' }
        }
      },
      {
        id: 'research-ai',
        type: 'dynamic',
        position: { x: 250, y: 100 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: { 
            model: 'gemini-2.5-pro',
            system_prompt: 'You are a research specialist using Gemini-2.5-Pro. Gather comprehensive, accurate information on the given topic.'
          }
        }
      },
      {
        id: 'writer-ai',
        type: 'dynamic',
        position: { x: 250, y: 200 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: { 
            model: 'claude-3.5-sonnet',
            system_prompt: 'You are a skilled content writer using Claude-3.5. Create engaging, well-structured content based on research data.'
          }
        }
      },
      {
        id: 'editor-ai',
        type: 'dynamic',
        position: { x: 250, y: 300 },
        data: { 
          nodeTypeId: 'llm_chat',
          properties: { 
            model: 'gpt-4',
            system_prompt: 'You are an expert editor using GPT-4. Review and polish content for clarity, engagement, and grammatical perfection.'
          }
        }
      },
      {
        id: 'final-output',
        type: 'dynamic',
        position: { x: 450, y: 200 },
        data: { 
          nodeTypeId: 'text_output',
          properties: { format: 'markdown' }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'topic-input', target: 'research-ai', sourceHandle: 'trigger_data', targetHandle: 'prompt_input' },
      { id: 'e2-3', source: 'research-ai', target: 'writer-ai', sourceHandle: 'ai_response', targetHandle: 'prompt_input' },
      { id: 'e3-4', source: 'writer-ai', target: 'editor-ai', sourceHandle: 'ai_response', targetHandle: 'prompt_input' },
      { id: 'e4-5', source: 'editor-ai', target: 'final-output', sourceHandle: 'ai_response', targetHandle: 'text_input' }
    ]
  }
];

export function getTemplatesByCategory(category: TemplateCategory): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter(template => template.category === category);
}

export function getFeaturedTemplates(): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter(template => template.featured).slice(0, 6);
}

export function getPopularTemplates(limit: number = 5): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
}

export function searchTemplates(query: string): WorkflowTemplate[] {
  const lowerQuery = query.toLowerCase();
  return WORKFLOW_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Custom Mode Generation Functions
export function generateCustomModeConfig(template: WorkflowTemplate): string {
  if (!template.customModeOutput) {
    throw new Error('Template does not contain custom mode configuration');
  }

  const config = template.customModeOutput;
  
  if ('modes' in config && Array.isArray(config.modes)) {
    // Multi-mode configuration
    return `customModes:\n${config.modes.map(mode => {
      let yaml = `  - slug: ${mode.slug}\n`;
      yaml += `    name: ${mode.name}\n`;
      yaml += `    roleDefinition: ${mode.roleDefinition}\n`;
      if (mode.customInstructions) {
        yaml += `    customInstructions: ${mode.customInstructions.replace(/\n/g, '\\n')}\n`;
      }
      yaml += `    groups:\n${mode.groups.map(group => `      - ${group}`).join('\n')}\n`;
      if (mode.source) {
        yaml += `    source: ${mode.source}\n`;
      }
      return yaml;
    }).join('')}`;
  } else {
    // Single mode configuration - type assertion since we know it's not MultiModeConfig
    const singleConfig = config as CustomModeConfig;
    let yaml = `customModes:\n`;
    yaml += `  - slug: ${singleConfig.slug}\n`;
    yaml += `    name: ${singleConfig.name}\n`;
    yaml += `    roleDefinition: ${singleConfig.roleDefinition}\n`;
    if (singleConfig.customInstructions) {
      yaml += `    customInstructions: ${singleConfig.customInstructions.replace(/\n/g, '\\n')}\n`;
    }
    yaml += `    groups:\n${singleConfig.groups.map(group => `      - ${group}`).join('\n')}\n`;
    if (singleConfig.source) {
      yaml += `    source: ${singleConfig.source}\n`;
    }
    return yaml;
  }
}

export function hasCustomModeOutput(template: WorkflowTemplate): boolean {
  return !!template.customModeOutput;
}

export function getCustomModeTemplates(): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter(template => hasCustomModeOutput(template));
}

export function getTemplateStats() {
  const categoryCounts = WORKFLOW_TEMPLATES.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + 1;
    return acc;
  }, {} as Record<TemplateCategory, number>);

  const allTags = WORKFLOW_TEMPLATES.flatMap(template => template.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  const averageRating = WORKFLOW_TEMPLATES
    .reduce((sum, template) => sum + (template.rating || 0), 0) / WORKFLOW_TEMPLATES.length;

  return {
    totalTemplates: WORKFLOW_TEMPLATES.length,
    categoryCounts,
    popularTags,
    averageRating
  };
}