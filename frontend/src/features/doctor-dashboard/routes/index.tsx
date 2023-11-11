import { RouteObject } from 'react-router-dom'
import { DoctorDashboardLayout } from '../components/DoctorDashboardLayout'
import { DoctorDashboardHome } from './DoctorDashboardHome'
import { UpdateProfile } from './UpdateProfile'
import { Appointments } from '@/features/patient-dashboard/routes/Appointments'
import { ViewPatients } from './ViewPatients'
import { Patient } from '@/features/doctor-dashboard/routes/Patient'
import { ViewMyAvailableTimeSlots } from './ViewMyAvailableTimeSlots'

import { Wallet } from './Wallet'
import { EmploymentContract } from './EmploymentContract'
import AddHealthRecord from './AddHealthRecord'


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
        path: 'view-my-available-time-slots',
        element: <ViewMyAvailableTimeSlots />,
      },
      {
        path: 'wallet',
        element: <Wallet />,
      },
      {
        path: 'employmentContract',
        element: <EmploymentContract />,
      },
      {
        path: 'healthRecords/:id',
        element: <AddHealthRecord />,
      },
    ],
  },
]
