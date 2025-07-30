import { Node, Edge } from 'reactflow';

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