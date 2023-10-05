import { RouteObject } from 'react-router-dom'

import { authRoutes } from './features/auth/routes'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <h1>Home</h1>,
  },
  {
    path: '/auth',
    children: authRoutes,
  },
]
