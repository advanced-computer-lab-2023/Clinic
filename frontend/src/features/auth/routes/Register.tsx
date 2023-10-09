import { ApiForm } from '@/components/ApiForm'
import { login } from '@/api/auth'
import { useAuth } from '@/hooks/auth'

import { RegisterRequest } from 'clinic-common/types/auth.types'
import { RegisterRequestValidator } from 'clinic-common/validators/user.validator'

export const Register = () => {
  const { refreshUser } = useAuth()
  // username: zod.string().min(3).max(255),
  //     password: zod.string().min(6).max(255),
  //     name: zod.string().min(3).max(255),
  //     email: zod.string().email(),
  //     mobileNumber: zod.string().min(10).max(10),
  //     dateOfBirth: zod.coerce.date(),
  //     gender: zod.string().min(3).max(255),
  //     emergencyContact: zod.object({
  //     name: zod.string().min(3).max(255),
  //     mobileNumber: zod.string().min(10).max(10),
  // }),
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
          valueAsNumber: true,
        },
        { label: 'Date of Birth', property: 'dateOfBirth', valueAsDate: true },
      ]}
      validator={RegisterRequestValidator}
      successMessage="Logged in successfully."
      action={login}
      onSuccess={() => refreshUser()}
      buttonText="Login"
    />
  )
}
