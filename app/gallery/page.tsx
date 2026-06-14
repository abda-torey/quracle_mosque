import Image from 'next/image'
import Link from 'next/link'
import { MOSQUE_NAME, GALLERY_IMAGES } from '@/lib/constants'

export default function GalleryPage() {
  return (
    <main>
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Link href="/" className="text-gray-400 p-1 -ml-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h2 className="text-base font-medium text-gray-800">{MOSQUE_NAME}</h2>
      </div>

      <div className="px-4 pb-4 space-y-1.5">
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className={`relative w-full rounded-2xl overflow-hidden ${i === 0 ? 'h-52' : 'h-40'}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <p className="text-xs text-center text-gray-400 mb-4">
          Have old photos of the mosque? Send them to the admin to be included here.
        </p>
        <Link href="/pledge" className="btn-primary block text-center">
          Make a pledge
        </Link>
      </div>
    </main>
  )
}
