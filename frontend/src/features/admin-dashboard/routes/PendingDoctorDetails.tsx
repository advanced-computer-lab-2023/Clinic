import { getDoctor } from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { DetailsCard } from '@/components/DetailsCard'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export function PendingDoctorDetails() {
  const { username } = useParams()

  const query = useQuery({
    queryKey: ['pending-doctors', username],
    queryFn: () => getDoctor(username!),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <div>
      <DetailsCard
        fields={[
          { label: 'Name', value: query.data?.name },
          { label: 'Username', value: query.data?.username },
          { label: 'Email', value: query.data?.email },
          { label: 'Affiliation', value: query.data?.affiliation },
          { label: 'Specialization', value: query.data?.speciality },
          {
            label: 'Educational Background',
            value: query.data?.educationalBackground,
          },
          {
            label: 'Date of Birth',
            value:
              query.data &&
              new Date(query.data.dateOfBirth).toLocaleDateString(),
          },
          { label: 'Specialization', value: query.data?.speciality },
          { label: 'Hourly Rate', value: query.data?.hourlyRate },
        ]}
      />
      <div>Documents</div>
      {query.data?.documents?.map((document) => (
        <iframe width="600" height="300" src={document} />
      ))}
    </div>
  )
}
