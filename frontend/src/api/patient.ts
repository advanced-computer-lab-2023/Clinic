import { GetMyPatientsResponse } from 'clinic-common/types/patient.types'
import { api } from '.'

export async function viewPatients(): Promise<
  GetMyPatientsResponse['patients']
> {
  return await api
    .get<GetMyPatientsResponse>('/doctors/myPatients')
    .then((res) => res.data.patients)
}

export async function searchByName(
  name: string
): Promise<GetMyPatientsResponse['patients']> {
  return await api
    .get<GetMyPatientsResponse>(`/patients/search?name=${name}`)
    .then((res) => res.data.patients)
}
export async function filterPatients(
  ids: string[]
): Promise<GetMyPatientsResponse['patients']> {
  return await api
    .post<GetMyPatientsResponse>('/patients/filter', ids)
    .then((res) => res.data.patients)
}
