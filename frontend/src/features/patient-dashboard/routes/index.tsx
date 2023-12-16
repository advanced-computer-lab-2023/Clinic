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
import FileViewer from './ViewFiles'
import ChangePassword from '@/features/auth/routes/ChangePassword'
import { MyDoctors } from './MyDoctors'
import { useEffect } from 'react'


const token = localStorage.getItem('token')

// eslint-disable-next-line react-refresh/only-export-components
const RedirectToPharmacy = () => {
  useEffect(() => {
    // Navigate to the clinic URL
    window.location.href = `http://localhost:5174/patient-dashboard?token=${token}`
  })

  return null // This component doesn't render anything, it just redirects
}

export const patientDashboardRoutes: RouteObject[] = [
  {
    element: <PatientDashboardLayout />,
    children: [
      {
        path: '',
        element: <PatientDashboardHome />,
      },
      {
        path: 'change-password',
        element: <ChangePassword />,
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

      {
        path: 'MyMedicalHistory',
        element: <FileViewer />,
      },
      {
        path: 'my-doctors',
        element: <MyDoctors />,
      },
      {
        path: 'pharmacy',
        element: <RedirectToPharmacy />,
      },
    ],
  },
]
