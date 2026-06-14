'use client'

interface Props {
  totalRaised: number
  totalPledged: number
  target: number
  paidCount: number
  pledgedCount: number
}

export default function ProgressBar({ totalRaised, totalPledged, target, paidCount, pledgedCount }: Props) {
  const paidPct = Math.min((totalRaised / target) * 100, 100)
  const pledgedPct = Math.min(((totalRaised + totalPledged) / target) * 100, 100)

  const fmt = (n: number) =>
    'KES ' + n.toLocaleString('en-KE', { maximumFractionDigits: 0 })

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-medium text-mosque-green">{fmt(totalRaised)}</span>
        <span className="text-sm text-gray-400">of {fmt(target)}</span>
      </div>

      {/* Stacked bar: paid (solid green) + pledged (light green) */}
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className="absolute h-full bg-mosque-light rounded-full"
          style={{ width: `${pledgedPct}%` }}
        />
        <div
          className="absolute h-full bg-mosque-mid rounded-full"
          style={{ width: `${paidPct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>
          <span className="text-mosque-green font-medium">{paidCount} paid</span>
          {pledgedCount > 0 && (
            <span className="text-amber-600"> · {pledgedCount} pledged</span>
          )}
        </span>
        <span>{Math.round(paidPct)}% of target</span>
      </div>
    </div>
  )
}
