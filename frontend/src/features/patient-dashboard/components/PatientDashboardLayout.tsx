import { AuthenticatedRoute } from '@/components/AuthenticatedRoute'
import { useSidebar } from '@/hooks/sidebar'
import { Group, Healing, MedicalInformation } from '@mui/icons-material'
import { UserType } from 'clinic-common/types/user.types'
import { Container } from '@mui/material'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export function PatientDashboardLayout() {
  const { setSidebarLinks } = useSidebar()

  useEffect(() => {
    setSidebarLinks([
      {
        to: '/patient-dashboard/family-members',
        text: 'Family Members',
        icon: <Group />,
      },
      {
        to: '/patient-dashboard/prescriptions',
        text: 'Prescriptions',
        icon: <MedicalInformation />,
      },
      {
        to: '/patient-dashboard/approved-doctors',
        text: 'Doctors',
        icon: <Healing />,
      },
    ])
  }, [setSidebarLinks])

  return (
    <AuthenticatedRoute requiredUserType={UserType.Patient}>
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </AuthenticatedRoute>
  )
}
