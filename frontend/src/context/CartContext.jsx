import { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchCart()
    else setCart({ items: [], totalPrice: 0, totalItems: 0 })
  }, [user])

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.get()
      setCart(data.data || { items: [], totalPrice: 0, totalItems: 0 })
    } catch {
      setCart({ items: [], totalPrice: 0, totalItems: 0 })
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { success: false, message: 'Please login first' }
    setLoading(true)
    try {
      const { data } = await cartAPI.add(productId, quantity)
      setCart(data.data)
      setIsOpen(true)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add' }
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (productId, quantity) => {
    const { data } = await cartAPI.update(productId, quantity)
    setCart(data.data)
  }

  const removeItem = async (productId) => {
    const { data } = await cartAPI.remove(productId)
    setCart(data.data)
  }

  const clearCart = async () => {
    await cartAPI.clear()
    setCart({ items: [], totalPrice: 0, totalItems: 0 })
  }

  return (
    <CartContext.Provider value={{
      cart, isOpen, loading,
      setIsOpen, addToCart, updateItem, removeItem, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
