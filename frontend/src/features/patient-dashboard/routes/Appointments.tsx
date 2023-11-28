import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
} from '@mui/material'
import { DateRange, FilteredList } from '@/components/FilteredList'
import {
  AppointmentResponseBase,
  AppointmentStatus,
} from 'clinic-common/types/appointment.types'
import { cancelAppointment, getAppointments } from '@/api/appointments'
import { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { UserType } from 'clinic-common/types/user.types'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { createFollowup } from '@/api/patient'

export function Appointments() {
  const queryClient = useQueryClient()
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpDateError, setFollowUpDateError] = useState(false)
  const { user } = useAuth()
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleDateError, setRescheduleDateError] = useState(false)
  const navigate = useNavigate()

  async function handleFollowUpButton(doctorID: string, patientID: string) {
    if (followUpDate === '') {
      setFollowUpDateError(true)
      toast.error('Please select a date')
    } else {
      setFollowUpDateError(false)
      await createFollowup(doctorID, patientID, followUpDate)
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

  async function handleRescheduleButton(appointment: AppointmentResponseBase) {
    if (rescheduleDate === '') {
      setRescheduleDateError(true)
      toast.error('Please select a date')
    } else {
      setRescheduleDateError(false)
      await axios
        .post(`http://localhost:3000/appointment/reschedule`, {
          appointment,
          rescheduleDate,
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

  async function handleCancelAppointment(appointmentId: string) {
    try {
      const response = await cancelAppointment(appointmentId)

      if (response) {
        // Handle success, e.g., update the component state or show a message
        toast.success('Appointment canceled successfully')
        navigate('/patient-dashboard/approved-doctors')
      } else {
        // Handle the case where the response is falsy (indicating an error)
        toast.error('Error canceling appointment')
      }
    } catch (error: any) {
      // Handle errors from the API call
      console.error('Error canceling appointment:', error.message)
      toast.error('Error canceling appointment')
    }
  }

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
                  appointment.status !== 'completed' &&
                  appointment.status !== 'cancelled' && (
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleRescheduleButton(appointment)}
                      >
                        Reschedule Appointment
                      </Button>

                      {/* Dropdown for selecting available timings */}
                      <Select
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        displayEmpty
                        error={rescheduleDateError}
                      >
                        <MenuItem value="" disabled>
                          Select Time
                        </MenuItem>
                        {appointment.doctorTimes.map((time) => (
                          <MenuItem key={time} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  )}
                {user?.type === UserType.Doctor &&
                  appointment.status !== 'completed' &&
                  appointment.status !== 'cancelled' && (
                    <Stack spacing={2}>
                      <TextField
                        type="datetime-local"
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        inputProps={{ min: currentDate }}
                        error={rescheduleDateError}
                      />

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleRescheduleButton(appointment)}
                      >
                        Reschedule Appointment
                      </Button>

                      {/* ADD DATE TIME PICKER HERE THAT IS SET TO THE RESCHDULE DATE STATE VARIABLE */}
                    </Stack>
                  )}

                {/* New Cancel Appointment Button */}
                {user &&
                  appointment.status !== 'cancelled' &&
                  appointment.status !== 'completed' && (
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        marginTop: 2,
                      }}
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel Appointment
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
