import { login } from '@/api/auth'
import { useAuth } from '@/hooks/auth'
import { LoginRequest } from '@/types/auth.types'
import { LoginRequestValidator } from '@/validators/user.validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowForward } from '@mui/icons-material'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const Login = () => {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestValidator),
  })

  const { refreshUser } = useAuth()

  const onSubmit = async (data: LoginRequest) => {
    try {
      const res = await login(data)
      console.log(res)
      localStorage.setItem('token', res.token)
      refreshUser()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {!!error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

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
