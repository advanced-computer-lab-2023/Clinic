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
import { FilteredList } from '@/components/FilteredList'
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
          label: 'Available Times',
          property: (v) => v.availableTimes,
          filter: (actual: [string], required: string) =>
            actual.some((time) =>
              time.toLowerCase().includes(required.toLowerCase())
            ),
          type: 'text',
        },
        {
          label:'Session Rate',
          property: (v) => v.sessionRate,
          filter: (actual: number, required: number) =>
            actual <= required,
          type: 'text',
        }
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
                    {doctor.availableTimes.map((data) => `${data}`).join(', ')}
                  </Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Session Rate
                  </Typography>
                  <Typography variant="body1">{doctor.sessionRate} E£</Typography>
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
