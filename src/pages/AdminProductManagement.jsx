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

  return (
    <div className="p-8 font-['Work Sans'] text-gray-800 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Product Management</h1>
        <button onClick={() => setIsAdding(!isAdding)} className="border border-black text-black px-5 py-2 rounded-md hover:bg-gray-100 transition">
          {isAdding ? 'Cancel' : 'Add New Product'}
        </button>
      </div>
      
      {isAdding && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Add New Product</h2>
          
          <form className="space-y-4">
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
            
            <button type="submit" className="border border-black text-white px-5 py-2 rounded-md bg-black transition">
              Add Product
            </button>
          </form>
        </div>
      )}
      
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
    </div>
  );
};

export default AdminProductManagement;