import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { Users } from './Users'
import { AddAdmin } from './AddAdmin'
import ChangePassword from '@/features/auth/routes/ChangePassword'
import { Dashboard } from '@mui/icons-material'

export function AdminDashboardHome() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          variant="h2"
          marginBottom={2}
          textAlign="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <Dashboard fontSize="inherit" color="primary" />
          Welcome to your Admin dashboard!
        </Typography>
        <Box
          sx={{
            backgroundColor: 'primary.main',
            height: 5,
            width: 500,
            margin: 'auto',
          }}
        ></Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" marginBottom={2} textAlign="center">
          All Users
        </Typography>
        <Card sx={{ height: 700, overflow: 'scroll' }}>
          <Users />
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={5}>
          <Box>
            <Typography variant="h4" marginBottom={2} textAlign="center">
              Add Admin
            </Typography>
            <AddAdmin />
          </Box>
          <Box>
            <Card>
              <CardContent>
                <ChangePassword />
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  )
}
