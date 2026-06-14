import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FUNDRAISING_TARGET } from '@/lib/constants'
import { Pledge } from '@/lib/types'
import ContributorList from '@/components/ContributorList'
import ProgressBar from '@/components/ProgressBar'

async function getPledges(): Promise<Pledge[]> {
  const { data } = await supabase
    .from('pledges')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export const revalidate = 60

export default async function ContributorsPage() {
  const pledges = await getPledges()
  const totalRaised = pledges.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPledged = pledges.filter(p => p.status === 'pledged').reduce((s, p) => s + p.amount, 0)
  const paidCount = pledges.filter(p => p.status === 'paid').length
  const pledgedCount = pledges.filter(p => p.status === 'pledged').length

  return (
    <main>
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Link href="/" className="text-gray-400 p-1 -ml-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h2 className="text-base font-medium text-gray-800">Contributors ({pledges.length})</h2>
      </div>

      <div className="px-4 pb-8 space-y-4">
        <ProgressBar
          totalRaised={totalRaised}
          totalPledged={totalPledged}
          target={FUNDRAISING_TARGET}
          paidCount={paidCount}
          pledgedCount={pledgedCount}
        />
        <ContributorList pledges={pledges} />
        <Link href="/pledge" className="btn-primary block text-center">
          Add your name to this list
        </Link>
      </div>
    </main>
  )
}
