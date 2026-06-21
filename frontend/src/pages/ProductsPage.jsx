import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productAPI, categoryAPI } from '../api'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState({ total: 0, pages: 1, page: 1 })
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const params = {
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1'),
  }

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.data || []))
  }, [])

  useEffect(() => {
    setLoading(true)
    const q = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null))
    productAPI.getAll(q)
      .then(({ data }) => {
        setProducts(data.data || [])
        setMeta({ total: data.total, pages: data.pages, page: data.page })
      })
      .finally(() => setLoading(false))
  }, [searchParams.toString()])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', p)
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => setSearchParams({})

  const SortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'priceAsc', label: 'Price: Low → High' },
    { value: 'priceDesc', label: 'Price: High → Low' },
    { value: 'rating', label: 'Top Rated' },
  ]

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-navy-900 mb-3 text-sm uppercase tracking-wide">Category</h3>
        <div className="space-y-1.5">
          <button onClick={() => setParam('category', '')}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!params.category ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-100 text-slate-600'}`}>
            All Categories
          </button>
          {categories.map(c => (
            <button key={c._id} onClick={() => setParam('category', c._id)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${params.category === c._id ? 'bg-accent text-white font-semibold' : 'hover:bg-slate-100 text-slate-600'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-navy-900 mb-3 text-sm uppercase tracking-wide">Price Range</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={params.minPrice}
            onChange={e => setParam('minPrice', e.target.value)}
            className="input text-sm" />
          <input type="number" placeholder="Max" value={params.maxPrice}
            onChange={e => setParam('maxPrice', e.target.value)}
            className="input text-sm" />
        </div>
      </div>

      {(params.category || params.minPrice || params.maxPrice || params.keyword) && (
        <button onClick={clearFilters}
          className="w-full text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 py-2 rounded-xl transition-colors">
          Clear Filters
        </button>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            {params.keyword ? `Search: "${params.keyword}"` : 'All Products'}
          </h1>
          {!loading && <p className="text-slate-500 text-sm mt-0.5">{meta.total} products found</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden btn-ghost text-sm border border-slate-200 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          <select value={params.sort} onChange={e => setParam('sort', e.target.value)}
            className="input text-sm w-44">
            {SortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="card p-5 sticky top-24">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile filters */}
        {filtersOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="flex-1 bg-black/40" onClick={() => setFiltersOpen(false)} />
            <div className="w-72 bg-white h-full overflow-y-auto p-6 animate-slide-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setFiltersOpen(false)}>✕</button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array(12).fill(0).map((_, i) => (
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
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {meta.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button disabled={params.page <= 1} onClick={() => setPage(params.page - 1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    ← Prev
                  </button>
                  {Array.from({ length: meta.pages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - params.page) <= 2)
                    .map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${p === params.page ? 'bg-accent text-white' : 'border border-slate-200 hover:bg-slate-50'}`}>
                        {p}
                      </button>
                    ))
                  }
                  <button disabled={params.page >= meta.pages} onClick={() => setPage(params.page + 1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
