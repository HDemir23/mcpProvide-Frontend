export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface UserCursor {
  userId: string;
  position: { x: number; y: number };
  timestamp: Date;
}

export interface UserSelection {
  userId: string;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  timestamp: Date;
}

export interface CollaborationEvent {
  id: string;
  type: 'user_joined' | 'user_left' | 'cursor_moved' | 'selection_changed' | 'node_added' | 'node_removed' | 'node_modified' | 'edge_added' | 'edge_removed' | 'workflow_saved';
  userId: string;
  timestamp: Date;
  data: any;
  workflowId: string;
}

export interface WorkflowSession {
  id: string;
  workflowId: string;
  participants: User[];
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface LiveComment {
  id: string;
  userId: string;
  workflowId: string;
  position: { x: number; y: number };
  content: string;
  timestamp: Date;
  isResolved: boolean;
  replies: CommentReply[];
}

export interface CommentReply {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface CollaborationState {
  currentUser: User | null;
  participants: User[];
  cursors: Map<string, UserCursor>;
  selections: Map<string, UserSelection>;
  comments: LiveComment[];
  isConnected: boolean;
  sessionId: string | null;
}