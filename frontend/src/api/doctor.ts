import {
  GetDoctorResponse,
  UpdateDoctorRequest,
  UpdateDoctorResponse,
} from '@/types/doctor.types'
import { api } from '.'

export async function updateDoctor(
  username: string,
  req: UpdateDoctorRequest
): Promise<UpdateDoctorResponse> {
  return await api
    .patch<UpdateDoctorResponse>(`/doctors/${username}`, req)
    .then((res) => res.data)
}

export async function getDoctor(username: string): Promise<GetDoctorResponse> {
  return await api
    .get<GetDoctorResponse>(`/doctors/${username}`)
    .then((res) => res.data)
}
