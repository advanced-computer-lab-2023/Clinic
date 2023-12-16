import { Chip } from '@mui/material'
import { UserType } from 'clinic-common/types/user.types'

export function UserBadge({
  userType,
  label,
}: {
  userType: UserType
  label: string
}) {
  return (
    <Chip
      color={
        {
          [UserType.Doctor]: 'warning',
          [UserType.Patient]: 'info',
          [UserType.Pharmacist]: 'success',
          [UserType.Admin]: 'error',
        }[userType] as any
      }
      label={label}
    ></Chip>
  )
}
