import { login } from '@/api/auth'
import { useAlerts } from '@/hooks/alerts'
import { useAuth } from '@/hooks/auth'
import { Alert } from '@/providers/AlertsProvider'
import { LoginRequest } from '@/types/auth.types'
import { LoginRequestValidator } from '@/validators/user.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowForward } from '@mui/icons-material'
import { Button, Card, CardContent, Grid, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestValidator),
  })
  const { refreshUser } = useAuth()
  const { addAlert } = useAlerts()
  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: () => {
      refreshUser()
    },
    onError: (e: Error) => {
      addAlert(new Alert(e.message, 'error'))
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutateAsync(data))}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message as string}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message as string}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<ArrowForward />}
                size="large"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  )
}
