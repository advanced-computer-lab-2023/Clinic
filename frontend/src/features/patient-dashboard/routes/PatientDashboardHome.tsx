import { getWalletMoney } from '@/api/patient'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'

import { Copyright } from '@mui/icons-material'
import { Container, Grid, Paper } from '@mui/material'
import Orders from '../components/Orders'
import Deposits from '../components/Deposits'
import { getPatientByUsername } from '@/api/patient'
import { AllChats } from '@/components/chats/AllChats'
import { TopDoctors } from '../components/TopDoctors'

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
              <Orders />
            </Paper>
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </div>
    </>
  )
}
