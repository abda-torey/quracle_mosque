import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MOSQUE_NAME, FUNDRAISING_TARGET, GALLERY_IMAGES } from '@/lib/constants'
import { Pledge } from '@/lib/types'
import ShareButtons from '@/components/ShareButtons'
import ProgressBar from '@/components/ProgressBar'
import ContributorList from '@/components/ContributorList'
import HeroImage from '@/components/HeroImage'
import GalleryTeaser from '@/components/GalleryTeaser'

async function getPledges(): Promise<Pledge[]> {
  const { data, error } = await supabase
    .from('pledges')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
  if (error) console.error('getPledges error:', error)
  return data ?? []
}

export const revalidate = 0

export default async function HomePage() {
  const pledges = await getPledges()
  const totalRaised = pledges
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)
  const totalPledged = pledges
    .filter(p => p.status === 'pledged')
    .reduce((sum, p) => sum + p.amount, 0)
  const paidCount = pledges.filter(p => p.status === 'paid').length
  const pledgedCount = pledges.filter(p => p.status === 'pledged').length

  return (
    <main>
      {/* Hero — only renders if image file exists */}
      <HeroImage
        images={GALLERY_IMAGES}
        mosqueName={`${MOSQUE_NAME} — Solar Project`}
        subtitle="Help bring clean, reliable power to our community mosque"
      />

      <div className="px-4 pt-5 pb-8 space-y-5">

        {/* Progress */}
        <ProgressBar
          totalRaised={totalRaised}
          totalPledged={totalPledged}
          target={FUNDRAISING_TARGET}
          paidCount={paidCount}
          pledgedCount={pledgedCount}
        />

        {/* CTA */}
        <Link href="/pledge" className="btn-primary block text-center">
          Make a pledge <span className="font-normal opacity-80">· Isku Qor lacagta</span>
        </Link>


        {/* Share */}
        <ShareButtons mosqueName={MOSQUE_NAME} />

        {/* Contributors */}
        <div>
          <p className="section-label">
            Contributors ({pledges.length})
          </p>
          <ContributorList pledges={pledges} />
        </div>

        {/* Gallery teaser — only renders if images exist */}
        <GalleryTeaser images={GALLERY_IMAGES} />

        {/* Second CTA */}
        <Link href="/pledge" className="btn-primary block text-center">
          Make a pledge <span className="font-normal opacity-80">· Isku Qor lacagta</span>
        </Link>

        <p className="text-xs text-center text-gray-400">
          Questions? Contact the project admin
        </p>
      </div>
    </main>
  )
}
