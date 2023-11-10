import { getApprovedDoctor } from '@/api/doctor'
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CardActions,
} from '@mui/material'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { reserveTimes } from '@/api/appointments'
import { toast } from 'react-toastify'
import { getFamilyMembers } from '@/api/familyMembers'
import { useState } from 'react'

export function DoctorView() {
  // State to manage the modal visibility

  const [isModalOpen, setModalOpen] = useState(false)

  const [selectedTime, setSelectedTime] = useState<Date | null>(null)

  // State to track the selected family member for reservation

  const { id } = useParams()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['DoctorView'],
    queryFn: () => getApprovedDoctor(id!),
  })

  const query2 = useQuery({
    queryKey: ['familyMembers'],
    queryFn: getFamilyMembers,
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  if (query.isError) {
    return <h1>error</h1>
  }

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const renderModalContent = (date: Date | null) => {
    return (
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Reserve @ time {date?.toLocaleString()}</DialogTitle>
        <DialogContent>
          {/* Button to register for self */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              reserveTime(date, '', '')
              closeModal()
            }}
          >
            Register for self
          </Button>

          {/* Iterate through family members and create cards */}
          {query2.data?.familyMembers.map((familyMember) => (
            <Card key={familyMember.id} style={{ marginTop: '16px' }}>
              <CardContent>
                <Typography variant="h6">{familyMember.name}</Typography>
                <Typography variant="subtitle1">
                  {familyMember.relation}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    reserveTime(date, familyMember.name, familyMember.id)
                    closeModal()
                  }}
                >
                  Reserve for family member
                </Button>
              </CardActions>
            </Card>
          ))}
        </DialogContent>
      </Dialog>
    )
  }

  const reserveTime = async (
    selectedTime: Date | null,
    familyName: string,
    selectedFamilyMember: string
  ) => {
    try {
      let response = null
      console.log(selectedFamilyMember)

      if (id) {
        if (selectedFamilyMember !== '') {
          console.log("i'm working somehow")

          response = await reserveTimes(
            id,
            selectedTime,
            selectedFamilyMember,
            familyName
          )
        }
        // Check if id is defined
        else {
          response = await reserveTimes(id, selectedTime, '', 'Me')
        }

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
                      onClick={() => {
                        setSelectedTime(new Date(time))
                        openModal()
                      }}
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

      {/* Render the modal content */}
      {renderModalContent(selectedTime)}
    </>
  )
}
