import { getApprovedDoctor } from '@/api/doctor'
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { CardPlaceholder } from '@/components/CardPlaceholder'
export function DoctorView() {
  const { id } = useParams()

  const query = useQuery({
    queryKey: ['DoctorView'],
    queryFn: () => getApprovedDoctor(id!),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  if (query.isError) {
    return <h1>error</h1>
  }

  return (
    <Grid item xl={3}>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Doctor Name
              </Typography>
              <Typography variant="body1">{query.data?.name}</Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Doctor Speciality
              </Typography>
              <Typography variant="body1">{query.data?.speciality}</Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Available Times
              </Typography>
              <Typography variant="body1">
                {query.data?.availableTimes.map((data) => `${data}`).join(', ')}
              </Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Hourly Rate
              </Typography>
              <Typography variant="body1">{query.data?.hourlyRate}</Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Affiliation
              </Typography>
              <Typography variant="body1">{query.data?.affiliation}</Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Educational Background
              </Typography>
              <Typography variant="body1">
                {query.data?.educationalBackground}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  )
}
