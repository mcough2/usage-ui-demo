import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asana Admin - Metronome Usage',
  description: 'View usage data from Metronome',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
