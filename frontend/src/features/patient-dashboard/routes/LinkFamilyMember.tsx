import { useAuth } from '@/hooks/auth'
import { LinkFamilyMemberRequest } from 'clinic-common/types/familyMember.types'
import { linkFamilyMember } from '@/api/familyMembers'
import { ApiForm } from '@/components/ApiForm'
import { AddFamilyMemberRequestValidator, LinkFamilyMemberRequestValidator } from 'clinic-common/validators/familyMembers.validator'

export function LinkFamilyMember({ onSuccess }: { onSuccess: () => void }) {
  useAuth()
  return (
    <ApiForm<LinkFamilyMemberRequest>
    fields={[
      { label: 'Email', property: 'email' },
      { label: 'Phone Number', property: 'phonenumber' },
      {
        label: 'Relation',
        property: 'relation',
        selectedValues: [
          {
            label: 'Wife',
            value: 'wife',
          },
          {
            label: 'Husband',
            value: 'husband',
          },
          {
            label: 'Son',
            value: 'son',
          },
          {
            label: 'Daughter',
            value: 'daughter',
          },
        ],
      },
    ]}
      validator={LinkFamilyMemberRequestValidator}
      successMessage="Account linked successfully"
      action={(data) => linkFamilyMember(data)}
      onSuccess={onSuccess}
    />
  )
}
