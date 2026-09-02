import { createBrowserRouter, Navigate } from 'react-router-dom'
import { App } from './App'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { ForgotPasswordPage } from '@/pages/ForgotPassword'
import { Dashboard } from '@/pages/Dashboard'
import { Products } from '@/pages/Products'
import { ProductDetail } from '@/pages/ProductDetailPage'
import { CreateProduct } from '@/pages/CreateProduct'
import { EditProduct } from '@/pages/EditProduct'
import { Orders } from '@/pages/Orders'
import { OrderDetail } from '@/pages/OrderDetailPage'
import { CreateOrder } from '@/pages/CreateOrder'
import { Reports } from '@/pages/Reports'
import { Profile } from '@/pages/Profile'
import { Settings } from '@/pages/Settings'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

const protectedRoute = (element: React.ReactNode) => (
  <ProtectedRoute>
    <App>{element}</App>
  </ProtectedRoute>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/',
    element: protectedRoute(<Dashboard />),
  },
  {
    path: '/products',
    element: protectedRoute(<Products />),
  },
  {
    path: '/products/new',
    element: protectedRoute(<CreateProduct />),
  },
  {
    path: '/products/:id',
    element: protectedRoute(<ProductDetail />),
  },
  {
    path: '/products/:id/edit',
    element: protectedRoute(<EditProduct />),
  },
  {
    path: '/orders',
    element: protectedRoute(<Orders />),
  },
  {
    path: '/orders/new',
    element: protectedRoute(<CreateOrder />),
  },
  {
    path: '/orders/:id',
    element: protectedRoute(<OrderDetail />),
  },
  {
    path: '/reports',
    element: protectedRoute(<Reports />),
  },
  {
    path: '/profile',
    element: protectedRoute(<Profile />),
  },
  {
    path: '/settings',
    element: protectedRoute(<Settings />),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])