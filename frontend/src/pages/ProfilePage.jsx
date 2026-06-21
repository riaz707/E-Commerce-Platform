import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || '',
    password: '',
  })
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, postalCode: form.postalCode, country: form.country },
        ...(form.password ? { password: form.password } : {}),
      })
      setMsg('Profile updated!')
      setForm(f => ({ ...f, password: '' }))
    } catch {
      setMsg('Update failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">My Profile</h1>

      <div className="card p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-navy-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className={`badge mt-1 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} className="input" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} className="input" placeholder="+880..." />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Street</label>
            <input value={form.street} onChange={e => set('street', e.target.value)} className="input" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Postal</label>
              <input value={form.postalCode} onChange={e => set('postalCode', e.target.value)} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Country</label>
              <input value={form.country} onChange={e => set('country', e.target.value)} className="input" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">New Password</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
              className="input" placeholder="Leave blank to keep current" />
          </div>

          {msg && (
            <p className={`text-sm font-medium px-4 py-2.5 rounded-xl ${msg.includes('updated') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {msg}
            </p>
          )}

          <button type="submit" disabled={saving} className="btn-primary px-8">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
