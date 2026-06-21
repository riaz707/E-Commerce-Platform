import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { orderAPI } from '../api'

const STATUS_COLORS = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders(data.data || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-5 bg-slate-100 rounded w-1/3 mb-3" />
            <div className="h-4 bg-slate-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="font-medium">No orders yet</p>
          <Link to="/products" className="btn-primary mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 block hover:shadow-md transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400 font-mono mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="font-semibold text-navy-900">
                    {order.orderItems?.length} item(s) • ৳{order.totalPrice?.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-BD', { dateStyle: 'medium' })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`badge ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-600'}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-400">{order.paymentMethod}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getById(id)
      .then(({ data }) => setOrder(data.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-4">
      <div className="h-8 bg-slate-100 rounded w-1/3" />
      <div className="card p-6 space-y-3">
        {Array(3).fill(0).map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded" />)}
      </div>
    </div>
  )

  if (!order) return (
    <div className="text-center py-20 text-slate-500">
      <p>Order not found.</p>
      <Link to="/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orders" className="text-slate-400 hover:text-navy-900 transition-colors">
          ← Orders
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-mono text-sm text-slate-600">#{order._id.slice(-8).toUpperCase()}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="card p-6">
          <h2 className="font-bold text-navy-900 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} × ৳{item.price}</p>
                </div>
                <p className="text-sm font-semibold">৳{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-bold text-navy-900 mb-4">Order Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd><span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Payment</dt>
                <dd className="font-medium">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Items</dt>
                <dd className="font-medium">৳{order.itemsPrice?.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Shipping</dt>
                <dd className="font-medium">৳{order.shippingPrice?.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Tax</dt>
                <dd className="font-medium">৳{order.taxPrice?.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-base">
                <dt>Total</dt>
                <dd className="text-accent">৳{order.totalPrice?.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-navy-900 mb-3">Shipping Address</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {order.shippingAddress?.street},<br />
              {order.shippingAddress?.city} {order.shippingAddress?.postalCode},<br />
              {order.shippingAddress?.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
