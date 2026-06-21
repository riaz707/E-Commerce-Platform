import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productAPI } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className={`text-2xl transition-colors ${s <= value ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart, loading: cartLoading } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewMsg, setReviewMsg] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    productAPI.getById(id)
      .then(({ data }) => { setProduct(data.data); setActiveImg(0) })
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = async () => {
    const result = await addToCart(product._id, qty)
    if (result.success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    try {
      await productAPI.addReview(id, review)
      setReviewMsg('Review submitted!')
      const { data } = await productAPI.getById(id)
      setProduct(data.data)
      setReview({ rating: 5, comment: '' })
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review')
    }
  }

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square bg-slate-100 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 bg-slate-100 rounded w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="h-6 bg-slate-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Product not found.</p>
      <Link to="/products" className="btn-primary mt-4 inline-block">Back to Products</Link>
    </div>
  )

  const price = product.discountPrice > 0 ? product.discountPrice : product.price

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/" className="hover:text-navy-900 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-navy-900 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-navy-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            {product.images?.length > 0
              ? <img src={product.images[activeImg]?.url} alt={product.name}
                  className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
            }
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-accent' : 'border-transparent hover:border-slate-200'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.isFeatured && (
            <span className="badge bg-accent/10 text-accent mb-3">⭐ Featured</span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">{product.name}</h1>
          <p className="text-slate-500 text-sm mb-1">Brand: <span className="font-medium text-navy-900">{product.brand}</span></p>
          {product.category && (
            <p className="text-slate-500 text-sm mb-4">
              Category: <span className="font-medium text-navy-900">{product.category.name}</span>
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'}`}
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-slate-500">
              {product.rating?.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-extrabold text-navy-900">৳{price.toFixed(2)}</span>
            {product.discountPrice > 0 && (
              <span className="text-slate-400 line-through text-lg">৳{product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Stock */}
          <div className={`inline-flex items-center gap-1.5 text-sm font-medium mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
          </div>

          <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

          {/* Qty + Add */}
          {product.stock > 0 && (
            <div className="flex gap-3 items-center mb-6">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-2.5 hover:bg-slate-50 text-lg font-medium transition-colors">−</button>
                <span className="px-4 font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 hover:bg-slate-50 text-lg font-medium transition-colors">+</button>
              </div>
              <button onClick={handleAdd} disabled={cartLoading}
                className={`flex-1 btn-primary py-3 text-base ${added ? 'bg-green-600' : ''}`}>
                {added ? '✓ Added to Cart' : cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {product.sku && (
            <p className="text-xs text-slate-400">SKU: {product.sku}</p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14">
        <h2 className="text-xl font-bold text-navy-900 mb-6">
          Reviews ({product.numReviews})
        </h2>

        {product.reviews?.length === 0 && (
          <p className="text-slate-400 text-sm mb-6">No reviews yet. Be the first!</p>
        )}

        <div className="space-y-4 mb-8">
          {product.reviews?.map((r, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{r.name}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-sm ${s <= r.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-600 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Write review */}
        {user ? (
          <div className="card p-6">
            <h3 className="font-bold text-navy-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Rating</label>
                <StarInput value={review.rating} onChange={v => setReview(r => ({ ...r, rating: v }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Comment</label>
                <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                  rows={3} placeholder="Share your experience..." className="input resize-none" required />
              </div>
              {reviewMsg && (
                <p className={`text-sm font-medium ${reviewMsg.includes('submitted') ? 'text-green-600' : 'text-red-500'}`}>
                  {reviewMsg}
                </p>
              )}
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-sm">
            <Link to="/login" className="text-accent hover:underline font-medium">Login</Link> to write a review.
          </div>
        )}
      </div>
    </div>
  )
}
