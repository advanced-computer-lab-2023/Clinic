import { RouteObject } from 'react-router-dom'
import { Login } from './Login'
import { Register } from './Register'
import { AuthLayout } from '../components/AuthLayout'
import { Logout } from './Logout'
import { RequestDoctor } from '@/features/auth/routes/RequestDoctor'

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'requestDoctor',
        element: <RequestDoctor />,
      },
    ],
  },
  {
    path: 'logout',
    element: <Logout />,
  },
]
