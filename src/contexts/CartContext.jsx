import { createContext, useContext, useState, useEffect } from 'react'
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart([])
      setCartTotal(0)
    }
  }, [user])

  useEffect(() => {
    // Calculate total whenever cart changes
    const total = cart.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity
    }, 0)
    setCartTotal(total)
  }, [cart])

  const fetchCart = async () => {
    try {
      const cartData = await getCart()
      setCart(cartData)
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    }
  }

  const addItemToCart = async (productId, quantity = 1) => {
    if (!user) return false
    
    try {
      await addToCart(productId, quantity)
      await fetchCart()
      return true
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      return false
    }
  }

  const updateItem = async (itemId, quantity) => {
    if (!user) return false
    
    try {
      await updateCartItem(itemId, quantity)
      await fetchCart()
      return true
    } catch (error) {
      console.error("Failed to update cart item:", error)
      return false
    }
  }

  const removeItem = async (itemId) => {
    if (!user) return false
    
    try {
      await removeFromCart(itemId)
      await fetchCart()
      return true
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
      return false
    }
  }

  const clearCart = async () => {
    if (!user) return false
    
    try {
      for (const item of cart) {
        await removeFromCart(item.id)
      }
      setCart([])
      return true
    } catch (error) {
      console.error("Failed to clear cart:", error)
      return false
    }
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartTotal, 
      addItemToCart, 
      updateItem, 
      removeItem, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)