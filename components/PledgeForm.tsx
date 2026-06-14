'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PledgeFormData, PaymentMethod } from '@/lib/types'

const QUICK_AMOUNTS = [1000, 5000, 10000, 20000]
const PAYMENT_METHODS: PaymentMethod[] = ['M-Pesa', 'Bank transfer', 'Western Union', 'Other']

const empty: PledgeFormData = {
  full_name: '',
  nickname: '',
  phone: '',
  location: '',
  amount: '',
  payment_method: 'M-Pesa',
  message: '',
}

export default function PledgeForm() {
  const router = useRouter()
  const [form, setForm] = useState<PledgeFormData>(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof PledgeFormData, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.full_name.trim()) return setError('Please enter your full name.')
    if (!form.phone.trim()) return setError('Please enter your phone number.')
    if (!form.location.trim()) return setError('Please enter your city or country.')
    if (!form.amount || Number(form.amount) < 100) return setError('Please enter an amount of at least KES 100.')

    setLoading(true)
    try {
      const res = await fetch('/api/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      router.push('/pledge/success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-2">

      {/* Amount */}
      <div>
        <label className="section-label block">Amount (KES) · <span className="normal-case font-normal">Lacagta</span></label><div className="grid grid-cols-2 gap-2 mb-2">
          {QUICK_AMOUNTS.map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => set('amount', amt)}
              className={`py-3 rounded-xl text-sm font-medium border transition-colors ${
                form.amount === amt
                  ? 'bg-mosque-light border-mosque-mid text-mosque-green'
                  : 'bg-white border-gray-200 text-gray-500'
              }`}
            >
              KES {amt.toLocaleString()}
            </button>
          ))}
        </div>
        <input
          type="number"
          className="input-field"
          placeholder="Or enter a custom amount"
          value={form.amount === '' ? '' : form.amount}
          onChange={e => set('amount', e.target.value === '' ? '' : Number(e.target.value))}
          min={100}
        />
      </div>

      {/* Name */}
      <div>
        <label className="section-label block">Full name * · <span className="normal-case font-normal">Magaca oo dhan</span></label>
        <input
          type="text"
          className="input-field"
          placeholder="Your full name"
          value={form.full_name}
          onChange={e => set('full_name', e.target.value)}
        />
      </div>

      {/* Nickname */}
      <div>
        <label className="section-label block">Nickname · <span className="normal-case font-normal">Naaneskaaga/lakab</span></label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Abu Khalid, Hooyo, Uncle Yusuf"
          value={form.nickname}
          onChange={e => set('nickname', e.target.value)}
        />
        <p className="text-xs text-gray-400 mt-1">Will show as: Full Name (Nickname) on the contributors list</p>
      </div>

      {/* Phone */}
      <div>
        <label className="section-label block">Phone number *</label>
        <input
          type="tel"
          className="input-field"
          placeholder="+254 7xx xxx xxx"
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
        />
      </div>

      {/* Location */}
      <div>
        <label className="section-label block">City / Country * · <span className="normal-case font-normal">Magaalada / Dalka</span></label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Nairobi, Kenya"
          value={form.location}
          onChange={e => set('location', e.target.value)}
        />
      </div>

      {/* Payment method */}
      <div>
        <label className="section-label block">Payment · <span className="normal-case font-normal">Habka lacag bixinta</span></label>
        <select
          className="input-field"
          value={form.payment_method}
          onChange={e => set('payment_method', e.target.value as PaymentMethod)}
        >
          {PAYMENT_METHODS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="section-label block">A message or dua (optional)</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Share a memory, a dua, or a note for the community..."
          value={form.message}
          onChange={e => set('message', e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? 'Submitting...' : <>Submit pledge <span className="font-normal opacity-80">· Gudbi ballanqaadka</span></>}
      </button>

      <p className="text-xs text-center text-gray-400">
        The admin will contact you to arrange payment.<br />
        <span className="text-gray-300">Maamulaha ayaa kula xiriiri doona si loo habeeeyo lacag bixinta.</span>
      </p>
    </form>
  )
}
