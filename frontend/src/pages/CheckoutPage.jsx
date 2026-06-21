import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderAPI } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const PAYMENT_METHODS = ['Cash on Delivery', 'Card', 'bKash', 'Nagad']

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'Bangladesh',
    paymentMethod: 'Cash on Delivery',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const total = cart.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0
  const shipping = total > 1000 ? 0 : 60
  const tax = +(total * 0.05).toFixed(2)
  const grandTotal = +(total + shipping + tax).toFixed(2)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const orderData = {
        shippingAddress: { street: form.street, city: form.city, postalCode: form.postalCode, country: form.country },
        paymentMethod: form.paymentMethod,
      }
      const { data } = await orderAPI.create(orderData)
      await clearCart()
      navigate(`/orders/${data.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (!cart.items?.length) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>Your cart is empty.</p>
        <button onClick={() => navigate('/products')} className="btn-primary mt-4">Shop Now</button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-navy-900 mb-4">Shipping Address</h2>
            <div className="space-y-3">
              {[
                { label: 'Street Address', key: 'street', placeholder: '123 Main St' },
                { label: 'City', key: 'city', placeholder: 'Dhaka' },
                { label: 'Postal Code', key: 'postalCode', placeholder: '1000' },
                { label: 'Country', key: 'country', placeholder: 'Bangladesh' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">{label}</label>
                  <input value={form[key]} onChange={e => set(key, e.target.value)}
                    className="input" placeholder={placeholder} required />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-navy-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map(m => (
                <button key={m} type="button" onClick={() => set('paymentMethod', m)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.paymentMethod === m
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Placing order...' : `Place Order • ৳${grandTotal}`}
          </button>
        </form>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-navy-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {cart.items?.map(item => (
              <div key={item.product} className="flex gap-3 items-start">
                <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-slate-100" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-navy-900 shrink-0">
                  ৳{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span><span>৳{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                {shipping === 0 ? 'Free' : `৳${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Tax (5%)</span><span>৳{tax}</span>
            </div>
            <div className="flex justify-between font-bold text-navy-900 text-base border-t border-slate-100 pt-2 mt-2">
              <span>Total</span><span>৳{grandTotal}</span>
            </div>
          </div>
          {shipping === 0 && (
            <p className="text-xs text-green-600 mt-2 text-center">🎉 Free shipping on orders over ৳1000!</p>
          )}
        </div>
      </div>
    </div>
  )
}
