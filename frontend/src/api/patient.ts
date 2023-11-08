import {
  GetAPatientResponse,
  GetMyPatientsResponse,
  GetWalletMoneyResponse,
} from 'clinic-common/types/patient.types'
import { api } from '.'

export async function viewPatients(): Promise<
  GetMyPatientsResponse['patients']
> {
  return await api
    .get<GetMyPatientsResponse>('/patients/myPatients')
    .then((res) => {
      console.log('res.data', res.data)

      return res.data.patients
    })
}

export async function searchByName(
  name: string
): Promise<GetMyPatientsResponse['patients']> {
  return await api
    .get<GetMyPatientsResponse['patients']>(`/patients/search?name=${name}`)
    .then((res) => res.data)
}

export async function filterPatients(): Promise<
  GetMyPatientsResponse['patients']
> {
  return await api
    .post<GetMyPatientsResponse>('/patients/filter')
    .then((res) => {
      return res.data.patients
    })
}

export async function getPatient(id: string): Promise<GetAPatientResponse> {
  return await api.get<GetAPatientResponse>('/patients/' + id).then((res) => {
    console.log(res.data + 'getPatient' + id)

    return res.data
  })
}

export async function getWalletMoney(username: string): Promise<GetWalletMoneyResponse> {
  return await api.get<GetWalletMoneyResponse>('/patients/wallet/' + username).then((res) => {
    console.log(res.data + 'getWalletMoney' + username)

    return res.data
  })
} 
