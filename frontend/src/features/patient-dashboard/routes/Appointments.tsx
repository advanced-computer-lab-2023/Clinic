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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Alert,
  DialogActions,
  Chip,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { DateRange, FilteredList } from '@/components/FilteredList'
import {
  AppointmentResponseBase,
  AppointmentStatus,
} from 'clinic-common/types/appointment.types'
import {
  cancelAppointment,
  getAppointments,
  reschedule,
} from '@/api/appointments'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { UserType } from 'clinic-common/types/user.types'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import {
  checkForFollowUp,
  createFollowup,
  requestFollowup,
} from '@/api/patient'

export function Appointments() {
  const queryClient = useQueryClient()
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpDateError, setFollowUpDateError] = useState(false)
  const { user } = useAuth()
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleDateError, setRescheduleDateError] = useState(false)

  interface FollowUpStatusMap {
    [appointmentId: string]: boolean
  }
  const [followUpStatus, setFollowUpStatus] = useState<FollowUpStatusMap>({})
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [cancelAppointmentId, setCancelAppointmentId] = useState<
    string | null
  >()

  useEffect(() => {
    const fetchAppointmentsAndUpdateStatus = async () => {
      try {
        const appointments = await getAppointments()

        const followUpChecks = appointments.map(async (appointment) => {
          const followUpExists = await checkForFollowUp(appointment.id)

          return { id: appointment.id, exists: followUpExists.exists }
        })

        const results = await Promise.all(followUpChecks)
        const followUpStatusMap = results.reduce<FollowUpStatusMap>(
          (acc, curr) => {
            acc[curr.id] = curr.exists

            return acc
          },
          {}
        )

        setFollowUpStatus(followUpStatusMap)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      }
    }

    fetchAppointmentsAndUpdateStatus()
  }, [])

  async function handleFollowUpButton(
    doctorID: string,
    patientID: string,
    appointmentID: string
  ) {
    if (followUpDate === '') {
      setFollowUpDateError(true)
      toast.error('Please select a date')
    } else {
      setFollowUpDateError(false)
      await createFollowup(doctorID, patientID, followUpDate, appointmentID)
        .then(() => {
          toast.success('Follow-up scheduled successfully')
          queryClient.refetchQueries(['appointments'])
          setFollowUpStatus((prevStatus) => ({
            ...prevStatus,
            [appointmentID]: true,
          }))
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
      await reschedule(appointment, rescheduleDate)
        .then(() => {
          toast.success('Appointment rescheduled successfully')
          queryClient.refetchQueries(['appointments'])
        })
        .catch((err: any) => {
          toast.error('Error in rescheduling appointment')
          console.log(err)
        })

      setRescheduleDate('')
    }
  }

  async function handleRequestFollowUpButton(appointmentID: string) {
    if (followUpDate === '') {
      setFollowUpDateError(true)
      toast.error('Please select a date')
    } else {
      setFollowUpDateError(false)

      await requestFollowup(appointmentID, followUpDate)
        .then(() => {
          toast.success('Follow-up requested successfully')

          // Update the followUpStatus state for this specific appointment
          setFollowUpStatus((prevStatus) => ({
            ...prevStatus,
            [appointmentID]: true,
          }))
        })
        .catch((err) => {
          if (
            err.message.includes(
              'A follow-up request already exists for this appointment'
            )
          ) {
            toast.error('A follow-up request is already submitted')
          } else {
            toast.error('Error in requesting follow-up')
          }

          console.log(err)
        })

      setFollowUpDate('')
    }
  }

  const currentDate = new Date().toISOString().slice(0, 16)

  async function handleCancelAppointment(appointmentId: string) {
    setIsLoading(appointmentId)
    await cancelAppointment(
      appointmentId,
      user?.type === UserType.Doctor ? true : false
    )
      .then(() => {
        setIsLoading(null)
        queryClient.refetchQueries(['appointments'])
        toast.success('Appointment cancelled successfully')
        setCancelAppointmentId(null)
      })
      .catch((err: any) => {
        setIsLoading(null)
        toast.error('Error in canceling appointment')
        console.log(err)
        setCancelAppointmentId(null)
      })
  }

  return (
    <>
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
          <Grid item xl={3} md={4}>
            <Card variant="outlined" style={{ height: '470px' }}>
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
                    <Typography variant="body1">
                      {appointment.status}
                    </Typography>
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

                  {appointment.status === 'cancelled' && (
                    <Chip
                      sx={{ mt: 1 }}
                      color="error"
                      label="cancelled"
                      style={{ marginTop: 40 }}
                    />
                  )}

                  {user?.type === UserType.Doctor &&
                    appointment.status === 'completed' && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleFollowUpButton(
                              appointment.doctorID,
                              appointment.patientID,
                              appointment.id
                            )
                          }
                          disabled={followUpStatus[appointment.id] ?? false}
                        >
                          Schedule Follow-up
                        </Button>
                        {followUpStatus[appointment.id] && (
                          <Typography variant="caption" color="error">
                            A follow-up has already been scheduled or requested.
                          </Typography>
                        )}
                      </>
                    )}

                  {user?.type === UserType.Patient &&
                    appointment.status === 'upcoming' && (
                      <Stack spacing={2}>
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
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleRescheduleButton(appointment)}
                        >
                          Reschedule Appointment
                        </Button>
                      </Stack>
                    )}
                  {user?.type === UserType.Doctor &&
                    appointment.status === 'upcoming' && (
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
                  {user && appointment.status === 'upcoming' && (
                    <LoadingButton
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        marginTop: 2,
                      }}
                      onClick={() => {
                        //setIsLoading(appointment.id)
                        setCancelAppointmentId(appointment.id)
                        // handleCancelAppointment(appointment.id).finally(() =>
                        //   setIsLoading(null)
                        // )
                      }}
                      //loading={isLoading == appointment.id}
                    >
                      Cancel Appointment
                    </LoadingButton>
                  )}

                  {/* {user &&
                    appointment.status === 'upcoming' &&
                    user.type === UserType.Patient && (
                      <Typography variant="caption" color="warning">
                        Appointments cancelled less than 24 hours before their
                        date do not receive a refund. 
                      </Typography>
                    )} */}
                  {user?.type === UserType.Patient &&
                    appointment.status === 'completed' && (
                      <TextField
                        type="datetime-local"
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        inputProps={{ min: currentDate }}
                        error={followUpDateError}
                      />
                    )}

                  {user?.type === UserType.Patient &&
                    appointment.status === 'completed' && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            handleRequestFollowUpButton(appointment.id)
                          }
                          disabled={followUpStatus[appointment.id] ?? false}
                        >
                          Request Follow-up
                        </Button>
                        {followUpStatus[appointment.id] && (
                          <Typography variant="caption" color="error">
                            A follow-up request already submitted.
                          </Typography>
                        )}
                      </>
                    )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      />
      <Dialog
        open={cancelAppointmentId != null}
        onClose={() => setCancelAppointmentId(null)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Alert severity="error">
              Are you sure you want to cancel this appointment?{' '}
              <u>
                This action cannot be undone. Appointments cancelled less than
                24 hours before their date do not receive a refund.
              </u>
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setCancelAppointmentId(null)}>
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading == cancelAppointmentId}
            //loading={handleCancelAppointment.isLoading}
            variant="contained"
            color="error"
            onClick={() => {
              if (cancelAppointmentId) {
                handleCancelAppointment(cancelAppointmentId)
              } else {
                setCancelAppointmentId(null)
              }
            }}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
