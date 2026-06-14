'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: { src: string; alt: string }[]
  mosqueName: string
  subtitle: string
}

export default function HeroImage({ images, mosqueName, subtitle }: Props) {
  const [failed, setFailed] = useState(false)
  const hero = images[0]

  if (!hero || failed) {
    return (
      <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="relative w-full h-72 bg-mosque-green flex flex-col items-center justify-end pb-8 px-5">
          <h1 className="text-white text-xl font-semibold text-center leading-snug">{mosqueName}</h1>
          <p className="text-mosque-muted text-sm text-center mt-1">{subtitle}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="relative w-full" style={{ height: '320px' }}>
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          className="object-cover"
          style={{ objectPosition: 'center 20%' }}
          priority
          onError={() => setFailed(true)}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 40%, rgba(8,80,65,0.85) 80%, rgba(8,80,65,0.95) 100%)'
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <h1 className="text-white text-lg font-semibold leading-snug">{mosqueName}</h1>
          <p className="text-mosque-muted text-xs mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}