import { ApiForm } from '@/components/ApiForm'
import { register } from '@/api/auth'
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
            { key: 'Male', value: 'male' },
            { key: 'Female', value: 'female' },
            { key: 'Other', value: 'other' },
          ],
        },
        {
          label: 'Emergency',
          property: 'gender',
          customComponent: () => {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                Emergency Contact
              </div>
            )
          },
        },
        {
          label: 'name',
          property: 'emergencyContact.name',
        },
        {
          label: 'mobileNumber',
          property: 'emergencyContact.mobileNumber',
          customError: 'Mobile number must be 10 digits.',
        },
      ]}
      validator={RegisterRequestValidator}
      successMessage="Register successfully."
      action={register}
      onSuccess={() => refreshUser()}
      buttonText="Register"
    />
  )
}
