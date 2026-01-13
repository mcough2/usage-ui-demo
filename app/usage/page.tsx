'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../page.module.css'
import usageStyles from './usage.module.css'

interface UsageData {
  customer_id?: string
  start_time?: string
  end_time?: string
  events?: Array<{
    transaction_id?: string
    timestamp?: string
    properties?: Record<string, any>
    count_seconds?: number
  }>
  total_count_seconds?: number
  total_events?: number
}

export default function UsagePage() {
  const pathname = usePathname()
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerId, setCustomerId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    // Set default dates (last 7 days)
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 7)
    
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }, [])

  const fetchUsageData = async () => {
    if (!customerId) {
      setError('Please enter a Customer ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          start_date: startDate,
          end_date: endDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch usage data')
      }

      setUsageData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setUsageData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsageData()
  }

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
          <Link href="/" className={styles.navLink}>Insights</Link>
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
        <div className={usageStyles.content}>
          <h1>Usage</h1>
          <p className={usageStyles.subtitle}>
            Query usage data from Metronome API
          </p>

          <form onSubmit={handleSubmit} className={usageStyles.form}>
            <div className={usageStyles.formGroup}>
              <label htmlFor="customerId">Customer ID</label>
              <input
                id="customerId"
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter customer ID"
                required
              />
            </div>

            <div className={usageStyles.formRow}>
              <div className={usageStyles.formGroup}>
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className={usageStyles.formGroup}>
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={usageStyles.submitButton}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Usage Data'}
            </button>
          </form>

          {error && (
            <div className={usageStyles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {usageData && (
            <div className={usageStyles.results}>
              <h2>Usage Results</h2>
              
              <div className={usageStyles.summary}>
                <div className={usageStyles.summaryItem}>
                  <span className={usageStyles.summaryLabel}>Customer ID:</span>
                  <span className={usageStyles.summaryValue}>{usageData.customer_id || 'N/A'}</span>
                </div>
                {usageData.total_events !== undefined && (
                  <div className={usageStyles.summaryItem}>
                    <span className={usageStyles.summaryLabel}>Total Events:</span>
                    <span className={usageStyles.summaryValue}>{usageData.total_events}</span>
                  </div>
                )}
                {usageData.total_count_seconds !== undefined && (
                  <div className={usageStyles.summaryItem}>
                    <span className={usageStyles.summaryLabel}>Total Seconds:</span>
                    <span className={usageStyles.summaryValue}>
                      {usageData.total_count_seconds.toLocaleString()}
                    </span>
                  </div>
                )}
                {usageData.start_time && (
                  <div className={usageStyles.summaryItem}>
                    <span className={usageStyles.summaryLabel}>Start Time:</span>
                    <span className={usageStyles.summaryValue}>
                      {new Date(usageData.start_time).toLocaleString()}
                    </span>
                  </div>
                )}
                {usageData.end_time && (
                  <div className={usageStyles.summaryItem}>
                    <span className={usageStyles.summaryLabel}>End Time:</span>
                    <span className={usageStyles.summaryValue}>
                      {new Date(usageData.end_time).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {usageData.events && usageData.events.length > 0 && (
                <div className={usageStyles.eventsSection}>
                  <h3>Events ({usageData.events.length})</h3>
                  <div className={usageStyles.eventsTable}>
                    <table>
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Timestamp</th>
                          <th>Count Seconds</th>
                          <th>Properties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usageData.events.map((event, index) => (
                          <tr key={event.transaction_id || index}>
                            <td>{event.transaction_id || 'N/A'}</td>
                            <td>
                              {event.timestamp 
                                ? new Date(event.timestamp).toLocaleString()
                                : 'N/A'}
                            </td>
                            <td>{event.count_seconds?.toLocaleString() || 'N/A'}</td>
                            <td>
                              <pre className={usageStyles.properties}>
                                {JSON.stringify(event.properties || {}, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
