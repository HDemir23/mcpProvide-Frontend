// Custom Mode Configuration Generator for Workflow Templates
// Generates YAML output for custom modes based on workflow templates

export interface CustomMode {
  slug: string;
  name: string;
  roleDefinition: string;
  customInstructions?: string;
  groups: string[];
  source?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: any[];
  connections: any[];
  tags: string[];
  difficulty: string;
  estimatedTime: string;
}


// Generate workflow summary for documentation
export function generateWorkflowSummary(template: WorkflowTemplate): string {
  const aiCount = template.nodes.filter(n => n.data.nodeType.category === 'ai').length;
  const triggerCount = template.nodes.filter(n => n.data.nodeType.category === 'trigger').length;
  const utilityCount = template.nodes.filter(n => n.data.nodeType.category === 'utility').length;
  
  return `# ${template.name}

**Category:** ${template.category}
**Difficulty:** ${template.difficulty}
**Estimated Time:** ${template.estimatedTime}

## Description
${template.description}

## Workflow Composition
- **AI Nodes:** ${aiCount}
- **Trigger Nodes:** ${triggerCount}  
- **Utility Nodes:** ${utilityCount}
- **Total Connections:** ${template.connections.length}

## Tags
${template.tags.map(tag => `\`${tag}\``).join(', ')}

## Generated Custom Modes
This workflow generates ${aiCount} custom mode${aiCount !== 1 ? 's' : ''} for AI coordination and task execution.
`;
}