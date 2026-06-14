import Link from 'next/link'
import PledgeForm from '@/components/PledgeForm'

export default function PledgePage() {
  return (
    <main>
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Link href="/" className="text-gray-400 p-1 -ml-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h2 className="text-base font-medium text-gray-800">Make a pledge</h2>
      </div>
      <div className="px-4 pb-8">
        <PledgeForm />
      </div>
    </main>
  )
}
