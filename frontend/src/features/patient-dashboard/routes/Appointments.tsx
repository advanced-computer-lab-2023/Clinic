import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
} from '@mui/material'
import { DateRange, FilteredList } from '@/components/FilteredList'
import { getAppointments } from '@/api/appointments'
import { AppointmentStatus } from 'clinic-common/types/appointment.types'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/auth'
import { UserType } from 'clinic-common/types/user.types'

export function Appointments() {
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpDateError, setFollowUpDateError] = useState(false)
  const { user } = useAuth()
  // console.log(user)
  // console.log(user?.type)
  // console.log(user?.type === UserType.Doctor)

  async function handleFollowUpButton(doctorID: string, patientID: string) {
    //  console.log(followUpDate)
    //   console.log(typeof(followUpDate))
    //  console.log(followUpDate+":00")

    if (followUpDate === '') {
      setFollowUpDateError(true)
      alert('Please select a date')
    } else {
      setFollowUpDateError(false)

      // console.log(typeof(doctorID))
      // console.log(patientID)
      // console.log(followUpDate)
      // console.log(followUpDate.toString())

      await axios
        .post(`http://localhost:3000/appointment/createFollowUp`, {
          doctorID,
          patientID,
          date: followUpDate,
        })
        .then(() => {
          alert('Follow-up scheduled successfully')
        })
        .catch((err) => {
          alert('Error in scheduling follow-up')
          console.log(err)
        })

      setFollowUpDate('')
    }
  }

  const currentDate = new Date().toISOString().slice(0, 16)

  return (
    <FilteredList
      dataFetcher={getAppointments}
      filters={[
        {
          label: 'Date',
          property: (v) => v.date, //will replace with name
          filter: (actual: string, required: DateRange) => {
            if (required.from && required.to) {
              return (
                new Date(actual).getTime() >= required.from.getTime() &&
                new Date(actual).getTime() <= required.to.getTime()
              )
            }

            if (required.from) {
              return new Date(actual).getTime() >= required.from.getTime()
            }

            if (required.to) {
              return new Date(actual).getTime() <= required.to.getTime()
            }

            return true
          },
          type: 'dateRange',
        },
        {
          label: 'Status',
          property: (v) => v.status,
          selectValues: Object.keys(AppointmentStatus).map((key) => ({
            label: key,
            value: key,
          })),
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'select',
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
                    reserved For
                  </Typography>
                  <Typography variant="body1">
                    {appointment.reservedFor}
                  </Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(appointment.date).toLocaleString()}
                  </Typography>
                </Stack>
                <Stack spacing={-1}>
                  <Typography variant="overline" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">{appointment.status}</Typography>
                </Stack>

                {user?.type === UserType.Doctor &&
                  appointment.status === 'completed' && (
                    <TextField
                      type="datetime-local"
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      inputProps={{ min: currentDate }}
                      error={followUpDateError}
                    />
                  )}
                {user?.type === UserType.Doctor &&
                  appointment.status === 'completed' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        handleFollowUpButton(
                          appointment.doctorID,
                          appointment.patientID
                        )
                      }
                    >
                      Schedule Follow-up
                    </Button>
                  )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}
    />
  )
}
