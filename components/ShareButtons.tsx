'use client'

interface Props {
  mosqueName: string
}

export default function ShareButtons({ mosqueName }: Props) {
  const shareText = `Support the solar project at ${mosqueName} — help keep the lights on for our community mosque.`

  function handleWhatsApp() {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(shareText + ' ' + window.location.href)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied!')
    })
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleWhatsApp} className="btn-secondary">
        <span className="mr-1.5">📲</span> Share on WhatsApp
      </button>
      <button onClick={handleCopy} className="btn-secondary">
        <span className="mr-1.5">🔗</span> Copy link
      </button>
    </div>
  )
}
