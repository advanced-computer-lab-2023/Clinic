import { ApiForm } from '@/components/ApiForm'
import { registerPatient } from '@/api/auth'
import { useAuth } from '@/hooks/auth'

import { RegisterDoctorRequestValidator } from 'clinic-common/validators/doctor.validator'
import { RegisterDoctorRequest } from 'clinic-common/types/doctor.types'
// export const RegisterDoctorRequestValidator = zod.object({
//     username: zod.string().min(3).max(255),
//     password: zod.string().min(6).max(255),
//     name: zod.string().min(3).max(255),
//     email: zod.string().email(),
//     mobileNumber: zod.string().min(10).max(10),
//     dateOfBirth: zod.coerce.date(),
//     hourlyRate: zod.number(),
//     affiliation: zod.string().min(1),
//     educationalBackground: zod.string().min(1),
// })

export const RequestDoctor = () => {
  const { refreshUser } = useAuth()
  return (
    <ApiForm<RegisterDoctorRequest>
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
          label: 'Hourly Rate',
          property: 'hourlyRate',
          type: 'number',
          valueAsNumber: true,
        },
      ]}
      validator={RegisterDoctorRequestValidator}
      successMessage="Register successfully."
      action={registerPatient}
      onSuccess={() => refreshUser()}
      buttonText="Register"
    />
  )
}
