import { getDoctor, updateDoctor } from '@/api/doctor'
import { useAuth } from '@/hooks/auth'
import { UpdateDoctorRequest } from 'clinic-common/types/doctor.types'
import { UpdateDoctorRequestValidator } from 'clinic-common/validators/doctor.validator'
import { ApiForm } from '@/components/ApiForm'

export function UpdateProfile() {
  const { user } = useAuth()

  return (
    <ApiForm<UpdateDoctorRequest>
      fields={[
        { label: 'Email', property: 'email' },
        { label: 'Hourly Rate', property: 'hourlyRate', valueAsNumber: true },
        { label: 'Affiliation', property: 'affiliation' },
      ]}
      validator={UpdateDoctorRequestValidator}
      initialDataFetcher={() => getDoctor(user!.username)}
      queryKey={['doctors', user!.username]}
      successMessage="Updated doctor successfully."
      action={(data) => updateDoctor(user!.username, data)}
    />
  )
}
