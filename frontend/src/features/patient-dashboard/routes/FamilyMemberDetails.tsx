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
          /*{
            label: 'Health Package',
            value:
              query.data?.familyMember.healthPackage.name ||
              'No health package yet',
          },
          {
            label: 'Renewal Date',
            value: query.data?.familyMember.healthPackage.renewalDate || '',
          },
          {
            label: 'Cancelled Health Packages',
            value:
              query.data?.familyMember.healthPackageHistory
                ?.map(
                  (historyEntry) =>
                    `${historyEntry.package} was cancelled on (${historyEntry.date})`
                )
                .join(', ') || 'No cancelled health packages yet',
          },*/
        ]}
      />
    </Grid>
  )
}
