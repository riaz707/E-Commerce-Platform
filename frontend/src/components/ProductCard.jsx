import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-1">({rating?.toFixed(1) || '0.0'})</span>
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart()
  const [added, setAdded] = useState(false)

  const image = product.images?.[0]?.url

  const handleAdd = async (e) => {
    e.preventDefault()
    const result = await addToCart(product._id)
    if (result.success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  const discounted = product.discountPrice > 0
  const displayPrice = discounted ? product.discountPrice : product.price

  return (
    <Link to={`/products/${product._id}`} className="card group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 block">
      {/* Image */}
      <div className="aspect-square bg-slate-50 overflow-hidden relative">
        {image
          ? <img src={image} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-slate-200">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
        {product.isFeatured && (
          <span className="absolute top-2 left-2 badge bg-accent text-white">Featured</span>
        )}
        {discounted && (
          <span className="absolute top-2 right-2 badge bg-green-100 text-green-700">
            Sale
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-slate-700 text-white text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
          {product.category?.name || product.brand}
        </p>
        <h3 className="font-semibold text-navy-900 text-sm leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>
        <StarRating rating={product.rating} />

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-navy-900 font-bold text-base">৳{displayPrice.toFixed(2)}</span>
            {discounted && (
              <span className="text-slate-400 line-through text-xs ml-1.5">৳{product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || loading}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 ${
              added
                ? 'bg-green-100 text-green-700'
                : product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-accent/10 text-accent hover:bg-accent hover:text-white active:scale-95'
            }`}
          >
            {added ? '✓ Added' : product.stock === 0 ? 'Unavailable' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
