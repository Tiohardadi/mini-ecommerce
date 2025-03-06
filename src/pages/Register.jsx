import { useState } from 'react'
import { useNavigate } from 'react-router'
import { registerUser } from '../services/auth'
import { motion } from 'framer-motion'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok!')
      return
    }

    setIsLoading(true)

    try {
      const result = await registerUser(formData.email, formData.password)
      if (result) {
        navigate('/login')
      } else {
        setError('Registration failed')
      }
    } catch (error) {
      setError('Failed to register. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-white">
      <motion.div
        className="bg-white bg-opacity-30 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full max-w-sm border border-white border-opacity-40 transform transition-all duration-500"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 drop-shadow-lg mb-6">Register</h1>

        {error && (
          <motion.div 
            className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div whileFocus={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm focus:shadow-lg"
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm focus:shadow-lg"
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full p-3 border rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm focus:shadow-lg"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className={`w-full text-white font-bold py-3 rounded-lg transition-all shadow-lg ${
              isLoading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 transform duration-150'
            }`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>

        <div className="text-center text-sm text-gray-800 mt-4">
          Already have an account? <a href="/login" className="underline text-blue-600">Login</a>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
