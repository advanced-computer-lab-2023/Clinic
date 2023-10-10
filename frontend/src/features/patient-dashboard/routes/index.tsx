import { RouteObject } from 'react-router-dom'
import { PatientDashboardLayout } from '../components/PatientDashboardLayout'
import { PatientDashboardHome } from './PatientDashboardHome'
import { FamilyMembers } from './FamilyMembers'
import { FilteredPrescriptions } from './FilteredPrescriptions'

export const patientDashboardRoutes: RouteObject[] = [
  {
    element: <PatientDashboardLayout />,
    children: [
      {
        path: '',
        element: <PatientDashboardHome />,
      },
      {
        path: 'family-members',
        element: <FamilyMembers />,
      },
      {
        path: 'prescriptions',
        element: <FilteredPrescriptions />,
      },
    ],
  },
]
