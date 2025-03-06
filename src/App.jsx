import { Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import OrderList from './pages/OrderList'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminProductManagement from './pages/AdminProductManagement'
import { useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Register from './pages/Register'


function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-4 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes for all logged in users */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrderList />} />
          </Route>
          
          {/* Admin only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProductManagement />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App