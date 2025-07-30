import { WorkflowTemplate, TemplateCategory } from '../../types/templates';
import { NodeFactory } from '../NodeFactory';

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
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
      NodeFactory.createNode('manual_trigger', { x: 100, y: 200 }),
      NodeFactory.createNode('llm_chat', { x: 350, y: 200 }),
      NodeFactory.createNode('text_classifier', { x: 600, y: 200 }),
      NodeFactory.createNode('if_condition', { x: 850, y: 200 }),
      NodeFactory.createNode('http_request', { x: 1100, y: 150 }),
      NodeFactory.createNode('email_send', { x: 1100, y: 250 })
    ],
    edges: [
      {
        id: 'e1-2',
        source: NodeFactory.createNode('manual_trigger', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('llm_chat', { x: 0, y: 0 }).id,
        sourceHandle: 'trigger_data',
        targetHandle: 'prompt_input'
      },
      {
        id: 'e2-3',
        source: NodeFactory.createNode('llm_chat', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('text_classifier', { x: 0, y: 0 }).id,
        sourceHandle: 'ai_response',
        targetHandle: 'text_input'
      },
      {
        id: 'e3-4',
        source: NodeFactory.createNode('text_classifier', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('if_condition', { x: 0, y: 0 }).id,
        sourceHandle: 'classification',
        targetHandle: 'condition_input'
      },
      {
        id: 'e4-5',
        source: NodeFactory.createNode('if_condition', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('http_request', { x: 0, y: 0 }).id,
        sourceHandle: 'true_output',
        targetHandle: 'trigger_input'
      },
      {
        id: 'e4-6',
        source: NodeFactory.createNode('if_condition', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('email_send', { x: 0, y: 0 }).id,
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
      NodeFactory.createNode('file_trigger', { x: 100, y: 200 }),
      NodeFactory.createNode('csv_parser', { x: 350, y: 200 }),
      NodeFactory.createNode('filter', { x: 600, y: 200 }),
      NodeFactory.createNode('data_transformer', { x: 850, y: 200 }),
      NodeFactory.createNode('json_parser', { x: 1100, y: 200 }),
      NodeFactory.createNode('database', { x: 1350, y: 200 })
    ],
    edges: [
      {
        id: 'e1-2',
        source: NodeFactory.createNode('file_trigger', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('csv_parser', { x: 0, y: 0 }).id,
        sourceHandle: 'file_content',
        targetHandle: 'csv_input'
      },
      {
        id: 'e2-3',
        source: NodeFactory.createNode('csv_parser', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('filter', { x: 0, y: 0 }).id,
        sourceHandle: 'parsed_csv',
        targetHandle: 'filter_input'
      },
      {
        id: 'e3-4',
        source: NodeFactory.createNode('filter', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('data_transformer', { x: 0, y: 0 }).id,
        sourceHandle: 'filtered_output',
        targetHandle: 'data_input'
      },
      {
        id: 'e4-5',
        source: NodeFactory.createNode('data_transformer', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('json_parser', { x: 0, y: 0 }).id,
        sourceHandle: 'transformed_data',
        targetHandle: 'json_input'
      },
      {
        id: 'e5-6',
        source: NodeFactory.createNode('json_parser', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('database', { x: 0, y: 0 }).id,
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
      NodeFactory.createNode('webhook_trigger', { x: 100, y: 200 }),
      NodeFactory.createNode('json_parser', { x: 350, y: 200 }),
      NodeFactory.createNode('if_condition', { x: 600, y: 200 }),
      NodeFactory.createNode('email_send', { x: 850, y: 150 }),
      NodeFactory.createNode('http_request', { x: 850, y: 250 })
    ],
    edges: [
      {
        id: 'e1-2',
        source: NodeFactory.createNode('webhook_trigger', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('json_parser', { x: 0, y: 0 }).id,
        sourceHandle: 'webhook_data',
        targetHandle: 'json_input'
      },
      {
        id: 'e2-3',
        source: NodeFactory.createNode('json_parser', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('if_condition', { x: 0, y: 0 }).id,
        sourceHandle: 'parsed_data',
        targetHandle: 'condition_input'
      },
      {
        id: 'e3-4',
        source: NodeFactory.createNode('if_condition', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('email_send', { x: 0, y: 0 }).id,
        sourceHandle: 'true_output',
        targetHandle: 'email_input'
      },
      {
        id: 'e3-5',
        source: NodeFactory.createNode('if_condition', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('http_request', { x: 0, y: 0 }).id,
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
      NodeFactory.createNode('file_trigger', { x: 100, y: 200 }),
      NodeFactory.createNode('image_analyzer', { x: 350, y: 200 }),
      NodeFactory.createNode('text_classifier', { x: 600, y: 200 }),
      NodeFactory.createNode('switch', { x: 850, y: 200 }),
      NodeFactory.createNode('file_operation', { x: 1100, y: 150 }),
      NodeFactory.createNode('database', { x: 1100, y: 250 })
    ],
    edges: [
      {
        id: 'e1-2',
        source: NodeFactory.createNode('file_trigger', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('image_analyzer', { x: 0, y: 0 }).id,
        sourceHandle: 'file_data',
        targetHandle: 'image_input'
      },
      {
        id: 'e2-3',
        source: NodeFactory.createNode('image_analyzer', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('text_classifier', { x: 0, y: 0 }).id,
        sourceHandle: 'analysis_result',
        targetHandle: 'text_input'
      },
      {
        id: 'e3-4',
        source: NodeFactory.createNode('text_classifier', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('switch', { x: 0, y: 0 }).id,
        sourceHandle: 'classification',
        targetHandle: 'switch_input'
      },
      {
        id: 'e4-5',
        source: NodeFactory.createNode('switch', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('file_operation', { x: 0, y: 0 }).id,
        sourceHandle: 'case_1',
        targetHandle: 'file_input'
      },
      {
        id: 'e4-6',
        source: NodeFactory.createNode('switch', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('database', { x: 0, y: 0 }).id,
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
      NodeFactory.createNode('schedule_trigger', { x: 100, y: 200 }),
      NodeFactory.createNode('database', { x: 350, y: 200 }),
      NodeFactory.createNode('file_operation', { x: 600, y: 200 }),
      NodeFactory.createNode('email_send', { x: 850, y: 200 })
    ],
    edges: [
      {
        id: 'e1-2',
        source: NodeFactory.createNode('schedule_trigger', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('database', { x: 0, y: 0 }).id,
        sourceHandle: 'trigger_time',
        targetHandle: 'query_input'
      },
      {
        id: 'e2-3',
        source: NodeFactory.createNode('database', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('file_operation', { x: 0, y: 0 }).id,
        sourceHandle: 'query_result',
        targetHandle: 'file_input'
      },
      {
        id: 'e3-4',
        source: NodeFactory.createNode('file_operation', { x: 0, y: 0 }).id,
        target: NodeFactory.createNode('email_send', { x: 0, y: 0 }).id,
        sourceHandle: 'file_output',
        targetHandle: 'email_input'
      }
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