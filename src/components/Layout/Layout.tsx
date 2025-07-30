import styles from './Layout.module.scss'

interface LayoutProps {
  sidebar: React.ReactNode
  canvas: React.ReactNode  
  rightPanel: React.ReactNode
}

export default function Layout({ sidebar, canvas, rightPanel }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        {sidebar}
      </aside>
      <main className={styles.canvas}>
        {canvas}
      </main>
      <aside className={styles.rightPanel}>
        {rightPanel}
      </aside>
    </div>
  )
}