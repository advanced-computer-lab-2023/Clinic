import { addHealthPackage } from '@/api/healthPackages'
import { ApiForm } from '@/components/ApiForm'
import { createHealthPackageRequest } from 'clinic-common/types/healthPackage.types'
import { CreateHealthPackageRequestValidator } from 'clinic-common/validators/healthPackage.validator'

export function AddHealthPackage({ onSuccess }: { onSuccess: () => void }) {
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
      validator={CreateHealthPackageRequestValidator}
      successMessage="Added health package successfully"
      action={(data) => addHealthPackage(data)}
      onSuccess={onSuccess}
    />
  )
}
