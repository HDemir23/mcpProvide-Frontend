import { NodeCategory, NodeSubType, NodeTypeDefinition } from '../../types/nodeTypes';

export const IfConditionNode: NodeTypeDefinition = {
  id: 'if_condition',
  name: 'IF',
  category: NodeCategory.CONDITION,
  subType: NodeSubType.IF_CONDITION,
  description: 'Route data based on conditions',
  icon: '❓',
  color: '#EF4444',
  inputs: [
    {
      id: 'condition_input',
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
      id: 'true_output',
      name: 'True',
      type: 'output',
      position: 'top',
      dataType: 'any',
      required: false,
      multiple: true
    },
    {
      id: 'false_output',
      name: 'False',
      type: 'output',
      position: 'bottom',
      dataType: 'any',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'conditions',
      type: 'condition_builder',
      label: 'Conditions',
      default: [],
      required: true,
      description: 'Define conditions to evaluate'
    },
    {
      name: 'operator',
      type: 'select',
      label: 'Logic Operator',
      options: ['AND', 'OR'],
      default: 'AND',
      description: 'How to combine multiple conditions'
    },
    {
      name: 'strict_mode',
      type: 'boolean',
      label: 'Strict Mode',
      default: false,
      description: 'Use strict equality comparison'
    }
  ],
  executeFunction: 'IfConditionExecutor'
};

export const SwitchNode: NodeTypeDefinition = {
  id: 'switch',
  name: 'Switch',
  category: NodeCategory.CONDITION,
  subType: NodeSubType.SWITCH,
  description: 'Route data to different paths based on value',
  icon: '🔀',
  color: '#F97316',
  inputs: [
    {
      id: 'switch_input',
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
      id: 'case_1',
      name: 'Case 1',
      type: 'output',
      position: 'top',
      dataType: 'any',
      required: false,
      multiple: true
    },
    {
      id: 'case_2',
      name: 'Case 2',
      type: 'output',
      position: 'right',
      dataType: 'any',
      required: false,
      multiple: true
    },
    {
      id: 'case_3',
      name: 'Case 3',
      type: 'output',
      position: 'bottom',
      dataType: 'any',
      required: false,
      multiple: true
    },
    {
      id: 'default',
      name: 'Default',
      type: 'output',
      position: 'left',
      dataType: 'any',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'switch_property',
      type: 'string',
      label: 'Property Path',
      placeholder: 'property.path.to.check',
      required: true,
      description: 'Dot notation path to property to switch on'
    },
    {
      name: 'case_1_value',
      type: 'string',
      label: 'Case 1 Value',
      placeholder: 'Value for case 1',
      description: 'Value that routes to Case 1 output'
    },
    {
      name: 'case_2_value',
      type: 'string',
      label: 'Case 2 Value',
      placeholder: 'Value for case 2',
      description: 'Value that routes to Case 2 output'
    },
    {
      name: 'case_3_value',
      type: 'string',
      label: 'Case 3 Value',
      placeholder: 'Value for case 3',
      description: 'Value that routes to Case 3 output'
    },
    {
      name: 'case_sensitive',
      type: 'boolean',
      label: 'Case Sensitive',
      default: true,
      description: 'Whether string comparison is case sensitive'
    }
  ],
  executeFunction: 'SwitchExecutor'
};

export const FilterNode: NodeTypeDefinition = {
  id: 'filter',
  name: 'Filter',
  category: NodeCategory.CONDITION,
  subType: NodeSubType.FILTER,
  description: 'Filter data based on conditions',
  icon: '🔍',
  color: '#8B5CF6',
  inputs: [
    {
      id: 'filter_input',
      name: 'Input Data',
      type: 'input',
      position: 'left',
      dataType: 'array',
      required: true,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'filtered_output',
      name: 'Filtered Data',
      type: 'output',
      position: 'right',
      dataType: 'array',
      required: false,
      multiple: true
    },
    {
      id: 'rejected_output',
      name: 'Rejected Data',
      type: 'output',
      position: 'bottom',
      dataType: 'array',
      required: false,
      multiple: false
    }
  ],
  properties: [
    {
      name: 'filter_conditions',
      type: 'condition_builder',
      label: 'Filter Conditions',
      default: [],
      required: true,
      description: 'Conditions to filter array items'
    },
    {
      name: 'keep_rejected',
      type: 'boolean',
      label: 'Keep Rejected Items',
      default: false,
      description: 'Output rejected items to separate output'
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Limit Results',
      min: 0,
      placeholder: 'Max items to return (0 = no limit)',
      description: 'Maximum number of items to return'
    }
  ],
  executeFunction: 'FilterExecutor'
};

export const CompareNode: NodeTypeDefinition = {
  id: 'compare',
  name: 'Compare',
  category: NodeCategory.CONDITION,
  subType: NodeSubType.IF_CONDITION,
  description: 'Compare two values',
  icon: '⚖️',
  color: '#06B6D4',
  inputs: [
    {
      id: 'value_a',
      name: 'Value A',
      type: 'input',
      position: 'left',
      dataType: 'any',
      required: true,
      multiple: false
    },
    {
      id: 'value_b',
      name: 'Value B',
      type: 'input',
      position: 'top',
      dataType: 'any',
      required: true,
      multiple: false
    }
  ],
  outputs: [
    {
      id: 'equal_output',
      name: 'Equal',
      type: 'output',
      position: 'right',
      dataType: 'any',
      required: false,
      multiple: true
    },
    {
      id: 'not_equal_output',
      name: 'Not Equal',
      type: 'output',
      position: 'bottom',
      dataType: 'any',
      required: false,
      multiple: true
    }
  ],
  properties: [
    {
      name: 'comparison_type',
      type: 'select',
      label: 'Comparison Type',
      options: ['equal', 'not_equal', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'contains', 'starts_with', 'ends_with'],
      default: 'equal',
      required: true,
      description: 'Type of comparison to perform'
    },
    {
      name: 'case_sensitive',
      type: 'boolean',
      label: 'Case Sensitive',
      default: true,
      description: 'Case sensitive string comparison'
    }
  ],
  executeFunction: 'CompareExecutor'
};

export const ConditionNodes: NodeTypeDefinition[] = [
  IfConditionNode,
  SwitchNode,
  FilterNode,
  CompareNode
];