import { getHealthPackage, updateHealthPackage } from '@/api/healthPackages'
import { AlertsBox } from '@/components/AlertsBox'
import { ApiForm } from '@/components/ApiForm'
import { createHealthPackageRequest } from 'clinic-common/types/healthPackage.types'
import { UpdateHealthPackageRequestValidator } from 'clinic-common/validators/healthPackage.validator'
import { useNavigate, useParams } from 'react-router-dom'

export function UpdateHealthPackage() {
  const navigate = useNavigate()
  const { id } = useParams()

  if (id == null) {
    return <AlertsBox />
  }

  return (
    <ApiForm<createHealthPackageRequest>
      initialDataFetcher={() => getHealthPackage(id)}
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
          label: 'Medicine Discount Percentage',
          property: 'medicineDiscount',
          valueAsNumber: true,
        },
        {
          label: 'Family Member Subscribtion Discount Percentage',
          property: 'familyMemberSubscribtionDiscount',
          valueAsNumber: true,
        },
      ]}
      queryKey={['health-packages', id]}
      validator={UpdateHealthPackageRequestValidator}
      successMessage="Updated health package successfully"
      action={(data) => updateHealthPackage(id, data)}
      onSuccess={() => {
        navigate('/admin-dashboard/health-packages')
      }}
    />
  )
}
