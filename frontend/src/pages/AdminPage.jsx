import { useState, useEffect } from 'react'
import { productAPI, categoryAPI, orderAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  // Product form
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', brand: '', isFeatured: false, images: [] })
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/')
  }, [user])

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ limit: 50 }),
      orderAPI.getAll(),
      categoryAPI.getAll(),
    ]).then(([p, o, c]) => {
      setProducts(p.data.data || [])
      setOrders(o.data.data || [])
      setCategories(c.data.data || [])
    }).finally(() => setLoading(false))
  }, [])

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', category: '', brand: '', isFeatured: false, images: [] })
    setEditId(null)
    setShowForm(false)
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images ? [{ url: form.images }] : [],
    }
    try {
      if (editId) {
        await productAPI.update(editId, payload)
        setMsg('Product updated!')
      } else {
        await productAPI.create(payload)
        setMsg('Product created!')
      }
      const { data } = await productAPI.getAll({ limit: 50 })
      setProducts(data.data || [])
      resetForm()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving product')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await productAPI.delete(id)
    setProducts(ps => ps.filter(p => p._id !== id))
    setMsg('Product deleted')
  }

  const startEdit = (p) => {
    setForm({
      name: p.name, description: p.description,
      price: p.price, stock: p.stock,
      category: p.category?._id || p.category || '',
      brand: p.brand || '',
      isFeatured: p.isFeatured || false,
      images: p.images?.[0]?.url || '',
    })
    setEditId(p._id)
    setShowForm(true)
  }

  const handleStatusChange = async (id, status) => {
    await orderAPI.updateStatus(id, status)
    setOrders(os => os.map(o => o._id === id ? { ...o, status } : o))
  }

  const TABS = [
    { key: 'products', label: 'Products', count: products.length },
    { key: 'orders', label: 'Orders', count: orders.length },
  ]

  const stats = [
    { label: 'Total Products', value: products.length, color: 'text-blue-600' },
    { label: 'Total Orders', value: orders.length, color: 'text-amber-600' },
    { label: 'Revenue', value: `৳${orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.totalPrice || 0), 0).toFixed(0)}`, color: 'text-green-600' },
    { label: 'Pending', value: orders.filter(o => o.status === 'Processing').length, color: 'text-red-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="card p-5">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {TABS.map(({ key, label, count }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === key ? 'border-accent text-accent' : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}>
            {label} <span className="ml-1 text-xs opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {msg && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent/10 text-accent">
          {msg} <button onClick={() => setMsg('')} className="ml-2 opacity-60">✕</button>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-navy-900">Products ({products.length})</h2>
            <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
              + Add Product
            </button>
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="card p-6 mb-6 animate-fade-in">
              <h3 className="font-bold text-navy-900 mb-4">{editId ? 'Edit Product' : 'New Product'}</h3>
              <form onSubmit={handleProductSubmit} className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 block mb-1">Product Name *</label>
                  <input value={form.name} onChange={e => setF('name', e.target.value)} className="input" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 block mb-1">Description *</label>
                  <textarea value={form.description} onChange={e => setF('description', e.target.value)}
                    rows={3} className="input resize-none" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Price (৳) *</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={e => setF('price', e.target.value)} className="input" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Stock *</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setF('stock', e.target.value)} className="input" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Category *</label>
                  <select value={form.category} onChange={e => setF('category', e.target.value)} className="input" required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Brand</label>
                  <input value={form.brand} onChange={e => setF('brand', e.target.value)} className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700 block mb-1">Image URL</label>
                  <input value={form.images} onChange={e => setF('images', e.target.value)} className="input" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.isFeatured}
                    onChange={e => setF('isFeatured', e.target.checked)} className="w-4 h-4 accent-accent" />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700">Featured product</label>
                </div>
                <div className="sm:col-span-2 flex gap-3">
                  <button type="submit" className="btn-primary">{editId ? 'Update' : 'Create'} Product</button>
                  <button type="button" onClick={resetForm} className="btn-ghost border border-slate-200">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                          {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-navy-900 line-clamp-1">{p.name}</p>
                          {p.isFeatured && <span className="text-xs text-accent font-medium">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{p.category?.name || '—'}</td>
                    <td className="p-4 font-semibold">৳{p.price}</td>
                    <td className="p-4">
                      <span className={`badge ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(p)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <p className="text-center py-8 text-slate-400 text-sm">No products yet</p>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          <h2 className="font-semibold text-navy-900 mb-4">Orders ({orders.length})</h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="p-4 text-slate-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold">৳{o.totalPrice?.toFixed(2)}</td>
                    <td className="p-4 text-slate-600">{o.paymentMethod}</td>
                    <td className="p-4">
                      <span className={`badge ${
                        o.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        o.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        o.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{o.status}</span>
                    </td>
                    <td className="p-4">
                      <select value={o.status}
                        onChange={e => handleStatusChange(o._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-accent">
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-center py-8 text-slate-400 text-sm">No orders yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
