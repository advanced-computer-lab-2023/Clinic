import { getPatient } from '@/api/patient'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { DetailsCard } from '@/components/DetailsCard'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'

export function PatientProfile() {
  const { user } = useAuth()

  const query = useQuery({
    queryKey: ['patient', user?.username],
    queryFn: () => getPatient(user!.modelId),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <DetailsCard
      fields={[
        { label: 'Name', value: query.data?.name },
        { label: 'Email', value: query.data?.email },
        {
          label: 'Date of Birth',
          value: new Date(query.data!.dateOfBirth).toLocaleDateString(),
        },
        {
          label: 'Gender',
          value: query.data?.gender,
        },
        {
          label: 'Mobile Number',
          value: query.data?.mobileNumber,
        },
        {
          label: 'Emergency Contact',
          value: query.data?.emergencyContact.name,
        },
        {
          label: 'Number',
          value: query.data?.emergencyContact.mobileNumber,
        },
      ]}
    />
  )
}
