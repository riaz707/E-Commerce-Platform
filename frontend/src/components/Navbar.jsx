import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart, setIsOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const totalItems = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0

  return (
    <header className="sticky top-0 z-50 bg-navy-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">ShopVibe</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto hidden sm:flex">
          <div className="flex w-full">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-navy-800 text-white placeholder-slate-400 px-4 py-2 rounded-l-xl text-sm focus:outline-none focus:bg-navy-700 transition-colors"
            />
            <button type="submit"
              className="bg-accent hover:bg-accent-dark px-4 rounded-r-xl transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1 ml-auto">
          <Link to="/products" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            Products
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link to="/orders" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Orders
              </Link>
              <Link to="/profile" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors ml-1">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Cart icon */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 text-slate-300 hover:text-white hover:bg-navy-800 rounded-xl transition-colors ml-auto md:ml-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>

        {/* Mobile menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-navy-800 border-t border-navy-700 px-4 py-3 space-y-1 animate-fade-in">
          <form onSubmit={handleSearch} className="flex mb-3">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search..." className="flex-1 bg-navy-700 text-white placeholder-slate-400 px-3 py-2 rounded-l-lg text-sm focus:outline-none" />
            <button type="submit" className="bg-accent px-3 rounded-r-lg">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          {[
            { to: '/products', label: 'Products' },
            ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Dashboard' }] : []),
            ...(user ? [{ to: '/orders', label: 'My Orders' }, { to: '/profile', label: 'Profile' }] : [
              { to: '/login', label: 'Login' },
              { to: '/register', label: 'Sign Up' }
            ])
          ].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className="block text-slate-300 hover:text-white hover:bg-navy-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              {label}
            </Link>
          ))}
          {user && (
            <button onClick={() => { logout(); setMenuOpen(false) }}
              className="block w-full text-left text-red-400 hover:bg-navy-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  )
}
