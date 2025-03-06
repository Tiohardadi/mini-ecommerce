import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useCart } from '../contexts/CartContext'
import CartItem from '../components/CartItem'
import { createOrder } from '../services/api'

const Cart = () => {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    if (cart.length === 0) return
    
    setIsProcessing(true)
    
    try {
      // Create an order for each cart item
      for (const item of cart) {
        await createOrder({
          userId: item.userId,
          productId: item.productId,
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity,
          status: 'Pending',
          orderDate: new Date().toISOString()
        })
      }
      
      // Clear the cart
      await clearCart()
      
      // Redirect to orders page
      navigate('/orders')
    } catch (error) {
      console.error("Failed to process checkout:", error)
      alert("Failed to process checkout. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="mb-6">Looks like you haven't added any products to your cart yet.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Cart Items ({cart.length})</h2>
        </div>
        
        <div>
          {cart.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div>
            <span className="font-medium">Total:</span>
            <span className="text-blue-600 text-xl font-bold ml-2">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline"
            >
              Continue Shopping
            </button>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart