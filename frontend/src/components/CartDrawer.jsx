import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex gap-3 py-4 border-b border-slate-100 last:border-0">
      <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
        {item.image
          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy-900 truncate">{item.name}</p>
        <p className="text-accent font-bold text-sm mt-0.5">৳{item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => item.quantity > 1 ? onUpdate(item.product, item.quantity - 1) : onRemove(item.product)}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"
          >−</button>
          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdate(item.product, item.quantity + 1)}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"
          >+</button>
          <button onClick={() => onRemove(item.product)}
            className="ml-auto text-slate-400 hover:text-red-500 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateItem, removeItem, clearCart } = useCart()
  const navigate = useNavigate()

  const total = cart.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0

  const handleCheckout = () => {
    setIsOpen(false)
    navigate('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl
        transform transition-transform duration-300 ease-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-navy-900">Your Cart</h2>
            <p className="text-sm text-slate-500">{cart.items?.length || 0} item(s)</p>
          </div>
          <div className="flex items-center gap-2">
            {cart.items?.length > 0 && (
              <button onClick={clearCart}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1">
                Clear all
              </button>
            )}
            <button onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {cart.items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-base font-medium">Your cart is empty</p>
              <button onClick={() => { setIsOpen(false); navigate('/products') }}
                className="btn-primary text-sm">
                Browse Products
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <CartItem
                key={item.product}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items?.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-navy-900 font-bold text-lg">৳{total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full text-center text-base py-3">
              Proceed to Checkout →
            </button>
            <button onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-slate-500 hover:text-navy-900 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
