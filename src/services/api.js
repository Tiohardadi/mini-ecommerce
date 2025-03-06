import axios from 'axios'

const API_URL = 'http://10.50.0.13:3004' // Using the first database server

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Products
export const getProducts = async () => {
  const response = await api.get('/products')
  return response.data
}

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData)
  return response.data
}

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

// Cart
export const getCart = async () => {
  const response = await api.get('/cart?_expand=product')
  return response.data
}

export const addToCart = async (productId, quantity = 1) => {
  // Get current user
  const userResponse = await api.get('/users')
  const userId = userResponse.data.id

  // Check if product already in cart
  const cartResponse = await api.get(`/cart?userId=${userId}&productId=${productId}`)
  
  if (cartResponse.data.length > 0) {
    // Update existing cart item
    const cartItem = cartResponse.data[0]
    const response = await api.patch(`/cart/${cartItem.id}`, {
      quantity: cartItem.quantity + quantity
    })
    return response.data
  } else {
    // Add new cart item
    const response = await api.post('/cart', {
      userId,
      productId,
      quantity
    })
    return response.data
  }
}

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.patch(`/cart/${itemId}`, { quantity })
  return response.data
}

export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`)
  return response.data
}

// Orders
export const getOrders = async () => {
  const response = await api.get('/orders?_expand=product')
  return response.data
}

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData)
  return response.data
}
