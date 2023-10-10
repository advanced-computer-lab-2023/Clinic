import { getApprovedDoctors } from '@/api/doctor'
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { FilteredList } from '@/components/FilteredList'

export function ApprovedDoctors() {
  return (
    <FilteredList
      dataFetcher={getApprovedDoctors}
      filters={[
        {
          label: 'Doctor Name',
          property: (v) => v.name,
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'text',
        },
        {
          label: 'Doctor Speciality',
          property: (v) => v.speciality,
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'text',
        },
        {
          label: 'Available Times',
          property: (v) => v.availableTimes,
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'text',
        },
      ]}
      queryKey={['approved-doctors']}
      component={(doctor) => (
        <Grid item xl={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Doctor Name
                  </Typography>
                  <Typography variant="body1">{doctor.name}</Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Doctor Speciality
                  </Typography>
                  <Typography variant="body1">{doctor.speciality}</Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Available Times
                  </Typography>
                  <Typography variant="body1">
                    {doctor.availableTimes}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}
    />
  )
}
