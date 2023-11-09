import { RouteObject } from 'react-router-dom'
import { DoctorDashboardLayout } from '../components/DoctorDashboardLayout'
import { DoctorDashboardHome } from './DoctorDashboardHome'
import { UpdateProfile } from './UpdateProfile'
import { Appointments } from '@/features/patient-dashboard/routes/Appointments'
import { ViewPatients } from './ViewPatients'
import { Patient } from '@/features/doctor-dashboard/routes/Patient'
 FEATURE/add-available-time-slots
import { ViewMyAvailableTimeSlots } from './ViewMyAvailableTimeSlots'

import { Wallet } from './Wallet'
 main

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
      },
      {
        path: 'view-patients',
        element: <ViewPatients />,
      },
      {
        path: 'patient/:id',
        element: <Patient />,
      },
      {
 FEATURE/add-available-time-slots
        path: 'view-my-available-time-slots',
        element: <ViewMyAvailableTimeSlots />,

        path: 'wallet',
        element: <Wallet />,
 main
      },
    ],
  },
]
