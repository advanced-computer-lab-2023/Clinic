import { RouteObject } from 'react-router-dom'
import { AdminDashboardLayout } from '../components/AdminDashboardLayout'
import { AdminDashboardHome } from './AdminDashboardHome'
import { PendingDoctors } from './PendingDoctors'
import { HealthPackages } from './HealthPackages'
import { AddHealthPackage } from './AddHealthPackage'
import { UpdateHealthPackage } from './UpdateHealthPackage'

export const adminDashboardRoutes: RouteObject[] = [
  {
    element: <AdminDashboardLayout />,
    children: [
      {
        path: '',
        element: <AdminDashboardHome />,
      },

      {
        path: 'pending-doctors',
        element: <PendingDoctors />,
      },
      {
        path: 'health-packages',
        element: <HealthPackages />,
      },
      {
        path: 'add-health-package',
        element: <AddHealthPackage />,
      },
      {
        path: 'update-health-package',
        element: <UpdateHealthPackage />,
      },
    ],
  },
]
