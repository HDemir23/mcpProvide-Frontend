import { NodeCategory, NodeSubType, NodeTypeDefinition } from '../../types/nodeTypes';

export const JSONParserNode: NodeTypeDefinition = {
  id: 'json_parser',
  name: 'JSON Parser',
  category: NodeCategory.DATA,
  subType: NodeSubType.JSON_PARSER,
  description: 'Parse and manipulate JSON data',
  icon: '📄',
  color: '#0891B2',
  inputs: [
    {
      id: 'json_input',
      name: 'JSON Data',
      type: 'input',
      position: 'left',
      dataType: 'any',
      required: true,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'parsed_output',
      name: 'Parsed Data',
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
      name: 'operation',
      type: 'select',
      options: ['parse', 'stringify', 'extract', 'validate'],
      default: 'parse'
    },
    {
      name: 'json_path',
      type: 'string',
      placeholder: '$.data.items[0].name'
    },
    {
      name: 'default_value',
      type: 'string',
      placeholder: 'Default value if path not found'
    }
  ],
  executeFunction: 'json_parser_executor'
};

export const CSVParserNode: NodeTypeDefinition = {
  id: 'csv_parser',
  name: 'CSV Parser',
  category: NodeCategory.DATA,
  subType: NodeSubType.CSV_PARSER,
  description: 'Parse and manipulate CSV data',
  icon: '📊',
  color: '#059669',
  inputs: [
    {
      id: 'csv_input',
      name: 'CSV Data',
      type: 'input',
      position: 'left',
      dataType: 'string',
      required: true,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'parsed_csv',
      name: 'Parsed CSV',
      type: 'output',
      position: 'right',
      dataType: 'array',
      required: false,
      multiple: true
    },
    {
      id: 'headers',
      name: 'Headers',
      type: 'output',
      position: 'top',
      dataType: 'array',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'delimiter',
      type: 'string',
      default: ',',
      placeholder: 'Field delimiter'
    },
    {
      name: 'has_header',
      type: 'boolean',
      default: true
    },
    {
      name: 'quote_char',
      type: 'string',
      default: '"',
      placeholder: 'Quote character'
    },
    {
      name: 'skip_empty_lines',
      type: 'boolean',
      default: true
    }
  ],
  executeFunction: 'csv_parser_executor'
};

export const DataTransformerNode: NodeTypeDefinition = {
  id: 'data_transformer',
  name: 'Data Transformer',
  category: NodeCategory.DATA,
  subType: NodeSubType.DATA_TRANSFORMER,
  description: 'Transform and manipulate data structures',
  icon: '🔄',
  color: '#7C3AED',
  inputs: [
    {
      id: 'data_input',
      name: 'Input Data',
      type: 'input',
      position: 'left',
      dataType: 'any',
      required: true,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'transformed_data',
      name: 'Transformed Data',
      type: 'output',
      position: 'right',
      dataType: 'any',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'transformation_type',
      type: 'select',
      options: ['map', 'filter', 'reduce', 'sort', 'group', 'flatten', 'custom'],
      default: 'map'
    },
    {
      name: 'transformation_code',
      type: 'textarea',
      placeholder: 'JavaScript transformation code...',
      default: '// Transform each item\nreturn item => ({ ...item, processed: true })'
    },
    {
      name: 'sort_field',
      type: 'string',
      placeholder: 'Field to sort by'
    },
    {
      name: 'sort_order',
      type: 'select',
      options: ['asc', 'desc'],
      default: 'asc'
    }
  ],
  executeFunction: 'data_transformer_executor'
};

export const DataNodes: NodeTypeDefinition[] = [
  JSONParserNode,
  CSVParserNode,
  DataTransformerNode
];