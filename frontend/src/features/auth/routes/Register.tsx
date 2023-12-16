import { ApiForm } from '@/components/ApiForm'
import { registerPatient } from '@/api/auth'
import { useAuth } from '@/hooks/auth'

import { RegisterRequest } from 'clinic-common/types/auth.types'
import { RegisterRequestValidator } from 'clinic-common/validators/user.validator'
import { Box, Container, Typography } from '@mui/material'

export const Register = () => {
  const { refreshUser } = useAuth()

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>
        </Box>
      </Container>
      <ApiForm<RegisterRequest>
        fields={[
          { label: 'Username*', property: 'username' },
          { label: 'Password*', property: 'password' },
          { label: 'Name*', property: 'name' },
          { label: 'Email*', property: 'email' },
          {
            label: 'Mobile Number*',
            property: 'mobileNumber',
            customError: 'Mobile number must be 11 digits.',
          },
          { label: 'Date of Birth*', property: 'dateOfBirth', type: 'date' },
          {
            label: 'Gender*',
            property: 'gender',
            type: 'select',
            selectedValues: [
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ],
          },
          {
            label: 'Emergency Contact Name*',
            property: 'emergencyContact.fullName',
          },
          {
            label: 'Emergency Contact Relationship*',
            property: 'emergencyContact.relation',
          },
          {
            label: 'Emergency Contact Mobile Number*',
            property: 'emergencyContact.mobileNumber',
            customError: 'Mobile number must be 11 digits.',
          },
        ]}
        validator={RegisterRequestValidator}
        successMessage="Register successfully."
        action={registerPatient}
        onSuccess={() => refreshUser()}
        buttonText="Register"
      />
    </>
  )
}
