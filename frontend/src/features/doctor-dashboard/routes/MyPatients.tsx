import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { FilteredList } from '@/components/FilteredList'
import { getPatients } from '@/api/patients'

export function MyPatients() {
  return (
    <FilteredList
      dataFetcher={getPatients}
      filters={[
        {
          label: 'Name',
          property: (v) => v.name,
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'text',
        },
      ]}
      queryKey={['my-patients']}
      component={(patient) => (
        <Grid item xl={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Patient Name
                  </Typography>
                  <Typography variant="body1">{patient.name}</Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Patient Date of Birth
                  </Typography>
                  <Typography variant="body1">{patient.dateOfBirth}</Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Patient Email
                  </Typography>
                  <Typography variant="body1">{patient.email}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}
    />
  )
}
