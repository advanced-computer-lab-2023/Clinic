import { RouteObject } from 'react-router-dom'
import { AdminDashboardLayout } from '../components/AdminDashboardLayout'
import { AdminDashboardHome } from './AdminDashboardHome'
import { PendingDoctors } from './PendingDoctors'
import { HealthPackages } from './HealthPackages'
import { AddAdmin } from '@/features/admin-dashboard/routes/AddAdmin'
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
<<<<<<< HEAD
        path: 'add-admin',
        element: <AddAdmin />,
=======
        path: 'add-health-package',
        element: <AddHealthPackage />,
>>>>>>> 80afb50 (add-health-package)
      },
      {
        path: 'update-health-package/:id',
        element: <UpdateHealthPackage />,
      },
    ],
  },
]
