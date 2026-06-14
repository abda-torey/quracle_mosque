'use client'

import { useState, useEffect, useCallback } from 'react'
import { Pledge } from '@/lib/types'
import { FUNDRAISING_TARGET } from '@/lib/constants'

const fmt = (n: number) => 'KES ' + n.toLocaleString('en-KE', { maximumFractionDigits: 0 })
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [pledges, setPledges] = useState<Pledge[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'pending' | 'all' | 'add'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Add form state
  const [addForm, setAddForm] = useState({
    full_name: '', nickname: '', phone: '', location: '',
    amount: '', payment_method: 'M-Pesa', status: 'pledged'
  })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState(false)

  const fetchPledges = useCallback(async (pwd: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin', {
        headers: { 'x-admin-token': pwd }
      })
      if (res.status === 401) { setAuthed(false); return }
      const { data } = await res.json()
      setPledges(data ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const res = await fetch('/api/admin', {
      headers: { 'x-admin-token': password }
    })
    if (res.status === 401) {
      setAuthError('Wrong password')
      return
    }
    const { data } = await res.json()
    setPledges(data ?? [])
    setAuthed(true)
  }

  async function handleAction(id: string, updates: Record<string, unknown>) {
    setActionLoading(id + JSON.stringify(updates))
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': password },
      body: JSON.stringify({ id, ...updates })
    })
    await fetchPledges(password)
    setActionLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this pledge?')) return
    setActionLoading(id + 'delete')
    await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': password },
      body: JSON.stringify({ id })
    })
    await fetchPledges(password)
    setActionLoading(null)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAddError('')
    setAddSuccess(false)
    if (!addForm.full_name || !addForm.phone || !addForm.location || !addForm.amount) {
      setAddError('Please fill all required fields')
      return
    }
    setAddLoading(true)
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': password },
      body: JSON.stringify({ ...addForm, amount: Number(addForm.amount) })
    })
    const data = await res.json()
    if (!res.ok) {
      setAddError(data.error ?? 'Something went wrong')
    } else {
      setAddSuccess(true)
      setAddForm({ full_name: '', nickname: '', phone: '', location: '', amount: '', payment_method: 'M-Pesa', status: 'pledged' })
      await fetchPledges(password)
    }
    setAddLoading(false)
  }

  useEffect(() => {
    if (authed) {
      const interval = setInterval(() => fetchPledges(password), 30000)
      return () => clearInterval(interval)
    }
  }, [authed, password, fetchPledges])

  const pending = pledges.filter(p => !p.approved)
  const approved = pledges.filter(p => p.approved)
  const totalRaised = approved.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPledged = approved.filter(p => p.status === 'pledged').reduce((s, p) => s + p.amount, 0)

  // LOGIN SCREEN
  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-xs">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-mosque-green rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E1F5EE" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Quracle Mosque Solar Project</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              className="input-field"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {authError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{authError}</p>}
            <button type="submit" className="btn-primary">Sign in</button>
          </form>
        </div>
      </main>
    )
  }

  // DASHBOARD
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-mosque-green px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-mosque-light font-medium text-sm">Admin Dashboard</p>
          <p className="text-mosque-muted text-xs">Quracle Mosque Solar Project</p>
        </div>
        <button
          onClick={() => { setAuthed(false); setPassword('') }}
          className="text-mosque-muted text-xs border border-mosque-muted rounded-lg px-3 py-1.5"
        >
          Sign out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-lg font-medium text-mosque-green">{fmt(totalRaised)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Paid</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-lg font-medium text-amber-600">{fmt(totalPledged)}</p>
          <p className="text-xs text-gray-400 mt-0.5">Pledged</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-lg font-medium text-red-500">{pending.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Pending</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-3 border border-gray-100">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>{fmt(totalRaised)} raised</span>
            <span>{fmt(FUNDRAISING_TARGET)} target</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-mosque-mid rounded-full"
              style={{ width: `${Math.min((totalRaised / FUNDRAISING_TARGET) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-2 mb-4">
        {(['pending', 'all', 'add'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-mosque-green text-mosque-light'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {t === 'pending' ? `Pending (${pending.length})` : t === 'all' ? `All (${pledges.length})` : '+ Add'}
          </button>
        ))}
      </div>

      <div className="px-4 pb-8">

        {/* PENDING TAB */}
        {tab === 'pending' && (
          <div className="space-y-3">
            {loading && <p className="text-sm text-gray-400 text-center py-4">Loading...</p>}
            {!loading && pending.length === 0 && (
              <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
                <p className="text-sm text-gray-400">No pending pledges</p>
              </div>
            )}
            {pending.map(p => (
              <PledgeCard
                key={p.id}
                pledge={p}
                actionLoading={actionLoading}
                onApprove={() => handleAction(p.id, { approved: true })}
                onMarkPaid={() => handleAction(p.id, { approved: true, status: 'paid' })}
                onDelete={() => handleDelete(p.id)}
                showApprove
              />
            ))}
          </div>
        )}

        {/* ALL TAB */}
        {tab === 'all' && (
          <div className="space-y-3">
            {loading && <p className="text-sm text-gray-400 text-center py-4">Loading...</p>}
            {pledges.map(p => (
              <PledgeCard
                key={p.id}
                pledge={p}
                actionLoading={actionLoading}
                onApprove={() => handleAction(p.id, { approved: true })}
                onMarkPaid={() => handleAction(p.id, { status: 'paid', approved: true })}
                onUnapprove={() => handleAction(p.id, { approved: false })}
                onDelete={() => handleDelete(p.id)}
                showApprove={!p.approved}
              />
            ))}
          </div>
        )}

        {/* ADD TAB */}
        {tab === 'add' && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-4">Add contributor manually</p>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="section-label block">Full name *</label>
                <input className="input-field" placeholder="Full name" value={addForm.full_name}
                  onChange={e => setAddForm(f => ({ ...f, full_name: e.target.value }))} />
              </div>
              <div>
                <label className="section-label block">Nickname</label>
                <input className="input-field" placeholder="Nickname (optional)" value={addForm.nickname}
                  onChange={e => setAddForm(f => ({ ...f, nickname: e.target.value }))} />
              </div>
              <div>
                <label className="section-label block">Phone *</label>
                <input className="input-field" placeholder="+254 7xx xxx xxx" value={addForm.phone}
                  onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="section-label block">Location *</label>
                <input className="input-field" placeholder="e.g. Nairobi, Kenya" value={addForm.location}
                  onChange={e => setAddForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <label className="section-label block">Amount (KES) *</label>
                <input type="number" className="input-field" placeholder="e.g. 5000" value={addForm.amount}
                  onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <label className="section-label block">Payment method</label>
                <select className="input-field" value={addForm.payment_method}
                  onChange={e => setAddForm(f => ({ ...f, payment_method: e.target.value }))}>
                  <option>M-Pesa</option>
                  <option>Bank transfer</option>
                  <option>Western Union</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="section-label block">Status</label>
                <select className="input-field" value={addForm.status}
                  onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="pledged">Pledged</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {addError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{addError}</p>}
              {addSuccess && <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">Added successfully — visible on the site now.</p>}
              <button type="submit" disabled={addLoading} className="btn-primary disabled:opacity-60">
                {addLoading ? 'Adding...' : 'Add contributor'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}

function PledgeCard({
  pledge: p,
  actionLoading,
  onApprove,
  onMarkPaid,
  onUnapprove,
  onDelete,
  showApprove,
}: {
  pledge: Pledge
  actionLoading: string | null
  onApprove: () => void
  onMarkPaid: () => void
  onUnapprove?: () => void
  onDelete: () => void
  showApprove: boolean
}) {
  const displayName = p.nickname ? `${p.full_name} (${p.nickname})` : p.full_name
  const busy = actionLoading !== null

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">{displayName}</p>
          <p className="text-xs text-gray-400">{p.location} · {fmtDate(p.created_at)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-mosque-green">KES {p.amount.toLocaleString()}</p>
          <span className={p.status === 'paid' ? 'badge-paid' : 'badge-pledged'}>
            {p.status}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-0.5">
        <p>📞 {p.phone}</p>
        <p>💳 {p.payment_method}</p>
        {p.message && <p className="italic text-gray-400">"{p.message}"</p>}
        {p.approved && <p className="text-mosque-green font-medium">✓ Approved — visible on site</p>}
        {!p.approved && <p className="text-amber-600 font-medium">⏳ Pending approval</p>}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {showApprove && (
          <button
            onClick={onApprove}
            disabled={busy}
            className="flex-1 py-2 text-xs font-medium bg-mosque-light text-mosque-green rounded-lg border border-mosque-muted disabled:opacity-50"
          >
            Approve → show on site
          </button>
        )}
        {p.status !== 'paid' && (
          <button
            onClick={onMarkPaid}
            disabled={busy}
            className="flex-1 py-2 text-xs font-medium bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            Mark as paid
          </button>
        )}
        {p.approved && onUnapprove && (
          <button
            onClick={onUnapprove}
            disabled={busy}
            className="py-2 px-3 text-xs text-amber-700 border border-amber-200 rounded-lg disabled:opacity-50"
          >
            Unapprove
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={busy}
          className="py-2 px-3 text-xs text-red-500 border border-red-200 rounded-lg disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
