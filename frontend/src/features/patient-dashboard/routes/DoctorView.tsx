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
  DialogActions,
} from '@mui/material'
import WalletIcon from '@mui/icons-material/Wallet'
import CreditCardIcon from '@mui/icons-material/CreditCard'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { reserveTimes } from '@/api/appointments'
import { toast } from 'react-toastify'
import { getFamilyMembers, getLinkedFamilyMembers } from '@/api/familyMembers'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import Checkout from '@/components/StripeCheckout'
import { DiscountedPrice } from '@/components/DiscountedPrice'

export function DoctorView() {
  // State to manage the modal visibility

  const [isModalOpen, setModalOpen] = useState(false)

  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<
    string | null
  >(null) // state to track the selected person's (me or fam member) id
  const [selectedFamilyMemberName, setSelectedFamilyMemberName] = useState<
    string | null
  >(null)
  const [creditMethod, setCreditMethod] = useState(false)
  const [selectedAFamilyMember, setSelectedAFamilyMember] = useState(false) // state to track if a someone is selected (me or family member)
  const [sessionRate, setSessionRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  // State to track the selected family member for reservation

  const { id } = useParams()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['DoctorView'],
    queryFn: () => getApprovedDoctor(id!),
  })

  const query2 = useQuery({
    queryKey: ['family-members'],
    queryFn: getFamilyMembers,
  })
  const query3 = useQuery({
    queryKey: ['Linked-family-members'],
    queryFn: getLinkedFamilyMembers,
  })
  console.log(query3)

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
      <>
        <Dialog open={isModalOpen} onClose={closeModal}>
          <DialogTitle>Reserve @ time {date?.toLocaleString()}</DialogTitle>
          <DialogContent>
            {/* Button to register for self */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                closeModal()
                setSelectedAFamilyMember(true)
                setSelectedFamilyMemberId('')
                setSelectedFamilyMemberName('')
              }}
            >
              Reserve for self
            </Button>

            {/* Iterate through family members and create cards */}
            {query2.data?.map((familyMember) => (
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
                      closeModal()
                      setSelectedFamilyMemberId(familyMember.id)
                      setSelectedFamilyMemberName(familyMember.name)
                      setSelectedAFamilyMember(true)
                    }}
                  >
                    Reserve for family member
                  </Button>
                </CardActions>
              </Card>
            ))}
            {query3.data?.map((familyMember) => (
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
                      closeModal()
                      setSelectedFamilyMemberId(familyMember.patientId)
                      setSelectedFamilyMemberName(familyMember.name)
                      setSelectedAFamilyMember(true)
                    }}
                  >
                    Reserve for family member
                  </Button>
                </CardActions>
              </Card>
            ))}
          </DialogContent>
        </Dialog>
        <Dialog open={selectedAFamilyMember}>
          <DialogTitle>Payment Methods</DialogTitle>
          <DialogContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <Stack
                direction="row"
                spacing={12}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1rem',
                  marginTop: '1rem',
                  padding: '1rem',
                }}
              >
                <LoadingButton
                  variant="contained"
                  onClick={() => {
                    setLoading(true)
                    reserveTime(
                      date,
                      selectedFamilyMemberName!,
                      selectedFamilyMemberId!,
                      sessionRate!, //amount to pay using wallet
                      sessionRate! // general session rate
                    )
                      .then(() => {
                        setLoading(false)
                        setSelectedAFamilyMember(false)
                      })
                      .catch(() => setLoading(false))
                  }}
                  loading={loading}
                >
                  Wallet
                  <WalletIcon
                    sx={{
                      ml: 1,
                    }}
                  />
                </LoadingButton>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCreditMethod(true)
                    setSelectedAFamilyMember(false)
                  }}
                >
                  Card
                  <CreditCardIcon
                    sx={{
                      ml: 1,
                    }}
                  />
                </Button>
              </Stack>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => {
                setSelectedAFamilyMember(false)
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={creditMethod} onClose={() => setCreditMethod(false)}>
          <DialogTitle>
            {' '}
            {
              /* create a loading spinner */
              loading ? <LoadingButton loading={true}></LoadingButton> : null
            }
            {!loading ? (
              <Checkout
                handleSubmit={() => {
                  console.log('handleSubmit')
                  setLoading(true)
                  reserveTime(
                    date,
                    selectedFamilyMemberName!,
                    selectedFamilyMemberId!,
                    0, //amount to pay using wallet
                    sessionRate! // general session rate
                  )
                    .then(() => {
                      setCreditMethod(false)
                      setLoading(false)
                    })
                    .catch(() => {
                      setLoading(false)
                    })
                }}
              />
            ) : null}
          </DialogTitle>
        </Dialog>
      </>
    )
  }

  const reserveTime = async (
    selectedTime: Date | null,
    familyName: string,
    selectedFamilyMember: string,
    payUsingWallet: number,
    sessionPrice: number
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
            familyName,
            payUsingWallet,
            sessionPrice
          )
        }
        // Check if id is defined
        else {
          response = await reserveTimes(
            id,
            selectedTime,
            '',
            'Me',
            payUsingWallet,
            sessionPrice
          )
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

      toast.error(`Error reserving appointment.`, {
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
                <Stack spacing={-1}>
                  {query.data?.availableTimes
                    .map((data) => new Date(data))
                    .filter((data) => data.getTime() > Date.now())
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((data, i) => (
                      <Typography variant="body1" key={i}>
                        {new Date(data).toLocaleString()}
                      </Typography>
                    ))}
                </Stack>
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
                  Session Rate <small>(Markup + Discount If Any)</small>
                </Typography>
                <Typography variant="body1">
                  <DiscountedPrice
                    discountedPrice={query.data!.sessionRate}
                    originalPrice={query.data!.hourlyRateWithMarkup}
                  />
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
                        setSessionRate(query.data?.sessionRate)
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
