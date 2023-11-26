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
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'

export function Appointments() {
  const queryClient = useQueryClient()
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpDateError, setFollowUpDateError] = useState(false)
  const { user } = useAuth()
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleDateError, setRescheduleDateError] = useState(false)

  async function handleFollowUpButton(doctorID: string, patientID: string) {
    if (followUpDate === '') {
      setFollowUpDateError(true)
      toast.error('Please select a date')
    } else {
      setFollowUpDateError(false)

      await axios
        .post(`http://localhost:3000/appointment/createFollowUp`, {
          doctorID,
          patientID,
          date: followUpDate,
        })
        .then(() => {
          toast.success('Follow-up scheduled successfully')
          queryClient.refetchQueries(['appointments'])
        })
        .catch((err) => {
          toast.error('Error in scheduling follow-up')
          console.log(err)
        })

      setFollowUpDate('')
    }
  }

  async function handleRescheduleButton(
    doctorID: string,
    patientID: string,
    reservedFor: string,
    familyID: string
  ) {
    if (followUpDate === '') {
      setRescheduleDateError(true)
      toast.error('Please select a date')
    } else {
      setRescheduleDateError(false)
      await axios
        .post(`http://localhost:3000/appointment/reschedule`, {
          doctorID,
          patientID,
          date: rescheduleDate,
          reservedFor,
          familyID,
        })
        .then(() => {
          toast.success('Appointment rescheduled successfully')
          queryClient.refetchQueries(['appointments'])
        })
        .catch((err) => {
          toast.error('Error in rescheduling appointment')
          console.log(err)
        })

      setRescheduleDate('')
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
                    {appointment.doctorName}
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
                {user?.type === UserType.Patient &&
                  appointment.status !== 'completed' && (
                    <TextField
                      type="datetime-local"
                      onChange={(e) => {
                        setRescheduleDate(e.target.value)
                      }}
                      inputProps={{ min: currentDate }}
                      error={rescheduleDateError}
                      // disabled={
                      //   !appointment.doctorTimes.includes(
                      //     inputValue
                      //   )
                      // }
                    />
                  )}

                {user?.type === UserType.Patient &&
                  appointment.status !== 'completed' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        handleRescheduleButton(
                          appointment.doctorID,
                          appointment.patientID,
                          appointment.reservedFor,
                          appointment.familyID
                        )
                      }
                    >
                      Reschedule
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
