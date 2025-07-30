'use client'

import React, { useEffect, useState } from 'react';
import { UserCursor, User } from '../../types/collaboration';
import { collaborationManager } from '../../lib/collaboration/CollaborationManager';
import styles from './UserCursors.module.scss';

interface UserCursorsProps {
  containerRef: React.RefObject<HTMLElement>;
}

export default function UserCursors({ containerRef }: UserCursorsProps) {
  const [cursors, setCursors] = useState<UserCursor[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    const handleCursorMoved = (cursor: UserCursor) => {
      setCursors(prev => {
        const newCursors = prev.filter(c => c.userId !== cursor.userId);
        return [...newCursors, cursor];
      });
    };

    const handleUserJoined = () => {
      const state = collaborationManager.getState();
      setParticipants(state.participants);
    };

    const updateState = () => {
      const otherCursors = collaborationManager.getOtherCursors();
      setCursors(otherCursors);
      
      const state = collaborationManager.getState();
      setParticipants(state.participants);
    };

    collaborationManager.on('cursorMoved', handleCursorMoved);
    collaborationManager.on('userJoined', handleUserJoined);
    collaborationManager.on('connected', updateState);

    // Initial state
    updateState();

    return () => {
      collaborationManager.off('cursorMoved', handleCursorMoved);
      collaborationManager.off('userJoined', handleUserJoined);
      collaborationManager.off('connected', updateState);
    };
  }, []);

  const getUserById = (userId: string): User | undefined => {
    return participants.find(p => p.id === userId);
  };

  const getContainerBounds = () => {
    if (!containerRef.current) return { left: 0, top: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
  };

  return (
    <div className={styles.userCursors}>
      {cursors.map(cursor => {
        const user = getUserById(cursor.userId);
        if (!user) return null;

        const bounds = getContainerBounds();
        
        return (
          <div
            key={cursor.userId}
            className={styles.cursor}
            style={{
              left: cursor.position.x - bounds.left,
              top: cursor.position.y - bounds.top,
              color: user.color,
            }}
          >
            <div className={styles.cursorPointer}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                  fill={user.color}
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
            </div>
            
            <div 
              className={styles.cursorLabel}
              style={{ backgroundColor: user.color }}
            >
              <div className={styles.userAvatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className={styles.userName}>{user.name}</span>
              {user.isOnline && <span className={styles.onlineIndicator}>●</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}