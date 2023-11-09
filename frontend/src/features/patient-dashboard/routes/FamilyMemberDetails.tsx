import { Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { getFamilyMemberById } from '@/api/familyMembers'
import { DetailsCard } from '@/components/DetailsCard'

export function FamilyMemberDetails() {
  const { id } = useParams()

  const query = useQuery({
    queryKey: ['family-members', id],
    queryFn: () => getFamilyMemberById(id!),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <Grid item xl={3}>
      <DetailsCard
        fields={[
          { label: 'Name', value: query.data?.familyMember.name },
          { label: 'Age', value: query.data?.familyMember.age },
          { label: 'National ID', value: query.data?.familyMember.nationalId },
          { label: 'Gender', value: query.data?.familyMember.gender },
          { label: 'Relation', value: query.data?.familyMember.relation },
          {
            label: 'Related to',
            value: query.data?.patient.name,
          },
          {
            label: 'Health Package',
            value: query.data?.familyMember.healthPackageName,
          }
        ]}
      />
    </Grid>
  )
}
