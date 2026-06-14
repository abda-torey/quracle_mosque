import Link from 'next/link'
import { MOSQUE_NAME } from '@/lib/constants'

export default function SuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-16 h-16 bg-mosque-light rounded-full flex items-center justify-center mb-5">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#085041" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-xl font-medium text-gray-800 mb-2">Jazakallahu khairan</h1>
      <p className="text-sm text-gray-500 mb-1">Your pledge has been received.</p>
      <p className="text-sm text-gray-500 mb-6">
        The admin will contact you shortly to arrange payment for {MOSQUE_NAME}.
      </p>

      <Link href="/" className="btn-primary block w-full max-w-xs">
        Back to home
      </Link>

      <Link href="/contributors" className="mt-3 text-sm text-mosque-mid">
        See the contributors list
      </Link>
    </main>
  )
}
