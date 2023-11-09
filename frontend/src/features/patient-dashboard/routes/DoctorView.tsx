import { getApprovedDoctor } from '@/api/doctor'
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
} from '@mui/material'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { reserveTimes } from '@/api/appointments'
import { toast } from 'react-toastify'

export function DoctorView() {
  const { id } = useParams()
  const queryClient = useQueryClient()
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

  const reserveTime = async (selectedTime: string) => {
    try {
      if (id) {
        // Check if id is defined
        const response = await reserveTimes(id, selectedTime)

        if (response.status === 201) {
          // Handle successful reservation, if needed

          toast.success('Appointment reserved successfully.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'light',
          })
          queryClient.invalidateQueries(['DoctorView'])
        }
      } else {
        toast.error('Doctor ID is undefined. Cannot reserve appointment.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: 'light',
        })
      }
    } catch (error) {
      // Handle errors

      toast.error(`Error reserving appointment ${error}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
      })
    }
  }

  return (
    <>
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
                <Typography variant="body1">
                  {query.data?.speciality}
                </Typography>
              </Stack>
              <Stack spacing={-1}>
                <Typography variant="overline" color="text.secondary">
                  Available Times
                </Typography>
                <Typography variant="body1">
                  {query.data?.availableTimes
                    .map((data) => `${data}`)
                    .join(', ')}
                </Typography>
              </Stack>
              <Stack spacing={-1}>
                <Typography variant="overline" color="text.secondary">
                  Hourly Rate
                </Typography>
                <Typography variant="body1">
                  {query.data?.hourlyRate}
                </Typography>
              </Stack>
              <Stack spacing={-1}>
                <Typography variant="overline" color="text.secondary">
                  Affiliation
                </Typography>
                <Typography variant="body1">
                  {query.data?.affiliation}
                </Typography>
              </Stack>
              <Stack spacing={-1}>
                <Typography variant="overline" color="text.secondary">
                  Educational Background
                </Typography>
                <Typography variant="body1">
                  {query.data?.educationalBackground}
                </Typography>
              </Stack>
              <Stack spacing={-1}>
                <Typography variant="overline" color="text.secondary">
                  Session Rate
                </Typography>
                <Typography variant="body1">
                  {query.data?.sessionRate.toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xl={3} style={{ paddingTop: '16px' }}>
        <Card variant="outlined">
          <CardContent>
            <Typography
              variant="h6"
              align="center"
              style={{ paddingBottom: '5px' }}
            >
              Available Times
            </Typography>
            {query.data?.availableTimes.map((time, index) => (
              <Card key={index} style={{ marginBottom: '16px' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1">
                      {new Date(time).toLocaleString()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => reserveTime(time)}
                    >
                      Reserve Time
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}
