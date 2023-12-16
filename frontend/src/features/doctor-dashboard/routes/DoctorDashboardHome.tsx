import { getDoctor, getWalletMoney } from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'
import { ContractStatus } from 'clinic-common/types/doctor.types'

import { Copyright } from '@mui/icons-material'
import {
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import Chart from '../components/Chart'

import Deposits from '../components/Deposits'
import { useEffect } from 'react'
import EmploymentContract from './EmploymentContract'
import { getAppointments } from '@/api/appointments'
import { useNavigate } from 'react-router-dom'
import Title from '../components/Title'

export function DoctorDashboardHome() {
  const { user } = useAuth()
  const doctorQuery = useQuery({
    queryFn: () => getDoctor(user!.username),
  })

  const appointmentsQuery = useQuery({
    queryKey: ['get-appointments'],
    queryFn: () => getAppointments(),
  })

  const navigate = useNavigate()

  const walletQuery = useQuery({
    queryKey: ['get-wallet-money'],
    queryFn: () => getWalletMoney(user!.username),
  })

  useEffect(() => {
    console.log(doctorQuery.data)

    console.log(walletQuery.data)
  }, [doctorQuery.data, walletQuery.data])

  if (doctorQuery.isLoading) {
    return <CardPlaceholder />
  }

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

  return (
    <>
      {doctorQuery.data?.contractStatus === ContractStatus.Pending && (
        <div>
          <div>
            <h1>
              Your Request is approved please review your employment contract.
            </h1>
          </div>
          <div>
            <EmploymentContract />
          </div>
        </div>
      )}
      {doctorQuery.data?.contractStatus === ContractStatus.Rejected && (
        <div>
          <h1>Sorry, but you have rejected your employment contract!</h1>
        </div>
      )}
      {doctorQuery.data?.contractStatus === ContractStatus.Accepted && (
        <div>
          <h1>Recent Activity Dashboard</h1>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart
                    availableTimeSlots={doctorQuery.data?.availableTimes}
                  />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Deposits wallet={walletQuery?.data?.money} />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Title>Today's Appointments</Title>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Patient Name</strong>
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
                          <TableCell>
                            {' '}
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => {
                                navigate(
                                  `/doctor-dashboard/patient/${appointment.patientID}`
                                )
                              }}
                            >
                              View Patient
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </div>
      )}
    </>
  )
}
