import { useState } from 'react'
import { useCart } from '../contexts/CartContext'

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart()
  const [quantity, setQuantity] = useState(item.quantity)
  
  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value)
    if (newQty > 0) {
      setQuantity(newQty)
      updateItem(item.id, newQty)
    }
  }

  const handleRemove = () => {
    removeItem(item.id)
  }

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <img 
          src={`/api/placeholder/80/80`} 
          alt={item.product.name} 
          className="w-16 h-16 object-cover rounded"
        />
        
        <div>
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-gray-600 text-sm">${item.product.price.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <input 
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 p-1 border rounded text-center"
        />
        
        <span className="font-medium">
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
        
        <button 
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem