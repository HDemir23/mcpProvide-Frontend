import { User, UserCursor, UserSelection, CollaborationEvent, WorkflowSession, LiveComment, CollaborationState } from '../../types/collaboration';

export class CollaborationManager {
  private websocket: WebSocket | null = null;
  private workflowId: string | null = null;
  private currentUser: User | null = null;
  private state: CollaborationState = {
    currentUser: null,
    participants: [],
    cursors: new Map(),
    selections: new Map(),
    comments: [],
    isConnected: false,
    sessionId: null
  };
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeCurrentUser();
  }

  /**
   * Join a workflow collaboration session
   */
  async joinWorkflow(workflowId: string): Promise<void> {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.leaveWorkflow();
    }

    this.workflowId = workflowId;
    
    try {
      // In a real implementation, this would connect to your WebSocket server
      // For now, we'll simulate the connection
      await this.simulateConnection(workflowId);
    } catch (error) {
      console.error('Failed to join workflow:', error);
      throw error;
    }
  }

  /**
   * Leave the current workflow session
   */
  leaveWorkflow(): void {
    if (this.websocket) {
      this.sendEvent({
        type: 'user_left',
        data: { userId: this.currentUser?.id }
      });
      
      this.websocket.close();
      this.websocket = null;
    }

    this.state = {
      currentUser: this.currentUser,
      participants: [],
      cursors: new Map(),
      selections: new Map(),
      comments: [],
      isConnected: false,
      sessionId: null
    };

    this.workflowId = null;
    this.emit('disconnected');
  }

  /**
   * Update user cursor position
   */
  updateCursor(position: { x: number; y: number }): void {
    if (!this.currentUser || !this.state.isConnected) return;

    const cursor: UserCursor = {
      userId: this.currentUser.id,
      position,
      timestamp: new Date()
    };

    this.sendEvent({
      type: 'cursor_moved',
      data: cursor
    });
  }

  /**
   * Update user selection
   */
  updateSelection(selectedNodeIds: string[], selectedEdgeIds: string[]): void {
    if (!this.currentUser || !this.state.isConnected) return;

    const selection: UserSelection = {
      userId: this.currentUser.id,
      selectedNodeIds,
      selectedEdgeIds,
      timestamp: new Date()
    };

    this.state.selections.set(this.currentUser.id, selection);

    this.sendEvent({
      type: 'selection_changed',
      data: selection
    });

    this.emit('selectionChanged', selection);
  }

  /**
   * Add a live comment
   */
  addComment(position: { x: number; y: number }, content: string): LiveComment {
    if (!this.currentUser || !this.workflowId) {
      throw new Error('Not connected to a workflow session');
    }

    const comment: LiveComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.id,
      workflowId: this.workflowId,
      position,
      content,
      timestamp: new Date(),
      isResolved: false,
      replies: []
    };

    this.state.comments.push(comment);
    
    this.sendEvent({
      type: 'node_added', // Reusing event type for comments
      data: { comment }
    });

    this.emit('commentAdded', comment);
    return comment;
  }

  /**
   * Reply to a comment
   */
  replyToComment(commentId: string, content: string): void {
    if (!this.currentUser) return;

    const comment = this.state.comments.find(c => c.id === commentId);
    if (!comment) return;

    const reply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.id,
      content,
      timestamp: new Date()
    };

    comment.replies.push(reply);
    
    this.sendEvent({
      type: 'node_modified',
      data: { commentId, reply }
    });

    this.emit('commentReplied', { comment, reply });
  }

  /**
   * Resolve a comment
   */
  resolveComment(commentId: string): void {
    const comment = this.state.comments.find(c => c.id === commentId);
    if (!comment) return;

    comment.isResolved = true;
    
    this.sendEvent({
      type: 'node_modified',
      data: { commentId, resolved: true }
    });

    this.emit('commentResolved', comment);
  }

  /**
   * Get current collaboration state
   */
  getState(): CollaborationState {
    return { ...this.state };
  }

  /**
   * Get participants excluding current user
   */
  getOtherParticipants(): User[] {
    return this.state.participants.filter(p => p.id !== this.currentUser?.id);
  }

  /**
   * Get user cursors excluding current user
   */
  getOtherCursors(): UserCursor[] {
    const cursors: UserCursor[] = [];
    this.state.cursors.forEach((cursor, userId) => {
      if (userId !== this.currentUser?.id) {
        cursors.push(cursor);
      }
    });
    return cursors;
  }

  /**
   * Get user selections excluding current user
   */
  getOtherSelections(): UserSelection[] {
    const selections: UserSelection[] = [];
    this.state.selections.forEach((selection, userId) => {
      if (userId !== this.currentUser?.id) {
        selections.push(selection);
      }
    });
    return selections;
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Private methods

  private initializeCurrentUser(): void {
    // In a real app, this would come from authentication
    this.currentUser = {
      id: `user-${Date.now()}`,
      name: 'Current User',
      email: 'user@example.com',
      color: this.generateUserColor(),
      isOnline: true
    };
  }

  private generateUserColor(): string {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private async simulateConnection(workflowId: string): Promise<void> {
    // Simulate WebSocket connection
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.state.isConnected = true;
    this.state.sessionId = `session-${workflowId}-${Date.now()}`;
    
    // Add current user to participants
    if (this.currentUser) {
      this.state.participants = [this.currentUser];
    }

    // Simulate other users joining occasionally
    this.simulateOtherUsers();
    
    this.emit('connected', { sessionId: this.state.sessionId });
  }

  private simulateOtherUsers(): void {
    // Simulate 1-3 other users joining
    const userCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < userCount; i++) {
      setTimeout(() => {
        const user: User = {
          id: `user-${Date.now()}-${i}`,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          color: this.generateUserColor(),
          isOnline: true
        };

        this.state.participants.push(user);
        this.emit('userJoined', user);

        // Simulate cursor movements
        this.simulateUserCursor(user);
      }, Math.random() * 5000);
    }
  }

  private simulateUserCursor(user: User): void {
    const moveCursor = () => {
      if (!this.state.isConnected) return;

      const cursor: UserCursor = {
        userId: user.id,
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600
        },
        timestamp: new Date()
      };

      this.state.cursors.set(user.id, cursor);
      this.emit('cursorMoved', cursor);

      // Schedule next movement
      setTimeout(moveCursor, 2000 + Math.random() * 3000);
    };

    setTimeout(moveCursor, Math.random() * 2000);
  }

  private sendEvent(eventData: Partial<CollaborationEvent>): void {
    if (!this.state.isConnected || !this.workflowId || !this.currentUser) return;

    const event: CollaborationEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.id,
      workflowId: this.workflowId,
      timestamp: new Date(),
      ...eventData
    } as CollaborationEvent;

    // In a real implementation, this would send via WebSocket
    console.log('Sending collaboration event:', event);
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

// Singleton instance
export const collaborationManager = new CollaborationManager();