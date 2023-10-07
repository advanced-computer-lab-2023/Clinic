import { RouteObject } from 'react-router-dom'

import { authRoutes } from './features/auth/routes'
import { doctorDashboardRoutes } from './features/doctor-dashboard/routes'
import { adminDashboardRoutes } from './features/admin-dashboard/routes'
import { patientDashboardRoutes } from './features/patient-dashboard/routes'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <h1>Home</h1>,
  },

  {
    path: '/doctor-dashboard',
    children: doctorDashboardRoutes,
  },

  {
    path: '/patient-dashboard',
    children: patientDashboardRoutes,
  },

  {
    path: '/admin-dashboard',
    children: adminDashboardRoutes,
  },

  {
    path: '/auth',
    children: authRoutes,
  },
]
