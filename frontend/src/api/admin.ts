import {
  AddAdminRequest,
  GetUsersResponse,
} from 'clinic-common/types/admin.types'
import { api } from '@/api/index'

export async function AddAdminApi(request: AddAdminRequest): Promise<void> {
  return await api.post('/admins/', request).then((res) => {
    console.log('admin added successfully', res.data)
  })
}

export async function GetUsersApi(): Promise<GetUsersResponse> {
  return await api.get('/admins/get-users').then((res) => res.data)
}

export async function DeleteUserApi(id: string): Promise<void> {
  return await api
    .delete(`/admins/username/${id}`)
    .then((res) => console.log('user removed successfully', res.data))
}
