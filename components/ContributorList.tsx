import { Pledge } from '@/lib/types'

interface Props {
  pledges: Pledge[]
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = [
  'bg-teal-100 text-teal-800',
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
]

function avatarColor(name: string) {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) ?? 0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

export default function ContributorList({ pledges }: Props) {
  if (pledges.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        Be the first to contribute — your name will appear here.
      </p>
    )
  }

  const fmt = (n: number) =>
    'KES ' + n.toLocaleString('en-KE', { maximumFractionDigits: 0 })

  return (
    <div className="divide-y divide-gray-100">
      {pledges.map(p => {
        const displayName = p.nickname
          ? `${p.full_name} (${p.nickname})`
          : p.full_name

        return (
          <div key={p.id} className="flex items-center gap-3 py-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${avatarColor(p.full_name)}`}
            >
              {initials(p.full_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{displayName}</p>
              <p className="text-xs text-gray-400">{p.location}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-mosque-green">{fmt(p.amount)}</p>
                <span className={p.status === 'paid' ? 'badge-paid' : 'badge-pledged'}>
                  {p.status === 'paid' ? 'Paid' : 'Pledged (Ballanqaad)'}
                </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
