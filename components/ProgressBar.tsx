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

    {/* Stacked bar */}
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

    {/* Paid vs pledged amounts */}
    <div className="flex justify-between text-xs">
      <div className="space-y-0.5">
        <div>
          <span className="text-mosque-green font-medium">{fmt(totalRaised)}</span>
          <span className="text-gray-400"> paid ({paidCount} people)</span>
        </div>
        {totalPledged > 0 && (
          <div>
            <span className="text-amber-600 font-medium">{fmt(totalPledged)}</span>
            <span className="text-gray-400"> pledged ({pledgedCount} people)Balanqaadka</span>
          </div>
        )}
      </div>
      <span className="text-gray-400 self-start">{Math.round(paidPct)}% of target</span>
    </div>
  </div>
)
}
