'use client'

import React from 'react'
import styles from './CategoryTab.module.scss'

interface CategoryTabProps {
  category: {
    key: string
    name: string
    icon: string
    color: string
  }
  active: boolean
  onClick: () => void
  count: number
}

export default function CategoryTab({ category, active, onClick, count }: CategoryTabProps) {
  return (
    <button
      className={`${styles.categoryTab} ${active ? styles.active : ''}`}
      onClick={onClick}
      style={{
        '--category-color': category.color
      } as React.CSSProperties}
    >
      <div className={styles.content}>
        <span className={styles.icon}>{category.icon}</span>
        <span className={styles.name}>{category.name}</span>
        <span className={styles.count}>{count}</span>
      </div>
      {active && (
        <div 
          className={styles.activeIndicator}
          style={{ backgroundColor: category.color }}
        />
      )}
    </button>
  )
}