import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { login } from '@/api/auth'
import { toast } from 'react-toastify'
import { LoginRequestValidator } from 'clinic-common/validators/user.validator'
import { useAuth } from '@/hooks/auth'
import { Favorite } from '@mui/icons-material'
import { Paper } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useCustomTheme } from '@/providers/ThemeContext'
import { useAlerts } from '@/hooks/alerts'

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      Built with <Favorite sx={{ fontSize: 12 }} color="error" /> by{' '}
      <Link color="inherit" href="https://github.com/features/copilot">
        Copilot and Sons
      </Link>{' '}
      &copy; {new Date().getFullYear()}.
    </Typography>
  )
}

export default function SignIn() {
  const { refreshUser } = useAuth()
  const [loading, setLoading] = React.useState(false)
  const { setFontSize, setIsDarkMode } = useCustomTheme() // Now you can access these values and setters
  const { addAlert } = useAlerts()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const data = new FormData(event.currentTarget)

    const username = data.get('username') as string | null
    const password = data.get('password') as string | null

    if (username !== null && password !== null) {
      const requestData = { username, password }

      try {
        const validatedData = LoginRequestValidator.parse(requestData) // Validate using Zod

        const response = await login(validatedData)
        console.log(response)

        if (response.token) {
          refreshUser() // Call the refreshUser function to update the user information
        }
        // Handle the response from the API as needed
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CssBaseline />
      <Paper
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 5,
          width: 500,
        }}
        elevation={2}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            color="secondary"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            color="secondary"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link
                href={'/forgot-password'}
                variant="body2"
                color="text.primary"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="./signup" variant="body2" color="text.primary">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Box>
      <button
        onClick={() => {
          setFontSize(20) // Set the font size to 20 pixels
          setIsDarkMode(true) // Set the dark mode to true (dark mode enabled
          addAlert({
            message: 'Take a break, Its late at night',
            severity: 'info',
            scope: 'global',
            temporary: true,
            duration: 3000,
          })
        }}
      >
        {' '}
        CLICKKKKKKKKKKKK MEEEEEEEEEEEEEE
      </button>
    </Container>
  )
}
