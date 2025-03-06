// src/pages/AdminProductManagement.jsx
import { useState, useEffect } from 'react'
import { getProducts, getCategories, createProduct } from '../services/api'
import AdminProductItem from '../components/AdminProductItem'

const AdminProductManagement = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    categoryId: '',
    image: 'placeholder.jpg' // Using placeholder as default
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
      
      // Set default category if available
      if (categoriesData.length > 0 && !formData.categoryId) {
        setFormData(prev => ({
          ...prev,
          categoryId: categoriesData[0].id
        }))
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'categoryId' 
        ? Number(value) 
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createProduct(formData)
      setIsAdding(false)
      setFormData({
        name: '',
        price: '',
        description: '',
        stock: '',
        categoryId: categories[0]?.id || '',
        image: 'placeholder.jpg'
      })
      fetchData()
    } catch (error) {
      console.error("Failed to create product:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {isAdding ? 'Cancel' : 'Add New Product'}
        </button>
      </div>
      
      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </form>
        </div>
      )}
      
      <div>
        {products.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500">No products available. Add your first product!</p>
          </div>
        ) : (
          products.map(product => (
            <AdminProductItem 
              key={product.id} 
              product={product} 
              categories={categories}
              onUpdate={fetchData}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default AdminProductManagement