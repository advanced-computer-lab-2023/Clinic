import { RouteObject } from 'react-router-dom'

// import { Register } from './Register'
import { AuthLayout } from '../components/AuthLayout'
import { Logout } from './Logout'
// import { RequestDoctor } from '@/features/auth/routes/RequestDoctor'
import Signup from './signup'
import SignIn from './SignIn'

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <SignIn />,
      },
      // {
      //   path: 'register',
      //   element: <Register />,
      // },
      {
        path: 'signup',
        element: <Signup />,
      },
    ],
  },
  {
    path: 'logout',
    element: <Logout />,
  },
]
