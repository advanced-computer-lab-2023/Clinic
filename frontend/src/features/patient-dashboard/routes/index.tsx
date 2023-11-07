import { RouteObject } from 'react-router-dom'
import { PatientDashboardLayout } from '../components/PatientDashboardLayout'
import { PatientDashboardHome } from './PatientDashboardHome'
import { FamilyMembers } from './FamilyMembers'
import { FilteredPrescriptions } from './FilteredPrescriptions'
import { ApprovedDoctors } from './ApprovedDoctors'
import { Appointments } from './Appointments'
import { DoctorView } from './DoctorView'
import { FamilyMemberDetails } from './FamilyMemberDetails'
import { PrescriptionView } from './PrescriptionView'
import { SubscribeToHealthPackages } from './SubscribeToHealthPackages'

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
        path: 'family-members/:id',
        element: <FamilyMemberDetails />,
      },
      {
        path: 'prescriptions',
        element: <FilteredPrescriptions />,
      },
      {
        path: 'approved-doctors',
        element: <ApprovedDoctors />,
      },
      {
        path: 'appointments',
        element: <Appointments />,
      },
      {
        path: 'view-doctor/:id',
        element: <DoctorView />,
      },
      {
        path: 'prescriptions/:id',
        element: <PrescriptionView />,
      },

      {
        path: 'health-packages',
        element: <SubscribeToHealthPackages />,
      },
    ],
  },
]
