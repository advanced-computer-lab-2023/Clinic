import { updateHealthPackage } from '@/api/healthPackages'
import { AlertsBox } from '@/components/AlertsBox'
import { ApiForm } from '@/components/ApiForm'
import { createHealthPackageRequest } from 'clinic-common/types/healthPackage.types'
import { UpdateHealthPackageRequestValidator } from 'clinic-common/validators/healthPackage.validator'
import { useNavigate, useParams } from 'react-router-dom'

export function UpdateHealthPackage() {
  const navigate = useNavigate()
  const { id } = useParams()
  console.log(id)
  if (id == null) {
    return <AlertsBox />
  }
  return (
    <ApiForm<createHealthPackageRequest>
      fields={[
        { label: 'Name', property: 'name' },
        {
          label: 'Price Per Year',
          property: 'pricePerYear',
          valueAsNumber: true,
        },
        {
          label: 'Session Discount Percentage',
          property: 'sessionDiscount',
          valueAsNumber: true,
        },
        {
          label: 'medicine Discount Percentage',
          property: 'medicineDiscount',
          valueAsNumber: true,
        },
        {
          label: 'Family Member Subscribtion Discount Percentage',
          property: 'familyMemberSubscribtionDiscount',
          valueAsNumber: true,
        },
      ]}
      validator={UpdateHealthPackageRequestValidator}
      successMessage="Updated health package successfully"
      action={(data) => updateHealthPackage(id, data)}
      onSuccess={() => {
        navigate('/admin-dashboard/health-packages')
      }}
    />
  )
}
