export enum NodeCategory {
  TRIGGER = 'trigger',
  ACTION = 'action', 
  CONDITION = 'condition',
  AI = 'ai',
  DATA = 'data',
  UTILITY = 'utility'
}

export enum NodeSubType {
  // Triggers
  WEBHOOK = 'webhook',
  SCHEDULE = 'schedule',
  EMAIL_TRIGGER = 'email_trigger',
  FILE_TRIGGER = 'file_trigger',
  
  // Actions  
  HTTP_REQUEST = 'http_request',
  EMAIL_SEND = 'email_send',
  DATABASE = 'database',
  FILE_OPERATION = 'file_operation',
  MCP_CALL = 'mcp_call',
  
  // Conditions
  IF_CONDITION = 'if_condition',
  SWITCH = 'switch',
  FILTER = 'filter',
  
  // AI
  LLM_CHAT = 'llm_chat',
  TEXT_CLASSIFIER = 'text_classifier',
  IMAGE_ANALYZER = 'image_analyzer',
  
  // Data
  JSON_PARSER = 'json_parser',
  CSV_PARSER = 'csv_parser',
  DATA_TRANSFORMER = 'data_transformer',
  
  // Utility
  DELAY = 'delay',
  CODE = 'code',
  MERGE = 'merge'
}

export interface HandleDefinition {
  id: string
  name: string
  type: 'input' | 'output'
  position: 'top' | 'bottom' | 'left' | 'right'
  dataType: 'any' | 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  multiple: boolean // Allow multiple connections
}

export interface PropertyDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'json' | 'condition_builder'
  label?: string
  placeholder?: string
  default?: any
  options?: string[]
  min?: number
  max?: number
  step?: number
  required?: boolean
  description?: string
}

export interface NodeTypeDefinition {
  id: string
  name: string
  category: NodeCategory
  subType: NodeSubType
  description: string
  icon: string
  color: string
  inputs: HandleDefinition[]
  outputs: HandleDefinition[]
  properties: PropertyDefinition[]
  executeFunction?: string // Reference to execution logic
}