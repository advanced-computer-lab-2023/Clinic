import { getPatient } from '@/api/patient'
import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export function Patient() {
  const { id } = useParams()
  const query = useQuery({
    queryKey: ['get-patient'],
    queryFn: () => getPatient(id!),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  const patient = query.data

  if (patient == null) {
    return <AlertsBox />
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" color="text.secondary">
              {patient.name}
            </Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{patient.email}</Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Mobile Number
            </Typography>
            <Typography variant="body1">{patient.mobileNumber}</Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography variant="body1">
              {new Date(patient.dateOfBirth).toLocaleString()}
            </Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Gender
            </Typography>
            <Typography variant="body1">{patient.gender}</Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Emergency Contact
            </Typography>
            <Typography variant="body1">
              {patient.emergencyContact.name} -{' '}
              {patient.emergencyContact.mobileNumber}
            </Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Appointments
            </Typography>
            {patient.appointments.appointments.map((appointment) => (
              <Typography variant="body1" key={appointment.date}>
                {`${appointment.date} - ${appointment.status}`}
              </Typography>
            ))}
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Prescriptions
            </Typography>
            {patient.prescriptions.map((prescription) => (
              <Typography variant="body1">
                {`${prescription.medicine} - ${prescription.date.toString()}`}
              </Typography>
            ))}
          </Stack>
          <Stack spacing={5}>
            <img
              src={
                'https://images.sampleforms.com/wp-content/uploads/2016/07/pediatric-medical-history-form.jpg'
              }
              className="Screenshot"
              alt="showing screen capture"
            />
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Medical Records
            </Typography>
            {patient.notes.map((note) => (
              <Typography variant="body1">{note}</Typography>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
