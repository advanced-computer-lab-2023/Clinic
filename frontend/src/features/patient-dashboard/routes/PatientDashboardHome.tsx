import { getWalletMoney } from '@/api/patient'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'

import { Copyright } from '@mui/icons-material'
import { Container, Grid, Paper } from '@mui/material'
//import Chart from '../components/Chart'
import Orders from '../components/Orders'
import Deposits from '../components/Deposits'
import { getPatientByUsername } from '@/api/patient'

export function PatientDashboardHome() {
  const { user } = useAuth()
  const patientQuery = useQuery({
    queryFn: () => getPatientByUsername(user!.username),
  })

  const walletQuery = useQuery({
    queryKey: ['get-wallet-money'],
    queryFn: () => getWalletMoney(user!.username),
  })

  if (patientQuery.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <>
      <div>
        <h1>Recent Activity Dashboard</h1>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            {/* <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart
                    availableTimeSlots={patientQuery.data?.}
                  />
                </Paper>
              </Grid> */}
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
    </>
  )
}
