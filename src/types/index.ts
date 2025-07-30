export interface AgentType {
  id: string
  name: string
  description: string
  provider: 'openai' | 'google' | 'anthropic' | 'meta'
  model: string
  icon: string
  maxTokens: number
  costPer1K: number
}

// Legacy node data format
interface LegacyNodeData {
  agentType: AgentType
  config: Record<string, any>
}

// Dynamic node data format
interface DynamicNodeData {
  nodeType: any // NodeTypeDefinition from nodeTypes.ts
  properties: Record<string, any>
  executionState: 'idle' | 'running' | 'success' | 'error'
}

export interface Node {
  id: string
  type: string
  position: { x: number; y: number }
  data: any // Temporarily use any to support both legacy and dynamic formats
}

export interface Connection {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}