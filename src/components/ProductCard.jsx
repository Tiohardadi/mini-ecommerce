import { Link } from 'react-router'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (user) {
      addItemToCart(product.id)
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/product/${product.id}`}>
        <img 
          src={`https://mrmockup.com/wp-content/uploads/2024/07/Free-Backside-T-Shirt-Mockup-Square-1024x1024.jpg?x33229`} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-black font-bold">${product.price.toFixed(2)}</span>
            <button 
              onClick={handleAddToCart}
              className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard