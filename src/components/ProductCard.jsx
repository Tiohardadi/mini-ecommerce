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
          src={`/api/placeholder/300/200`} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
            <button 
              onClick={handleAddToCart}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
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