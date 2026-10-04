import { Node, Edge } from 'reactflow';

export interface CustomModeConfig {
  slug: string;
  name: string;
  roleDefinition: string;
  customInstructions?: string;
  groups: string[];
  source?: string;
}

export interface MultiModeConfig {
  modes: CustomModeConfig[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  author?: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  nodes: Node[];
  edges: Edge[];
  thumbnail?: string;
  usageCount?: number;
  rating?: number;
  featured?: boolean;
  customModeOutput?: CustomModeConfig | MultiModeConfig;
}

export enum TemplateCategory {
  AI_CONTENT = 'AI & Content',
  DATA_PROCESSING = 'Data Processing',
  AUTOMATION = 'Automation',
  INTEGRATION = 'Integration',
  ANALYTICS = 'Analytics',
  COMMUNICATION = 'Communication',
  UTILITY = 'Utility',
  BUSINESS = 'Business Process'
}

export interface TemplateFilter {
  category?: TemplateCategory;
  difficulty?: string;
  tags?: string[];
  searchQuery?: string;
  featured?: boolean;
}

export interface TemplateStats {
  totalTemplates: number;
  categoryCounts: Record<TemplateCategory, number>;
  popularTags: Array<{ tag: string; count: number }>;
  averageRating: number;
}