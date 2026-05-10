import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kunaal Ravindran',
  description: 'AI Engineer · Systems Builder · Adelaide, Australia',
  openGraph: {
    title: 'Kunaal Ravindran',
    description: 'AI Engineer · Systems Builder · Adelaide, Australia',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#000' }}>
      <body>{children}</body>
    </html>
  )
}
