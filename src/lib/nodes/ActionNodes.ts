import { NodeCategory, NodeSubType, NodeTypeDefinition } from '../../types/nodeTypes';

export const HTTPRequestNode: NodeTypeDefinition = {
  id: 'http_request',
  name: 'HTTP Request',
  category: NodeCategory.ACTION,
  subType: NodeSubType.HTTP_REQUEST,
  description: 'Make HTTP requests to APIs',
  icon: '🌐',
  color: '#3B82F6',
  inputs: [
    {
      id: 'trigger_input',
      name: 'Input Data',
      type: 'input',
      position: 'left',
      dataType: 'any',
      required: false,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'response_data',
      name: 'Response',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    },
    {
      id: 'error_output',
      name: 'Error',
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
      default: 'GET',
      required: true
    },
    {
      name: 'url',
      type: 'string',
      label: 'URL',
      placeholder: 'https://api.example.com/data',
      required: true
    },
    {
      name: 'headers',
      type: 'json',
      label: 'Headers',
      default: '{}',
      description: 'HTTP headers as JSON object'
    },
    {
      name: 'body',
      type: 'json',
      label: 'Request Body',
      default: '{}',
      description: 'Request body for POST/PUT requests'
    },
    {
      name: 'timeout',
      type: 'number',
      label: 'Timeout (ms)',
      default: 30000,
      min: 1000,
      max: 300000,
      description: 'Request timeout in milliseconds'
    }
  ],
  executeFunction: 'HTTPRequestExecutor'
};

export const EmailSendNode: NodeTypeDefinition = {
  id: 'email_send',
  name: 'Send Email',
  category: NodeCategory.ACTION,
  subType: NodeSubType.EMAIL_SEND,
  description: 'Send email messages',
  icon: '📤',
  color: '#DC2626',
  inputs: [
    {
      id: 'email_input',
      name: 'Email Data',
      type: 'input',
      position: 'left',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'send_result',
      name: 'Send Result',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'to',
      type: 'string',
      label: 'To',
      placeholder: 'recipient@example.com',
      required: true,
      description: 'Comma-separated email addresses'
    },
    {
      name: 'cc',
      type: 'string',
      label: 'CC',
      placeholder: 'cc@example.com',
      description: 'Carbon copy recipients'
    },
    {
      name: 'bcc',
      type: 'string',
      label: 'BCC',
      placeholder: 'bcc@example.com',
      description: 'Blind carbon copy recipients'
    },
    {
      name: 'subject',
      type: 'string',
      label: 'Subject',
      placeholder: 'Email subject',
      required: true
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Message Body',
      placeholder: 'Email content...',
      required: true
    },
    {
      name: 'html',
      type: 'boolean',
      label: 'HTML Format',
      default: false,
      description: 'Send as HTML email'
    },
    {
      name: 'attachments',
      type: 'json',
      label: 'Attachments',
      default: '[]',
      description: 'Array of file paths to attach'
    }
  ],
  executeFunction: 'EmailSendExecutor'
};

export const DatabaseNode: NodeTypeDefinition = {
  id: 'database',
  name: 'Database',
  category: NodeCategory.ACTION,
  subType: NodeSubType.DATABASE,
  description: 'Execute database queries',
  icon: '🗄️',
  color: '#7C3AED',
  inputs: [
    {
      id: 'query_input',
      name: 'Query Data',
      type: 'input',
      position: 'left',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'query_result',
      name: 'Query Result',
      type: 'output',
      position: 'right',
      dataType: 'array',
      required: false,
      multiple: true
    },
    {
      id: 'error_output',
      name: 'Error',
      type: 'output',
      position: 'bottom',
      dataType: 'object',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'connection_string',
      type: 'string',
      label: 'Connection String',
      placeholder: 'postgresql://user:pass@localhost:5432/db',
      required: true,
      description: 'Database connection string'
    },
    {
      name: 'query',
      type: 'textarea',
      label: 'SQL Query',
      placeholder: 'SELECT * FROM users WHERE id = $1',
      required: true,
      description: 'SQL query to execute'
    },
    {
      name: 'parameters',
      type: 'json',
      label: 'Query Parameters',
      default: '[]',
      description: 'Parameters for parameterized queries'
    },
    {
      name: 'transaction',
      type: 'boolean',
      label: 'Use Transaction',
      default: false,
      description: 'Execute query within a transaction'
    }
  ],
  executeFunction: 'DatabaseExecutor'
};

export const FileOperationNode: NodeTypeDefinition = {
  id: 'file_operation',
  name: 'File Operation',
  category: NodeCategory.ACTION,
  subType: NodeSubType.FILE_OPERATION,
  description: 'Read, write, or manipulate files',
  icon: '📄',
  color: '#059669',
  inputs: [
    {
      id: 'file_input',
      name: 'File Data',
      type: 'input',
      position: 'left',
      dataType: 'any',
      required: false,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'file_output',
      name: 'File Result',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'operation',
      type: 'select',
      label: 'Operation',
      options: ['read', 'write', 'append', 'delete', 'copy', 'move'],
      default: 'read',
      required: true
    },
    {
      name: 'file_path',
      type: 'string',
      label: 'File Path',
      placeholder: '/path/to/file.txt',
      required: true,
      description: 'Path to the file'
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Content',
      placeholder: 'File content (for write/append operations)',
      description: 'Content to write/append to file'
    },
    {
      name: 'encoding',
      type: 'select',
      label: 'Encoding',
      options: ['utf8', 'ascii', 'base64', 'binary'],
      default: 'utf8',
      description: 'File encoding'
    },
    {
      name: 'destination_path',
      type: 'string',
      label: 'Destination Path',
      placeholder: '/path/to/destination.txt',
      description: 'Destination path for copy/move operations'
    }
  ],
  executeFunction: 'FileOperationExecutor'
};

export const ActionNodes: NodeTypeDefinition[] = [
  HTTPRequestNode,
  EmailSendNode,
  DatabaseNode,
  FileOperationNode
];