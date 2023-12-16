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
    return res.data
  })
}

export async function getPatientByUsername(
  username: string
): Promise<GetAPatientResponse> {
  return await api
    .get<GetAPatientResponse>('/patients/username/' + username)
    .then((res) => {
      return res.data
    })
}

export async function getWalletMoney(
  username: string
): Promise<GetWalletMoneyResponse> {
  return await api
    .get<GetWalletMoneyResponse>('/patients/wallet/' + username)
    .then((res) => {
      return res.data
    })
}

export async function getPatientHealthRecords() {
  return await api.get('/patients/viewHealthRecords/me').then((res) => {
    return res.data
  })
}

export async function getMyMedicalHistory() {
  return await api.get('/patients/viewMedicalHistory').then((res) => {
    return res.data
  })
}

export async function getPatientHealthRecordsFiles(id: string) {
  return await api
    .get(`/patients/viewHealthRecords/Files/${id}`)
    .then((res) => {
      return res.data
    })
}

export async function getMyHealthRecordsFiles() {
  return await api.get(`/patients/viewHealthRecordsFiles`).then((res) => {
    return res.data
  })
}

export async function createFollowup(
  doctorID: any,
  patientID: any,
  followUpDate: any,
  appointmentID: any
) {
  return await api.post(`/appointment/createFollowUp`, {
    appointment: {
      doctorID,
      patientID,
      date: followUpDate,
    },
    appointmentID,
  })
}

export async function deleteMedicalHistory(urlToDelete: any) {
  return await api.post('/patients/deleteMedicalHistory/mine', {
    url: urlToDelete,
  })
}

export async function addMedicalHistory(formData: any) {
  return await api.post('/patients/uploadMedicalHistory/mine', formData, {
    headers: {
      'Content-Type': 'multipart/form-data; ${formData.getBoundary()}',
    },
  })
}

export async function requestFollowup(
  appointmentID: string,
  followUpDate: string
) {
  return await api.post(`/appointment/requestFollowUp`, {
    appointmentID,
    date: followUpDate,
  })
}

export async function checkForFollowUp(appointmentID: string) {
  try {
    const response = await api.get(
      `/appointment/checkFollowUp/${appointmentID}`
    )

    return response.data
  } catch (error) {
    console.error('Error checking follow-up', error)

    return { exists: false }
  }
}
