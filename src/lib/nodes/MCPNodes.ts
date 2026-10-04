import { NodeCategory, NodeSubType, NodeTypeDefinition } from '../../types/nodeTypes';

export const MCPNodes: NodeTypeDefinition[] = [
  {
    id: 'mcp_call',
    name: 'MCP Call',
    category: NodeCategory.ACTION,
    subType: NodeSubType.MCP_CALL, // This will need to be added to NodeSubType enum
    description: 'Call a tool or resource on the MCP server',
    icon: '🔌',
    color: '#9333EA',
    inputs: [
      {
        id: 'input_data',
        name: 'Input Data',
        type: 'input',
        position: 'left',
        dataType: 'object',
        required: false,
        multiple: false,
      },
    ],
    outputs: [
      {
        id: 'output_data',
        name: 'Output Data',
        type: 'output',
        position: 'right',
        dataType: 'object',
        required: false,
        multiple: true,
      },
      {
        id: 'error_output',
        name: 'Error',
        type: 'output',
        position: 'bottom',
        dataType: 'object',
        required: false,
        multiple: false,
      },
    ],
    properties: [
      {
        name: 'tool_name',
        type: 'string',
        label: 'Tool Name',
        placeholder: 'e.g., search_web, generate_image',
        required: true,
      },
      {
        name: 'parameters',
        type: 'json',
        label: 'Parameters (JSON)',
        placeholder: '{}',
        default: '{}',
        required: false,
      },
    ],
  },
];