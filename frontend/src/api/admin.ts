import { AddAdminRequest } from 'clinic-common/types/admin.types'
import { api } from '@/api/index'

export async function AddAdminApi(request: AddAdminRequest): Promise<void> {
  return await api.post('/admins/', request).then((res) => {
    console.log('admin added successfully', res.data)
  })
}
