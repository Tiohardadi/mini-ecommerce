import axios from 'axios'

const API_URL = ' http://localhost:3004'

export const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password })
      return {
        user: response.data.user,
        token: response.data.accessToken,
        userId: response.data.user.id
      }
    } catch (error) {
      throw new Error('Invalid email or password')
    }
  }
  

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, role: 'customer' })
    return {
      user: response.data.user,
      token: response.data.accessToken
    }
  } catch (error) {
    throw new Error('Registration failed')
  }
}

// ✅ Fungsi baru registerUser
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, role: 'customer' })
    return {
      user: response.data.user,
      token: response.data.accessToken
    }
  } catch (error) {
    throw new Error('Registration failed || Email is already registered')
  }
}

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    throw new Error('No token found')
  }
  
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    return response.data
  } catch (error) {
    throw new Error('Failed to get current user')
  }
}