import { useAuth } from '@/hooks/auth'
import { AddFamilyMemberRequest, LinkFamilyMemberRequest } from 'clinic-common/types/familyMember.types'
import { AddFamilyMemberRequestValidator, LinkFamilyMemberRequestValidator } from 'clinic-common/validators/familyMembers.validator'
import { addFamilyMember, linkFamilyMember } from '@/api/familyMembers'
import { ApiForm } from '@/components/ApiForm'
import { useState } from 'react'
import { LinkFamilyMember } from './LinkFamilyMember'

export function AddFamilyMember({ onSuccess }: { onSuccess: () => void }) {
  const [isLinkingExistingAccount, setIsLinkingExistingAccount] =
    useState(false)
  const { user } = useAuth()
  const handleLinkExistingAccount = () => {
    setIsLinkingExistingAccount(true)
  }
  return (
    <div>
      {(isLinkingExistingAccount==false)&&<ApiForm<AddFamilyMemberRequest>
        fields={[
          { label: 'Name', property: 'name' },
          { label: 'National ID', property: 'nationalId' },
          { label: 'Age', property: 'age', valueAsNumber: true },
          {
            label: 'Gender',
            property: 'gender',
            selectedValues: [
              // TODO: use enum
              {
                label: 'Male',
                value: 'male',
              },
              {
                label: 'Female',
                value: 'female',
              },
            ],
          },
          {
            label: 'Relation',
            property: 'relation',
            selectedValues: [
              // TODO: use enum
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
        validator={AddFamilyMemberRequestValidator}
        successMessage="Added family member successfully"
        action={(data) => addFamilyMember(user!.username, data)}
        onSuccess={onSuccess}
      />}
      {(isLinkingExistingAccount==false)&&<button onClick={handleLinkExistingAccount}>
        Or link existing patient account
      </button>}
      {isLinkingExistingAccount && (
        LinkFamilyMember({ onSuccess: () => alert("Family member linked successfully") })
      )}
    </div>
  )
}
