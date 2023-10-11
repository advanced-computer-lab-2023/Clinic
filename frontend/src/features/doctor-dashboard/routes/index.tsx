import { RouteObject } from 'react-router-dom'
import { DoctorDashboardLayout } from '../components/DoctorDashboardLayout'
import { DoctorDashboardHome } from './DoctorDashboardHome'
import { UpdateProfile } from './UpdateProfile'
import { Appointments } from '@/features/patient-dashboard/routes/Appointments'

import { ViewPatients } from './ViewPatients'
export const doctorDashboardRoutes: RouteObject[] = [
  {
    element: <DoctorDashboardLayout />,
    children: [
      {
        path: '',
        element: <DoctorDashboardHome />,
      },

      {
        path: 'profile',
        element: <UpdateProfile />,
      },
      {
        path: 'appointments',
        element: <Appointments />,
      },{
        path: 'view-patients',
        element: <ViewPatients />,
      }
    ],
  },
]
