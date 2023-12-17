import { getPatient } from '@/api/patient'
import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Card, CardContent, Stack, Typography, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
// import AddIcon from '@mui/icons-material/Add'
// import { useState } from 'react'
// import { toast } from 'react-toastify'
// import { AddNotes } from '@/api/doctor'

export function Patient() {
  // const [showTextField, setShowTextField] = useState(false)
  // const [showButton, setShowButton] = useState(false)

  // const [notes, setNotes] = useState('')

  // const [notesError, setNotesError] = useState(false)

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

  // const handleButtonClick = () => {
  //   setShowTextField(true)
  //   setShowButton(true)
  // }

  // async function submit() {
  //   if (notes === '') {
  //     setNotesError(true)
  //     toast.error('Please enter a health record')
  //   } else {
  //     setNotesError(false)
  //     setShowTextField(false)
  //     setShowButton(false)
  //     await AddNotes(id, notes)
  //       .then(() => {
  //         toast.success('Note added successfully')
  //         query.refetch()
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })

  //     setNotes('')
  //   }
  // }

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
            <Typography
              variant="overline"
              color="text.secondary"
              fontSize={'20px'}
            >
              Email
            </Typography>
            <Typography variant="body1" fontSize={'20px'}>
              {patient.email}
            </Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontSize={'20px'}
            >
              Mobile Number
            </Typography>
            <Typography variant="body1" fontSize={'20px'}>
              {patient.mobileNumber}
            </Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontSize={'20px'}
            >
              Date of Birth
            </Typography>
            <Typography variant="body1" fontSize={'20px'}>
              {new Date(patient.dateOfBirth).toLocaleString()}
            </Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontSize={'20px'}
            >
              Gender
            </Typography>
            <Typography variant="body1" fontSize={'20px'}>
              {patient.gender}
            </Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontSize={'20px'}
            >
              Emergency Contact
            </Typography>
            <Typography variant="body1" fontSize={'20px'}>
              {patient.emergencyContact.name} -{' '}
              {patient.emergencyContact.mobileNumber}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontSize={'20px'}
            >
              Appointments
            </Typography>
            {patient.appointments.appointments.map((appointment) => (
              <Typography
                variant="body1"
                key={appointment.date}
                fontSize={'20px'}
              >
                {`${new Date(appointment.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })} - ${appointment.status}`}
              </Typography>
            ))}
          </Stack>

          {/* <Stack spacing={5}>
            <img
              src={
                'https://images.sampleforms.com/wp-content/uploads/2016/07/pediatric-medical-history-form.jpg'
              }
              className="Screenshot"
              alt="showing screen capture"
            />
          </Stack> */}
          {/* <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Medical Records
              <Button onClick={handleButtonClick}>
                <AddIcon />
              </Button>
            </Typography>

            {patient.notes.map((note) => (
              <Typography variant="body1">{note}</Typography>
            ))}
          </Stack>
          {showTextField && (
            <TextField
              onChange={(e) => setNotes(e.target.value)}
              label="Add health record"
              variant="outlined"
              color="secondary"
              error={notesError}
            />
          )}
          {showButton && (
            <Button type="submit" onClick={submit} variant="contained">
              ADD
            </Button>
          )} */}
          <Link to={'../healthRecords/' + id}>
            <Button variant="contained" fullWidth color="primary">
              Health Records Files
            </Button>
          </Link>
          <Link to={'../Prescriptions/' + patient.username}>
            <Button variant="contained" fullWidth color="primary">
              view Prescriptions
            </Button>
          </Link>
          {/* <Link to={'../medicalHistory/' + id}>
            <Button variant="contained" color="primary">
              Medical History Files
            </Button>
          </Link> */}
        </Stack>
      </CardContent>
    </Card>
  )
}
