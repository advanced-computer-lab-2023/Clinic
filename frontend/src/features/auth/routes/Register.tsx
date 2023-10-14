import { ApiForm } from '@/components/ApiForm'
import { registerPatient } from '@/api/auth'
import { useAuth } from '@/hooks/auth'

import { RegisterRequest } from 'clinic-common/types/auth.types'
import { RegisterRequestValidator } from 'clinic-common/validators/user.validator'

export const Register = () => {
  const { refreshUser } = useAuth()
  return (
    <ApiForm<RegisterRequest>
      fields={[
        { label: 'Username', property: 'username' },
        { label: 'Password', property: 'password' },
        { label: 'Name', property: 'name' },
        { label: 'Email', property: 'email' },
        {
          label: 'Mobile Number',
          property: 'mobileNumber',
          customError: 'Mobile number must be 10 digits.',
        },
        { label: 'Date of Birth', property: 'dateOfBirth', type: 'date' },
        {
          label: 'Gender',
          property: 'gender',
          type: 'select',
          selectedValues: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        {
          label: 'Emergency Contact Name',
          property: 'emergencyContact.name',
        },
        {
          label: 'Emergency Contact Mobile Number',
          property: 'emergencyContact.mobileNumber',
          customError: 'Mobile number must be 10 digits.',
        },
      ]}
      validator={RegisterRequestValidator}
      successMessage="Register successfully."
      action={registerPatient}
      onSuccess={() => refreshUser()}
      buttonText="Register"
    />
  )
}
