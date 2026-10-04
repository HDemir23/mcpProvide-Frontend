'use client'

import React from 'react';
import Image from 'next/image';
import { User } from '../../types/collaboration';
import styles from './ParticipantList.module.scss';

interface ParticipantListProps {
  participants: User[];
}

export default function ParticipantList({ participants }: ParticipantListProps) {
  const formatLastSeen = (date?: Date) => {
    if (!date) return 'Just now';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (participants.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>👥</span>
        <p>No participants</p>
      </div>
    );
  }

  return (
    <div className={styles.participantList}>
      {participants.map(participant => (
        <div key={participant.id} className={styles.participant}>
          <div 
            className={styles.avatar}
            style={{ backgroundColor: participant.color }}
          >
            {participant.avatar ? (
              <Image src={participant.avatar} alt={participant.name} width={32} height={32} />
            ) : (
              participant.name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className={styles.info}>
            <div className={styles.name}>{participant.name}</div>
            <div className={styles.email}>{participant.email}</div>
          </div>
          
          <div className={styles.status}>
            <div className={`${styles.statusDot} ${participant.isOnline ? styles.online : styles.offline}`} />
            <div className={styles.lastSeen}>
              {participant.isOnline ? 'Online' : formatLastSeen(participant.lastSeen)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}