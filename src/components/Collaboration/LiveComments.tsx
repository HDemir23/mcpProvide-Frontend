'use client'

import React, { useState } from 'react';
import { LiveComment } from '../../types/collaboration';
import styles from './LiveComments.module.scss';

interface LiveCommentsProps {
  comments: LiveComment[];
  onAddComment: (position: { x: number; y: number }, content: string) => void;
  onReplyToComment: (commentId: string, content: string) => void;
  onResolveComment: (commentId: string) => void;
}

export default function LiveComments({ 
  comments, 
  onAddComment, 
  onReplyToComment, 
  onResolveComment 
}: LiveCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showResolved, setShowResolved] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // For demo purposes, use a random position
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100
    };
    
    onAddComment(position, newComment);
    setNewComment('');
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    onReplyToComment(commentId, replyContent);
    setReplyContent('');
    setReplyingTo(null);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredComments = showResolved 
    ? comments 
    : comments.filter(comment => !comment.isResolved);

  return (
    <div className={styles.liveComments}>
      <div className={styles.addComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment to the workflow..."
          className={styles.commentInput}
          rows={2}
        />
        <div className={styles.addCommentActions}>
          <button
            className={styles.addButton}
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            💬 Add Comment
          </button>
        </div>
      </div>

      <div className={styles.commentsHeader}>
        <h5>Comments ({filteredComments.length})</h5>
        <label className={styles.showResolvedToggle}>
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          Show resolved
        </label>
      </div>

      <div className={styles.commentsList}>
        {filteredComments.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💭</span>
            <p>No comments yet</p>
            <small>Add comments to discuss workflow details</small>
          </div>
        ) : (
          filteredComments.map(comment => (
            <div 
              key={comment.id} 
              className={`${styles.comment} ${comment.isResolved ? styles.resolved : ''}`}
            >
              <div className={styles.commentHeader}>
                <div className={styles.commentAuthor}>
                  <div className={styles.authorAvatar}>
                    {comment.userId.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>User</span>
                    <span className={styles.commentTime}>
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                </div>
                
                <div className={styles.commentActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    💬 Reply
                  </button>
                  {!comment.isResolved && (
                    <button
                      className={styles.actionButton}
                      onClick={() => onResolveComment(comment.id)}
                    >
                      ✅ Resolve
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.commentContent}>
                {comment.content}
              </div>

              <div className={styles.commentPosition}>
                Position: ({Math.round(comment.position.x)}, {Math.round(comment.position.y)})
              </div>

              {comment.replies.length > 0 && (
                <div className={styles.replies}>
                  {comment.replies.map(reply => (
                    <div key={reply.id} className={styles.reply}>
                      <div className={styles.replyHeader}>
                        <div className={styles.replyAuthor}>
                          <div className={styles.authorAvatar}>
                            {reply.userId.charAt(0).toUpperCase()}
                          </div>
                          <span className={styles.authorName}>User</span>
                          <span className={styles.replyTime}>
                            {formatTimestamp(reply.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.replyContent}>
                        {reply.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === comment.id && (
                <div className={styles.replyForm}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className={styles.replyInput}
                    rows={2}
                  />
                  <div className={styles.replyActions}>
                    <button
                      className={styles.replyButton}
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}