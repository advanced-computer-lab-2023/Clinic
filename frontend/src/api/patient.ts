import {
  APatientResponseBase,
  GetMyPatientsResponse,
} from 'clinic-common/types/patient.types'
import { api } from '.'

export async function viewPatients(): Promise<
  GetMyPatientsResponse['patients']
> {
  return await api
    .get<GetMyPatientsResponse>('/patients/myPatients')
    .then((res) => {
      console.log('res.data', res.data)
      return res.data
    })
}

export async function searchByName(
  name: string
): Promise<GetMyPatientsResponse['patients']> {
  return await api
    .get<GetMyPatientsResponse>(`/patients/search?name=${name}`)
    .then((res) => res.data.patients)
}

export async function filterPatients(): Promise<
  GetMyPatientsResponse['patients']
> {
  return await api
    .post<GetMyPatientsResponse>('/patients/filter')
    .then((res) => {
      return res.data
    })
}

export async function getPatient(
  id: string
): Promise<APatientResponseBase['patients']> {
  return await api.get<APatientResponseBase>('/patients/' + id).then((res) => {
    console.log(res.data + 'getPatient' + id)
    return res.data
  })
}
