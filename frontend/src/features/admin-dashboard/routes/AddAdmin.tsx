import { ApiForm } from '@/components/ApiForm'
import { AddAdminValidator } from 'clinic-common/validators/admin.validation'
import { AddAdminApi } from '@/api/admin'

export function AddAdmin() {
  return (
    <ApiForm
      fields={[
        { label: 'Username', property: 'username' },
        { label: 'Email', property: 'email' },

        { label: 'Password', property: 'password' },
      ]}
      validator={AddAdminValidator}
      successMessage="Register successfully."
      action={AddAdminApi}
      buttonText="Add Admin"
    />
  )
}
