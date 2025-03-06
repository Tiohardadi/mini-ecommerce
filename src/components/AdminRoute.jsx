import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

const AdminRoute = () => {
  const { user, isAdmin } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute