import { getApprovedDoctors, getDoctorsForPatient } from '@/api/doctor'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { DateRange, FilteredList } from '@/components/FilteredList'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DiscountedPrice } from '@/components/DiscountedPrice'
import { VideoCallButton } from '@/components/video-call/VideoCallButton'
import { ChatButton } from '@/components/chats/ChatButton'
import { useAuth } from '@/hooks/auth'

export function ApprovedDoctors() {
  const navigate = useNavigate()
  const { user } = useAuth()

  function handleView(id: string) {
    navigate(`/patient-dashboard/view-doctor/${id}`)
  }

  const doctorsQuery = useQuery({
    queryKey: ['my-doctors'],
    queryFn: () =>
      getDoctorsForPatient({
        patientUsername: user!.username,
      }),
  })

  const specialities = useQuery({
    queryKey: ['specialities'],
    queryFn: () =>
      getApprovedDoctors()
        .then((data) => data.map((v) => v.speciality))
        .then((data) => [...new Set(data)]),
  })

  const isMyDoctor = (id: string) => {
    if (doctorsQuery.data) {
      const doctorFound = doctorsQuery.data.find((doctor) => doctor.id === id)

      return !!doctorFound
    }

    return false
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
          label: 'Search by Doctor Speciality',
          property: (v) => v.speciality,
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'text',
        },
        {
          label: 'Filter by Doctor Speciality',
          property: (v) => v.speciality,
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          selectValues: (specialities.data ?? []).map((v) => ({
            label: v,
            value: v,
          })),
          type: 'select',
        },
        {
          label: 'ِAvailable',
          property: (v) => v.availableTimes,
          filter: (actual: [string], required: DateRange) =>
            actual.some((time) => {
              if (required.from && required.to) {
                return (
                  new Date(time).getTime() >= required.from.getTime() &&
                  new Date(time).getTime() <= required.to.getTime()
                )
              }

              if (required.from) {
                return new Date(time).getTime() >= required.from.getTime()
              }

              if (required.to) {
                return new Date(time).getTime() <= required.to.getTime()
              }

              return true
            }),
          type: 'dateRange',
        },
        // TODO: Fix this before sprint 2
        // {
        //   label:'Session Rate',
        //   property: (v) => v.sessionRate,
        //   filter: (actual: number, required: number) =>
        //     actual <= required,
        //   type: 'text',
        // }
      ]}
      queryKey={['approved-doctors']}
      component={(doctor) => (
        <Grid item xl={3}>
          <Card
            variant="outlined"
            style={{
              height: '350px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CardContent>
              {isMyDoctor(doctor.id) && (
                <div>
                  <h5
                    style={{
                      color: '#1976D2',
                      textAlign: 'center',
                      width: '100%',
                      margin: '10px 0px 10px 0px',
                      fontSize: '18px',
                    }}
                  >
                    YOUR DOCTOR
                  </h5>
                  <hr style={{ opacity: '0.7', marginBottom: '10px' }} />
                </div>
              )}
              <Stack spacing={2}>
                <Stack spacing={-1}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Typography variant="overline" color="text.secondary">
                      Doctor Name
                    </Typography>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <VideoCallButton otherUsername={doctor.username} />
                      {isMyDoctor(doctor.id) && (
                        <ChatButton otherUsername={doctor.username} />
                      )}
                    </div>
                  </div>

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
                    Session Rate <small>(Markup + Discount If Any)</small>
                  </Typography>
                  <Typography variant="body1">
                    <DiscountedPrice
                      discountedPrice={doctor.sessionRate}
                      originalPrice={doctor.hourlyRateWithMarkup}
                    />
                  </Typography>
                </Stack>
              </Stack>
              <CardActions style={{ justifyContent: 'center' }}>
                <Button
                  size="small"
                  onClick={() => {
                    handleView(doctor.id)
                  }}
                >
                  View
                </Button>

                <Stack direction="row" spacing={1}></Stack>
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
      )}
    />
  )
}
