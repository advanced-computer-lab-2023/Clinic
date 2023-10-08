import { useAuth } from '@/hooks/auth'
import { AddFamilyMemberRequest } from 'clinic-common/types/familyMember.types'
import { AddFamilyMemberRequestValidator } from 'clinic-common/validators/familyMembers.validator'
import { addFamilyMember } from '@/api/familyMembers'
import { ApiForm } from '@/components/ApiForm'

export function AddFamilyMember({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth()

  return (
    <ApiForm<AddFamilyMemberRequest>
      fields={[
        { label: 'Name', property: 'name' },
        { label: 'National ID', property: 'nationalId' },
        { label: 'Age', property: 'age', valueAsNumber: true },
        { label: 'Gender', property: 'gender' },
        { label: 'Relation', property: 'relation' },
      ]}
      validator={AddFamilyMemberRequestValidator}
      successMessage="Added family member successfully"
      action={(data) => addFamilyMember(user!.username, data)}
      onSuccess={onSuccess}
    />
  )
}