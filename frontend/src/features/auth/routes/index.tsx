import { RouteObject } from 'react-router-dom'
import { Login } from './Login'
import { Register } from './Register'

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
]
