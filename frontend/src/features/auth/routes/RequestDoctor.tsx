import { ApiForm } from '@/components/ApiForm'
import { requestDoctor } from '@/api/auth'
import { useAuth } from '@/hooks/auth'

import { RegisterDoctorRequestValidator } from 'clinic-common/validators/doctor.validator'
import { RegisterDoctorRequest } from 'clinic-common/types/doctor.types'

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
        { label: 'Hourly Rate', property: 'hourlyRate', valueAsNumber: true },
        { label: 'Affiliation', property: 'affiliation' },
        { label: 'Educational background', property: 'educationalBackground' },
        { label: 'Speciality', property: 'speciality' },
      ]}
      validator={RegisterDoctorRequestValidator}
      successMessage="Register successfully."
      action={requestDoctor}
      onSuccess={() => refreshUser()}
      buttonText="Register"
    />
  )
}
