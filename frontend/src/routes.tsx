import { RouteObject } from 'react-router-dom'

import { authRoutes } from './features/auth/routes'
import { doctorDashboardRoutes } from './features/doctor-dashboard/routes'
import { adminDashboardRoutes } from './features/admin-dashboard/routes'
import { patientDashboardRoutes } from './features/patient-dashboard/routes'
import { BaseLayout } from './components/BaseLayout'
import { RedirectToDashboard } from './components/RedirectToDashboard'
import ForgotPassword from './features/auth/routes/ForgotPassword'

export const routes: RouteObject[] = [
  {
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <RedirectToDashboard />,
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
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
    ],
  },
]
