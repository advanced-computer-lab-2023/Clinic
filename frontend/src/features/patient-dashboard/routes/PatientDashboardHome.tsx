import { getWalletMoney } from '@/api/patient'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'

import { Copyright } from '@mui/icons-material'
import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import Title from '../components/Title'
import Deposits from '../components/Deposits'
import { getPatientByUsername } from '@/api/patient'
import { AllChats } from '@/components/chats/AllChats'
import { TopDoctors } from '../components/TopDoctors'
import { getAppointments } from '@/api/appointments'

export function PatientDashboardHome() {
  const { user } = useAuth()
  const patientQuery = useQuery({
    queryFn: () => getPatientByUsername(user!.username),
  })

  const walletQuery = useQuery({
    queryKey: ['get-wallet-money'],
    queryFn: () => getWalletMoney(user!.username),
  })

  const appointmentsQuery = useQuery({
    queryKey: ['get-appointments-patient'],
    queryFn: () => getAppointments(),
  })

  const filteredAppointments = appointmentsQuery.data?.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    const currentDate = new Date()

    return (
      appointmentDate.getDate() === currentDate.getDate() &&
      appointmentDate.getMonth() === currentDate.getMonth() &&
      appointmentDate.getFullYear() === currentDate.getFullYear() &&
      appointment.status !== 'cancelled'
    )
  })

  if (patientQuery.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <>
      <div>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            paddingBottom={4}
            paddingRight={6}
          >
            <Grid item xs={12} md={4} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 310,
                  borderRadius: '17px',
                  color: 'white ',
                  bgcolor: 'primary.main',
                }}
              >
                <Deposits wallet={walletQuery?.data?.money} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Paper
                sx={{
                  paddingX: 2,
                  paddingY: 1,
                  height: 310,
                  borderRadius: '17px',
                  overflow: 'auto',
                  width: '100%',
                  scrollbarWidth: 'thin', // For Firefox
                  '&::-webkit-scrollbar': {
                    width: '0em', // Set the width of the scrollbar
                  },
                }}
              >
                <AllChats />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Paper
                sx={{
                  paddingX: 2,
                  paddingY: 1,
                  paddingBottom: 2,
                  height: 310,
                  borderRadius: '17px',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <TopDoctors />
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Orders */}
          <Grid
            item
            xs={12}
            paddingLeft={0}
            justifyContent="center"
            paddingBottom={4}
            paddingRight={6}
          >
            <Paper
              sx={{
                m: 0,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: '17px',
              }}
            >
              <Title>Today's Appointments</Title>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Reserved For</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Appointment Time</strong>
                    </TableCell>
                    <TableCell> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments?.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.reservedFor}</TableCell>
                      <TableCell>
                        {new Date(appointment.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </div>
    </>
  )
}
