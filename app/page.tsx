'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  const pathname = usePathname()

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoDots}>●●●</span>
            <div>
              <div className={styles.logoText}>asana</div>
              <div className={styles.logoSubtext}>ADMIN</div>
            </div>
          </div>
          <div className={styles.domain}>metronome.com</div>
        </div>
        
        <nav className={styles.nav}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
          >
            Insights
          </Link>
          <Link href="/" className={styles.navLink}>Users</Link>
          <Link href="/" className={styles.navLink}>Teams</Link>
          <Link href="/" className={styles.navLink}>Billing</Link>
          <Link href="/" className={styles.navLink}>Security</Link>
          <Link href="/" className={styles.navLink}>Settings</Link>
          <Link href="/" className={styles.navLink}>Apps</Link>
          <Link 
            href="/usage" 
            className={`${styles.navLink} ${pathname === '/usage' ? styles.active : ''}`}
          >
            Usage
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.helpSection}>
            <div className={styles.helpIcon}>💬</div>
            <div className={styles.helpText}>
              Our Customer Success team can help you achieve your goals.
            </div>
            <button className={styles.helpButton}>Get in touch</button>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        {pathname === '/' && (
          <div className={styles.content}>
            <h1>Insights</h1>
            <p>Select a tab from the sidebar to get started.</p>
          </div>
        )}
      </main>
    </div>
  )
}
