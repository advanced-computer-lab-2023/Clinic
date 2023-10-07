import { api } from '.'
import { GetCurrentUserResponse } from '@/types/user.types'
import { LoginRequest, LoginResponse } from '@/types/auth.types'

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return await api
    .post<LoginResponse>('/auth/login', request)
    .then((res) => res.data)
}

export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  return await api
    .get<GetCurrentUserResponse>(`/auth/me`)
    .then((res) => res.data)
}
