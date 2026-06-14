import type { Metadata } from 'next'
import './globals.css'
import { MOSQUE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `${MOSQUE_NAME} — Solar Project`,
  description: `Support the solar installation at ${MOSQUE_NAME}. Help bring clean, reliable power to our community mosque.`,
  openGraph: {
    title: `${MOSQUE_NAME} Solar Project`,
    description: 'Join us in supporting this community project.',
    images: ['/images/mosque-exterior.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
