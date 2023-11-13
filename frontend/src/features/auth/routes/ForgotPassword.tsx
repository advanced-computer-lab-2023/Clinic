import { useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'
import { api } from '@/api'

interface ForgotPasswordFormValues {
  email: string
}
interface OTPFormValues {
  otp: string
}
interface PasswordFormValues {
  newPassword: string
}

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const navigate = useNavigate()

  const validate = (values: ForgotPasswordFormValues) => {
    const errors: Partial<ForgotPasswordFormValues> = {}

    // Validate Email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    if (!values.email) {
      errors.email = 'Email is required'
    } else if (!emailPattern.test(values.email)) {
      errors.email = 'Invalid email'
    }

    return errors
  }

  const validateOTP = (values: OTPFormValues) => {
    // Validate OTP
    const errors: Partial<OTPFormValues> = {}

    if (!values.otp) {
      errors.otp = 'OTP is required'
    }

    return errors
  }

  const validatePassword = (values: PasswordFormValues) => {
    const errors: Partial<PasswordFormValues> = {}

    if (!values.newPassword) {
      errors.newPassword = 'New password is required'
    }

    return errors
  }

  const handleSubmitEmail = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true)

    try {
      const { data } = await api.post('patients/requestOtp', values)

      if (data.success === 'success') {
        setShowOTPForm(true)
      }

      console.log(data)
    } catch (e) {
      console.log(e)
      toast.error('Mail is not registered', {
        position: 'top-right',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitOTP = async (values: OTPFormValues) => {
    setIsLoading(true)

    try {
      const { data } = await api.post('patients/verifyOtp', {
        email: formik.values.email,
        otp: values.otp,
      })

      if (data.success === 'success') {
        setShowPasswordForm(true)
      }

      console.log(data)
    } catch (e) {
      toast.error('Invalid OTP', {
        position: 'top-right',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitPassword = async (values: PasswordFormValues) => {
    setIsLoading(true)

    try {
      const { data } = await api.put('patients/updatePassword', {
        email: formik.values.email,
        newPassword: values.newPassword,
      })

      console.log(data)

      if (data.success === 'success') {
        toast.success('Password successfully updated', {
          position: 'top-right',
        })
        navigate('/auth/login')
      }
    } catch (error: any) {
      // Using ': any' as a type assertion
      console.log(error.error)
      setPasswordError(error.error)

      if (axios.isAxiosError(error) && error.response) {
        setPasswordError(error.response.data.error)
      } else {
        // console.error('Unexpected error:', (error as Error).message)
      }

      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: { email: '' },
    validate,
    onSubmit: handleSubmitEmail,
  })

  const otpFormik = useFormik({
    initialValues: { otp: '' },
    validate: validateOTP,
    onSubmit: handleSubmitOTP,
  })

  const passwordFormik = useFormik({
    initialValues: { newPassword: '' },
    validate: validatePassword,
    onSubmit: handleSubmitPassword,
  })

  return (
    <>
      <Typography variant="h6">
        {showPasswordForm
          ? 'Please enter your new password'
          : showOTPForm
          ? 'Please enter the verification code sent to your email'
          : 'Please enter your registered mail to reset your password'}
      </Typography>
      <div>
        {showPasswordForm ? (
          <form onSubmit={passwordFormik.handleSubmit}>
            {/* Password Form */}
            <TextField
              type="password"
              label="New Password"
              variant="outlined"
              margin="normal"
              fullWidth
              id="newPassword"
              name="newPassword"
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              value={passwordFormik.values.newPassword}
              placeholder="Enter your new password"
              error={Boolean(
                passwordFormik.errors.newPassword || passwordError
              )}
              helperText={
                passwordFormik.errors.newPassword || passwordError
                  ? passwordFormik.errors.newPassword || passwordError
                  : ''
              }
            />

            {isLoading ? (
              <CircularProgress color="primary" size={24} />
            ) : (
              <Button type="submit" variant="contained" color="primary">
                Set New Password
              </Button>
            )}
          </form>
        ) : showOTPForm ? (
          <form onSubmit={otpFormik.handleSubmit}>
            {/* OTP Form */}
            <TextField
              type="text"
              label="Verification Code"
              variant="outlined"
              margin="normal"
              fullWidth
              id="otp"
              name="otp"
              onChange={otpFormik.handleChange}
              onBlur={otpFormik.handleBlur}
              value={otpFormik.values.otp}
              placeholder="Enter the verification code"
              error={Boolean(otpFormik.errors.otp && otpFormik.touched.otp)}
              helperText={
                otpFormik.errors.otp &&
                otpFormik.touched.otp &&
                otpFormik.errors.otp
              }
            />

            {isLoading ? (
              <CircularProgress color="primary" size={24} />
            ) : (
              <Button type="submit" variant="contained" color="primary">
                Verify Code
              </Button>
            )}
          </form>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            {/* Email Form */}
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
              error={Boolean(formik.errors.email && formik.touched.email)}
              helperText={
                formik.errors.email &&
                formik.touched.email &&
                formik.errors.email
              }
            />

            {isLoading ? (
              <CircularProgress color="primary" size={24} />
            ) : (
              <Button type="submit" variant="contained" color="primary">
                {showOTPForm ? 'Resend Code' : 'Send Code'}
              </Button>
            )}
          </form>
        )}
      </div>
    </>
  )
}
