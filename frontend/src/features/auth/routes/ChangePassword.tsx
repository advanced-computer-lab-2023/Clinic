import { useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Typography } from '@mui/material'
import { CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import { api } from '@/api'

interface ChangePasswordFormValues {
  oldPassword: string
  newPassword: string
}

export default function ChangePassword({
  onSuccess,
}: {
  onSuccess?: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const navigate = useNavigate()

  const validate = (values: ChangePasswordFormValues) => {
    const errors: Partial<ChangePasswordFormValues> = {}

    if (!values.oldPassword) {
      errors.oldPassword = 'Old password is required'
    }

    if (!values.newPassword) {
      errors.newPassword = 'New password is required'
    }

    return errors
  }

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    setIsLoading(true)

    try {
      const { data } = await api.put('patients/changePassword', values)

      console.log(data)

      if (data.success === 'success') {
        toast.success('Password successfully changed', {
          position: 'top-right',
        })
        navigate('/auth/login')
        onSuccess?.()
      } else {
        console.log('hwere')

        setPasswordError(data.error)
        setIsLoading(false)
      }
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'success' in error &&
        'error' in error
      ) {
        const customError = error as { success: string; error: string }
        setPasswordError(customError.error)
        setIsLoading(false)
      } else {
        setPasswordError('Unexpected error occurred')
        setIsLoading(false)
      }
    }

    setIsLoading(false)
  }

  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '' },
    validate,
    onSubmit: handleSubmit,
  })

  return (
    <>
      <Typography variant="h6">Change Password</Typography>
      <div>
        <form onSubmit={formik.handleSubmit}>
          {}
          <TextField
            type="password"
            label="Old Password"
            variant="outlined"
            margin="normal"
            fullWidth
            id="oldPassword"
            name="oldPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
            placeholder="Enter your old password"
            error={Boolean(formik.errors.oldPassword)}
            helperText={formik.errors.oldPassword || ''}
          />

          {}
          <TextField
            type="password"
            label="New Password"
            variant="outlined"
            margin="normal"
            fullWidth
            id="newPassword"
            name="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            placeholder="Enter your new password"
            error={Boolean(formik.errors.newPassword || passwordError)}
            helperText={
              formik.errors.newPassword || passwordError
                ? formik.errors.newPassword || passwordError
                : ''
            }
          />

          {isLoading ? (
            <CircularProgress color="primary" size={24} />
          ) : (
            <Button type="submit" variant="contained" color="primary">
              Change Password
            </Button>
          )}
        </form>
      </div>
    </>
  )
}
