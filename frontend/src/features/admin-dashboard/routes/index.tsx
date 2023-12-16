import { RouteObject } from 'react-router-dom'
import { AdminDashboardLayout } from '../components/AdminDashboardLayout'
import { AdminDashboardHome } from './AdminDashboardHome'
import { PendingDoctors } from './PendingDoctors'
import { HealthPackages } from './HealthPackages'
import { AddHealthPackage } from './AddHealthPackage'
import { UpdateHealthPackage } from './UpdateHealthPackage'
import { AddAdmin } from '@/features/admin-dashboard/routes/AddAdmin'
import { Users } from './Users'
import { PendingDoctorDetails } from './PendingDoctorDetails'
import ChangePassword from '@/features/auth/routes/ChangePassword'

// eslint-disable-next-line react-refresh/only-export-components
const RedirectToPharmacy = () => {
  const token = localStorage.getItem('token')

  window.location.href = `http://localhost:5174/admin-dashboard?token=${token}`

  return null // This component doesn't render anything, it just redirects
}

export const adminDashboardRoutes: RouteObject[] = [
  {
    element: <AdminDashboardLayout />,
    children: [
      {
        path: '',
        element: <AdminDashboardHome />,
      },
      {
        path: 'change-password',
        element: <ChangePassword />,
      },

      {
        path: 'pending-doctors',
        element: <PendingDoctors />,
      },
      {
        path: 'pending-doctors/:username',
        element: <PendingDoctorDetails />,
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
        path: 'update-health-package/:id',
        element: <UpdateHealthPackage />,
      },
      {
        path: 'add-admin',
        element: <AddAdmin />,
      },
      {
        path: 'add-admin',
        element: <AddAdmin />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'pharmacy',
        element: <RedirectToPharmacy />,
      },
    ],
  },
]
