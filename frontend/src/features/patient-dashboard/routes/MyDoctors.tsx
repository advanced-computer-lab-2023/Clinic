import { getDoctorsForPatient } from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { ChatButton } from '@/components/chats/ChatButton'
import { useAuth } from '@/hooks/auth'
import {
  Card,
  CardActions,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'

export function MyDoctors() {
  const { user } = useAuth()

  const doctorsQuery = useQuery({
    queryKey: ['my-doctors'],
    queryFn: () =>
      getDoctorsForPatient({
        patientUsername: user!.username,
      }),
  })

  if (doctorsQuery.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <Grid container spacing={2}>
      {doctorsQuery.data?.map((doctor) => (
        <Grid item xs={12} md={12} key={doctor.id}>
          <Card>
            <CardHeader
              title={
                <>
                  <Typography variant="h6" component="div">
                    {doctor.name}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    {doctor.username}
                  </Typography>
                </>
              }
            />
            <CardActions>
              <Stack direction="row" spacing={1}>
                <ChatButton otherUsername={doctor.username} />
              </Stack>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
