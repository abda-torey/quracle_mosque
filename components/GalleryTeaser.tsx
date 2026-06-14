'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  images: { src: string; alt: string }[]
}

function SafeImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      onError={() => setFailed(true)}
    />
  )
}

export default function GalleryTeaser({ images }: Props) {
  if (!images || images.length === 0) return null

  return (
    <div>
      <p className="section-label">The mosque</p>
      <div className="grid grid-cols-2 gap-1.5">
        {images.slice(0, 4).map((img, i) => (
          <div
            key={img.src}
            className={`relative rounded-xl overflow-hidden bg-mosque-light ${i === 0 ? 'col-span-2 h-36' : 'h-24'}`}
          >
            <SafeImage src={img.src} alt={img.alt} className="object-cover" />
          </div>
        ))}
      </div>
      <Link href="/gallery" className="block text-center text-xs text-mosque-mid mt-2">
        See all photos
      </Link>
    </div>
  )
}
