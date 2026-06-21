import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../api'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productAPI.getFeatured()
      .then(({ data }) => setFeatured(data.data || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-accent/30">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            New arrivals every week
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Shop Smart,<br />
            <span className="text-accent">Live Better</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
            Discover thousands of products at unbeatable prices. Fast delivery, easy returns, and 24/7 support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="btn-primary text-base px-8 py-3">
              Shop Now →
            </Link>
            <Link to="/products?featured=true" className="btn-secondary text-base px-8 py-3 border-white/30 text-white hover:bg-white/10">
              View Featured
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Fast Delivery', desc: 'Orders shipped within 24 hours' },
            { icon: '🔒', title: 'Secure Payment', desc: 'bKash, Nagad, Card & COD' },
            { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free returns' },
            { icon: '💬', title: '24/7 Support', desc: 'Always here to help you' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center p-4">
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className="font-semibold text-navy-900 text-sm">{title}</h3>
              <p className="text-slate-500 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">Featured Products</h2>
            <p className="text-slate-500 text-sm mt-1">Hand-picked just for you</p>
          </div>
          <Link to="/products" className="text-accent hover:text-accent-dark font-semibold text-sm transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-base">No featured products yet.</p>
            <Link to="/products" className="btn-primary mt-4 inline-block">Browse All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-accent/5 border-y border-accent/10 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-3">Ready to explore more?</h2>
          <p className="text-slate-600 mb-6">Browse our full catalog with filters, search, and sorting.</p>
          <Link to="/products" className="btn-primary text-base px-8 py-3">
            Browse All Products
          </Link>
        </div>
      </section>
    </div>
  )
}
