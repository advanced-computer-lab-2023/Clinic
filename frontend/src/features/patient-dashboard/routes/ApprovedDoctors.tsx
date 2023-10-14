import { getApprovedDoctors } from '@/api/doctor'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { DateRange, FilteredList } from '@/components/FilteredList'
import { useNavigate } from 'react-router-dom'

export function ApprovedDoctors() {
  const navigate = useNavigate()

  function handleView(id: string) {
    navigate(`/patient-dashboard/view-doctor/${id}`)
  }

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
          label: 'ِAvailable',
          property: (v) => v.availableTimes,
          filter: (actual: [string], required: DateRange) =>
            actual.some((time) => {
              if (required.from && required.to) {
                return (
                  new Date(time).getTime() >= required.from.getTime() &&
                  new Date(time).getTime() <= required.to.getTime()
                )
              }

              if (required.from) {
                return new Date(time).getTime() >= required.from.getTime()
              }

              if (required.to) {
                return new Date(time).getTime() <= required.to.getTime()
              }

              return true
            }),
          type: 'dateRange',
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
                  <Stack spacing={-1}>
                    {doctor.availableTimes
                      .map((data) => new Date(data as string))
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((data, i) => (
                        <Typography variant="body1" key={i}>
                          {new Date(data).toLocaleString()}
                        </Typography>
                      ))}
                  </Stack>
                </Stack>
              </Stack>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    handleView(doctor.id)
                  }}
                >
                  View
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
      )}
    />
  )
}
