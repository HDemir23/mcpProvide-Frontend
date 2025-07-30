import { AgentType } from '@/types'

export const agentTypes: AgentType[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most capable OpenAI model',
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    icon: '🤖',
    maxTokens: 128000,
    costPer1K: 10
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    icon: '⚡',
    maxTokens: 16385,
    costPer1K: 1
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s advanced AI model',
    provider: 'google',
    model: 'gemini-pro',
    icon: '💎',
    maxTokens: 32768,
    costPer1K: 0.5
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and cost-effective',
    provider: 'anthropic',  
    model: 'claude-3-haiku-20240307',
    icon: '🌸',
    maxTokens: 200000,
    costPer1K: 0.25
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and speed',
    provider: 'anthropic',
    model: 'claude-3-sonnet-20240229',
    icon: '🎵',
    maxTokens: 200000,
    costPer1K: 3
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most intelligent model',
    provider: 'anthropic',
    model: 'claude-3-opus-20240229',
    icon: '🎭',
    maxTokens: 200000,
    costPer1K: 15
  }
]