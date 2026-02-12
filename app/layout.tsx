import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ลงทะเบียนทีมอีสปอร์ต',
  description: 'ระบบลงทะเบียนทีมแข่งขันอีสปอร์ต',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
