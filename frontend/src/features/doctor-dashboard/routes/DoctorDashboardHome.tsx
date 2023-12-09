import { getDoctor, getWalletMoney } from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'
import { ContractStatus } from 'clinic-common/types/doctor.types'

import { Copyright } from '@mui/icons-material'
import { Container, Grid, Paper } from '@mui/material'
import Chart from '../components/Chart'
import Orders from '../components/Orders'
import Deposits from '../components/Deposits'
import { useEffect } from 'react'

export function DoctorDashboardHome() {
  const { user } = useAuth()
  const doctorQuery = useQuery({
    queryFn: () => getDoctor(user!.username),
  })

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

  return (
    <>
      {doctorQuery.data?.contractStatus === ContractStatus.Pending && (
        <div>
          <h1>
            Your Request is approved please review your employment contract.
          </h1>
        </div>
      )}
      {doctorQuery.data?.contractStatus === ContractStatus.Rejected && (
        <div>
          <h1>Sorry! But You have rejected your employment contract.</h1>
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
                  <Orders />
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
