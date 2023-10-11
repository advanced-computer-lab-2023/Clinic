import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { FilteredList } from '@/components/FilteredList'
import { getAppointments } from '@/api/appointments'

export function Appointments() {
  return (
    <FilteredList
      dataFetcher={getAppointments}
      filters={[
        {
          label: 'Date',
          property: (v) => v.date, //will replace with name
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'text',
        },
        {
          label: 'Status',
          property: (v) => v.status,
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'text',
        },
      ]}
      queryKey={['appointments']}
      component={(appointment) => (
        <Grid item xl={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Doctor Name
                  </Typography>
                  <Typography variant="body1">
                    {appointment.doctorID}
                  </Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">{appointment.date}</Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">{appointment.status}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}
    />
  )
}
