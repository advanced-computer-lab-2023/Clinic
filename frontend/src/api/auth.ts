import { api } from '.'
import { GetCurrentUserResponse } from 'clinic-common/types/user.types'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from 'clinic-common/types/auth.types'

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return await api.post<LoginResponse>('/auth/login', request).then((res) => {
    localStorage.setItem('token', res.data.token)

    return res.data
  })
}
export async function register(request: RegisterRequest): Promise<void> {
  console.log(request)
  return await api.post('/auth/register-patient', request).then((res) => {
    localStorage.setItem('token', res.data.token)
  })
}

export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  if (!localStorage.getItem('token')) {
    return Promise.reject('No token found')
  }

  return await api
    .get<GetCurrentUserResponse>(`/auth/me`)
    .then((res) => res.data)
}
