import {
  GetDoctorResponse,
  GetPendingDoctorsResponse,
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

export async function getPendingDoctors(): Promise<GetPendingDoctorsResponse> {
  return await api
    .get<GetPendingDoctorsResponse>(`/doctors/pending`)
    .then((res) => res.data)
}