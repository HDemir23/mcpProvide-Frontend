'use client'

import React, { useState, useEffect } from 'react';
import { User, UserCursor, LiveComment } from '../../types/collaboration';
import { collaborationManager } from '../../lib/collaboration/CollaborationManager';
import LiveComments from './LiveComments';
import ParticipantList from './ParticipantList';
import styles from './CollaborationPanel.module.scss';

interface CollaborationPanelProps {
  workflowId: string;
}

export default function CollaborationPanel({ workflowId }: CollaborationPanelProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<User[]>([]);
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const joinWorkflow = async () => {
      try {
        await collaborationManager.joinWorkflow(workflowId);
      } catch (error) {
        console.error('Failed to join collaboration session:', error);
      }
    };

    joinWorkflow();

    // Set up event listeners
    const handleConnected = () => {
      setIsConnected(true);
      updateState();
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setParticipants([]);
      setComments([]);
    };

    const handleUserJoined = (user: User) => {
      updateState();
    };

    const handleCommentAdded = (comment: LiveComment) => {
      setComments(prev => [...prev, comment]);
    };

    const updateState = () => {
      const state = collaborationManager.getState();
      setParticipants(state.participants);
      setComments(state.comments);
    };

    collaborationManager.on('connected', handleConnected);
    collaborationManager.on('disconnected', handleDisconnected);
    collaborationManager.on('userJoined', handleUserJoined);
    collaborationManager.on('commentAdded', handleCommentAdded);

    return () => {
      collaborationManager.off('connected', handleConnected);
      collaborationManager.off('disconnected', handleDisconnected);
      collaborationManager.off('userJoined', handleUserJoined);
      collaborationManager.off('commentAdded', handleCommentAdded);
      collaborationManager.leaveWorkflow();
    };
  }, [workflowId]);

  const handleAddComment = (position: { x: number; y: number }, content: string) => {
    try {
      const comment = collaborationManager.addComment(position, content);
      setComments(prev => [...prev, comment]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const getConnectionStatus = () => {
    if (!isConnected) return { icon: '🔴', text: 'Disconnected', color: '#EF4444' };
    if (participants.length <= 1) return { icon: '🟡', text: 'Solo', color: '#F59E0B' };
    return { icon: '🟢', text: 'Live', color: '#10B981' };
  };

  const status = getConnectionStatus();
  const otherParticipants = participants.filter(p => p.id !== collaborationManager.getState().currentUser?.id);

  return (
    <div className={`${styles.collaborationPanel} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div className={styles.statusIndicator}>
          <span className={styles.statusIcon} style={{ color: status.color }}>
            {status.icon}
          </span>
          <span className={styles.statusText}>{status.text}</span>
        </div>
        
        <div className={styles.participantCount}>
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </div>
        
        <button className={styles.expandButton}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h4>Participants</h4>
            <ParticipantList participants={participants} />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4>Comments</h4>
              <button
                className={styles.toggleCommentsButton}
                onClick={() => setShowComments(!showComments)}
              >
                {showComments ? 'Hide' : 'Show'} ({comments.length})
              </button>
            </div>
            
            {showComments && (
              <LiveComments
                comments={comments}
                onAddComment={handleAddComment}
                onReplyToComment={(commentId, content) => {
                  collaborationManager.replyToComment(commentId, content);
                }}
                onResolveComment={(commentId) => {
                  collaborationManager.resolveComment(commentId);
                }}
              />
            )}
          </div>

          <div className={styles.section}>
            <h4>Session Info</h4>
            <div className={styles.sessionInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status:</span>
                <span className={styles.infoValue}>{status.text}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Session ID:</span>
                <span className={styles.infoValue}>
                  {collaborationManager.getState().sessionId?.slice(-8) || 'None'}
                </span>
              </div>
              {otherParticipants.length > 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Collaborators:</span>
                  <div className={styles.collaboratorList}>
                    {otherParticipants.map(participant => (
                      <div key={participant.id} className={styles.collaborator}>
                        <div 
                          className={styles.collaboratorAvatar}
                          style={{ backgroundColor: participant.color }}
                        >
                          {participant.name.charAt(0)}
                        </div>
                        <span className={styles.collaboratorName}>
                          {participant.name}
                        </span>
                        {participant.isOnline && (
                          <span className={styles.onlineIndicator}>🟢</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}