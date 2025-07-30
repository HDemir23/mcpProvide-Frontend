import { NodeCategory, NodeSubType, NodeTypeDefinition } from '../../types/nodeTypes';

export const DelayNode: NodeTypeDefinition = {
  id: 'delay',
  name: 'Delay',
  category: NodeCategory.UTILITY,
  subType: NodeSubType.DELAY,
  description: 'Add delay before continuing workflow',
  icon: '⏱️',
  color: '#6B7280',
  inputs: [
    {
      id: 'delay_input',
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
      id: 'delay_output',
      name: 'Output Data',
      type: 'output',
      position: 'right',
      dataType: 'any',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'delay_amount',
      type: 'number',
      default: 1000,
      min: 100,
      max: 300000,
      placeholder: 'Delay in milliseconds'
    },
    {
      name: 'delay_unit',
      type: 'select',
      options: ['milliseconds', 'seconds', 'minutes'],
      default: 'seconds'
    }
  ],
  executeFunction: 'delay_executor'
};

export const CodeNode: NodeTypeDefinition = {
  id: 'code',
  name: 'Code',
  category: NodeCategory.UTILITY,
  subType: NodeSubType.CODE,
  description: 'Execute custom JavaScript code',
  icon: '💻',
  color: '#1F2937',
  inputs: [
    {
      id: 'code_input',
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
      id: 'code_output',
      name: 'Output Data',
      type: 'output',
      position: 'right',
      dataType: 'any',
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
      name: 'code',
      type: 'textarea',
      placeholder: '// Your JavaScript code here\nreturn inputData.map(item => ({ ...item, processed: true }))',
      default: '// Process the input data\nreturn inputData'
    },
    {
      name: 'timeout',
      type: 'number',
      default: 5000,
      min: 1000,
      max: 30000,
      placeholder: 'Execution timeout in ms'
    }
  ],
  executeFunction: 'code_executor'
};

export const MergeNode: NodeTypeDefinition = {
  id: 'merge',
  name: 'Merge',
  category: NodeCategory.UTILITY,
  subType: NodeSubType.MERGE,
  description: 'Merge data from multiple inputs',
  icon: '🔗',
  color: '#374151',
  inputs: [
    {
      id: 'input_1',
      name: 'Input 1',
      type: 'input',
      position: 'top',
      dataType: 'any',
      required: false,
      multiple: false
    },
    {
      id: 'input_2',
      name: 'Input 2',
      type: 'input',
      position: 'left',
      dataType: 'any',
      required: false,
      multiple: false
    },
    {
      id: 'input_3',
      name: 'Input 3',
      type: 'input',
      position: 'bottom',
      dataType: 'any',
      required: false,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'merged_output',
      name: 'Merged Data',
      type: 'output',
      position: 'right',
      dataType: 'object',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'merge_mode',
      type: 'select',
      options: ['combine', 'array', 'first_non_empty', 'wait_all'],
      default: 'combine'
    },
    {
      name: 'timeout',
      type: 'number',
      default: 10000,
      min: 1000,
      max: 60000,
      placeholder: 'Wait timeout in ms'
    }
  ],
  executeFunction: 'merge_executor'
};

export const UtilityNodes: NodeTypeDefinition[] = [
  DelayNode,
  CodeNode,
  MergeNode
];