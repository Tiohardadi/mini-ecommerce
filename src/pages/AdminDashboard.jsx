import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { getProducts, getOrders } from '../services/api'

const AdminDashboard = () => {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          getProducts(),
          getOrders()
        ])
        setProducts(productsData)
        setOrders(ordersData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate some basic stats
  const totalProducts = products.length
  const totalOrders = orders.length
  const outOfStockProducts = products.filter(p => p.stock === 0).length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

  if (isLoading) {
    return <div className="text-center py-10">Loading dashboard data...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats cards */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Products</h3>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold">{outOfStockProducts}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="overflow-auto max-h-80">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-2">#{order.id}</td>
                      <td className="px-4 py-2">{order.product.name}</td>
                      <td className="px-4 py-2 text-right">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Low stock products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Low Stock Products</h2>
            <Link 
              to="/admin/products"
              className="text-blue-600 hover:underline text-sm"
            >
              Manage Products
            </Link>
          </div>
          
          {products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            <div className="overflow-auto max-h-80">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-center">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(product => product.stock < 10)
                    .slice(0, 5)
                    .map(product => (
                      <tr key={product.id} className="border-b">
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-center">
                          <span 
                            className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                              product.stock === 0 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard