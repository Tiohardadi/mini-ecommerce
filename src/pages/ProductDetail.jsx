import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getProduct, getCategories } from '../services/api'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItemToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const productData = await getProduct(parseInt(id))
        setProduct(productData)
        
        // Get category information
        const categories = await getCategories()
        const productCategory = categories.find(
          cat => cat.id === productData.categoryId
        )
        setCategory(productCategory)
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= product.stock) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (user) {
      addItemToCart(product.id, quantity)
      navigate('/cart')
    } else {
      navigate('/login')
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading product details...</div>
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="mb-4">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            // src={`/api/placeholder/400/400`} 
            src={`https://mrmockup.com/wp-content/uploads/2024/07/Free-Backside-T-Shirt-Mockup-Square-1024x1024.jpg?x33229`} 
            alt={product.name} 
            className="w-full h-auto rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          
          <div className="mb-4">
            <span className="text-sm text-gray-600">Category: </span>
            <span className="text-sm font-medium">{category?.name || 'Uncategorized'}</span>
          </div>
          
          <p className="text-gray-700 mb-4">{product.description}</p>
          
          <div className="mb-4">
            <span className="text-blue-600 text-2xl font-bold">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="mb-4">
          <span className={`text-sm ${product.stock > 0 
              ? 'text-green-600' 
              : 'text-red-600'}`}
            >
              {product.stock > 0 
                ? `In Stock (${product.stock} available)` 
                : 'Out of Stock'}
            </span>
          </div>
          
          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 p-2 border rounded"
                />
              </div>
              
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail