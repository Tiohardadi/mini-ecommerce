import { useState, useEffect } from 'react';
import { getProducts, getCategories, createProduct } from '../services/api';
import AdminProductItem from '../components/AdminProductItem';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    categoryId: '',
    image: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      
      if (categoriesData.length > 0 && !formData.categoryId) {
        setFormData(prev => ({
          ...prev,
          categoryId: categoriesData[0].id
        }));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load products and categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'categoryId' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form data
    if (!formData.name || !formData.price || !formData.description || 
        !formData.stock || !formData.categoryId || !formData.image) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await createProduct(formData);
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        stock: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        image: ''
      });
      
      // Refresh product list
      await fetchData();
      
      setSuccess('Product added successfully');
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to create product:", error);
      setError('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="p-8 font-['Work Sans'] text-gray-800 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Product Management</h1>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            resetMessages();
          }} 
          className="border border-black text-black px-5 py-2 rounded-md hover:bg-gray-100 transition"
        >
          {isAdding ? 'Cancel' : 'Add New Product'}
        </button>
      </div>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isAdding && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Add New Product</h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none" required>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none" placeholder="https://example.com/image.jpg" required />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none" rows="3" required />
            </div>
            
            <button 
              type="submit" 
              className="border border-black text-white px-5 py-2 rounded-md bg-black hover:bg-gray-800 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
      )}
      
      {isLoading && !isAdding ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : (
        <div>
          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No products available. Add your first product!</p>
            </div>
          ) : (
            products.map(product => (
              <AdminProductItem key={product.id} product={product} categories={categories} onUpdate={fetchData} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;