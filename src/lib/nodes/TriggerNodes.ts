import { NodeCategory, NodeSubType, NodeTypeDefinition } from '../../types/nodeTypes';

export const WebhookTriggerNode: NodeTypeDefinition = {
  id: 'webhook_trigger',
  name: 'Webhook',
  category: NodeCategory.TRIGGER,
  subType: NodeSubType.WEBHOOK,
  description: 'Trigger workflow via HTTP webhook',
  icon: '🌐',
  color: '#10B981',
  inputs: [],
  outputs: [
    {
      id: 'webhook_data',
      name: 'Webhook Data',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    },
    {
      id: 'headers',
      name: 'Headers',
      type: 'output',
      position: 'bottom',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'method',
      type: 'select',
      label: 'HTTP Method',
      options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      default: 'POST',
      required: true
    },
    {
      name: 'path',
      type: 'string',
      label: 'Webhook Path',
      placeholder: '/webhook/my-workflow',
      default: '/webhook',
      required: true
    },
    {
      name: 'authentication',
      type: 'select',
      label: 'Authentication',
      options: ['none', 'api_key', 'basic_auth', 'bearer_token'],
      default: 'none'
    },
    {
      name: 'response_mode',
      type: 'select',
      label: 'Response Mode',
      options: ['sync', 'async'],
      default: 'async'
    }
  ],
  executeFunction: 'WebhookTriggerExecutor'
};

export const ScheduleTriggerNode: NodeTypeDefinition = {
  id: 'schedule_trigger',
  name: 'Schedule',
  category: NodeCategory.TRIGGER,
  subType: NodeSubType.SCHEDULE,
  description: 'Trigger workflow on schedule',
  icon: '⏰',
  color: '#8B5CF6',
  inputs: [],
  outputs: [
    {
      id: 'trigger_time',
      name: 'Trigger Time',
      type: 'output',
      position: 'right',
      dataType: 'string',
      required: false,
      multiple: false
    },
    {
      id: 'execution_count',
      name: 'Execution Count',
      type: 'output',
      position: 'bottom',
      dataType: 'number',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'interval',
      type: 'select',
      label: 'Interval',
      options: ['every_minute', 'every_5_minutes', 'every_15_minutes', 'every_30_minutes', 'hourly', 'daily', 'weekly', 'monthly', 'custom_cron'],
      default: 'daily',
      required: true
    },
    {
      name: 'cron_expression',
      type: 'string',
      label: 'Cron Expression',
      placeholder: '0 9 * * *',
      default: '0 9 * * *',
      description: 'Required when interval is custom_cron'
    },
    {
      name: 'timezone',
      type: 'select',
      label: 'Timezone',
      options: ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'],
      default: 'UTC'
    },
    {
      name: 'enabled',
      type: 'boolean',
      label: 'Enabled',
      default: true
    }
  ],
  executeFunction: 'ScheduleTriggerExecutor'
};

export const EmailTriggerNode: NodeTypeDefinition = {
  id: 'email_trigger',
  name: 'Email Trigger',
  category: NodeCategory.TRIGGER,
  subType: NodeSubType.EMAIL_TRIGGER,
  description: 'Trigger workflow when email is received',
  icon: '📧',
  color: '#F59E0B',
  inputs: [],
  outputs: [
    {
      id: 'email_data',
      name: 'Email Data',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    },
    {
      id: 'attachments',
      name: 'Attachments',
      type: 'output',
      position: 'bottom',
      dataType: 'array',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'email_address',
      type: 'string',
      label: 'Email Address',
      placeholder: 'trigger@example.com',
      required: true
    },
    {
      name: 'subject_filter',
      type: 'string',
      label: 'Subject Filter (Regex)',
      placeholder: '.*order.*',
      description: 'Optional regex pattern to filter by subject'
    },
    {
      name: 'sender_filter',
      type: 'string',
      label: 'Sender Filter',
      placeholder: '@company.com',
      description: 'Optional sender email pattern'
    },
    {
      name: 'include_attachments',
      type: 'boolean',
      label: 'Include Attachments',
      default: true
    }
  ],
  executeFunction: 'EmailTriggerExecutor'
};

export const FileTriggerNode: NodeTypeDefinition = {
  id: 'file_trigger',
  name: 'File Trigger',
  category: NodeCategory.TRIGGER,
  subType: NodeSubType.FILE_TRIGGER,
  description: 'Trigger workflow when file is added/modified',
  icon: '📁',
  color: '#06B6D4',
  inputs: [],
  outputs: [
    {
      id: 'file_data',
      name: 'File Data',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    },
    {
      id: 'file_content',
      name: 'File Content',
      type: 'output',
      position: 'bottom',
      dataType: 'string',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'watch_path',
      type: 'string',
      label: 'Watch Path',
      placeholder: '/uploads/*.csv',
      required: true
    },
    {
      name: 'trigger_on',
      type: 'select',
      label: 'Trigger On',
      options: ['created', 'modified', 'deleted', 'created_or_modified'],
      default: 'created'
    },
    {
      name: 'file_types',
      type: 'string',
      label: 'File Types',
      placeholder: 'csv,json,txt',
      description: 'Comma-separated file extensions'
    },
    {
      name: 'read_content',
      type: 'boolean',
      label: 'Read File Content',
      default: true
    }
  ],
  executeFunction: 'FileTriggerExecutor'
};

export const ManualTriggerNode: NodeTypeDefinition = {
  id: 'manual_trigger',
  name: 'Manual Trigger',
  category: NodeCategory.TRIGGER,
  subType: NodeSubType.WEBHOOK,
  description: 'Manually trigger workflow execution',
  icon: '▶️',
  color: '#EF4444',
  inputs: [],
  outputs: [
    {
      id: 'trigger_data',
      name: 'Trigger Data',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'input_data',
      type: 'json',
      label: 'Input Data',
      default: '{}',
      description: 'Optional JSON data to pass to workflow'
    },
    {
      name: 'confirm_execution',
      type: 'boolean',
      label: 'Confirm Before Execution',
      default: false
    }
  ],
  executeFunction: 'ManualTriggerExecutor'
};

export const TriggerNodes: NodeTypeDefinition[] = [
  WebhookTriggerNode,
  ScheduleTriggerNode,
  EmailTriggerNode,
  FileTriggerNode,
  ManualTriggerNode
];