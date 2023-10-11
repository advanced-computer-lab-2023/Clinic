import { ApiForm } from '@/components/ApiForm'
import { AddAdminValidator } from 'clinic-common/validators/admin.validation'
import { AddAdminApi } from '@/api/admin'

export function AddAdmin() {
  return (
    <ApiForm<AddAdminValidator>
      fields={[
        { label: 'Username', property: 'username' },
        { label: 'Password', property: 'password' },
      ]}
      validator={AddAdminValidator}
      successMessage="Register successfully."
      action={AddAdminApi}
      buttonText="Add Admin"
    />
  )
}
