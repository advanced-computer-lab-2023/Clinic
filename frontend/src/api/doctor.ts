import {
  AcceptOrRejectContractResponse,
  AddAvailableTimeSlotsRequest,
  AddAvailableTimeSlotsResponse,
  GetApprovedDoctorResponse,
  GetApprovedDoctorsResponse,
  GetDoctorResponse,
  GetDoctorsForPatientsRequest,
  GetDoctorsForPatientsResponse,
  GetPendingDoctorsResponse,
  GetWalletMoneyResponse,
  UpdateDoctorRequest,
  UpdateDoctorResponse,
} from 'clinic-common/types/doctor.types'
import { api } from '.'

export async function updateDoctor(
  username: string,
  req: UpdateDoctorRequest
): Promise<UpdateDoctorResponse> {
  return await api
    .patch<UpdateDoctorResponse>(`/doctors/updateDoctor/${username}`, req)
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

// export async function getUsers

export async function getApprovedDoctors(): Promise<
  GetApprovedDoctorsResponse['doctors']
> {
  return await api
    .get<GetApprovedDoctorsResponse>(`/doctors/approved`)
    .then((res) => res.data.doctors)
}

export async function getApprovedDoctor(
  id: string
): Promise<GetApprovedDoctorResponse> {
  return await api
    .get<GetApprovedDoctorResponse>(`/doctors/approved/${id}`)
    .then((res) => res.data)
}

export async function acceptDoctorRequest(
  id: string
): Promise<UpdateDoctorResponse> {
  return await api
    .patch<UpdateDoctorResponse>(`/doctors/acceptDoctorRequest/${id}`)
    .then((res) => res.data)
}

export async function rejectDoctorRequest(
  id: string
): Promise<UpdateDoctorResponse> {
  return await api
    .patch<UpdateDoctorResponse>(`/doctors/rejectDoctorRequest/${id}`)
    .then((res) => res.data)
}

export async function addAvailableTimeSlots(
  req: AddAvailableTimeSlotsRequest
): Promise<AddAvailableTimeSlotsResponse> {
  return await api
    .patch<AddAvailableTimeSlotsResponse>(`/doctors/addAvailableTimeSlots`, req)
    .then((res) => res.data)
}

export async function acceptEmploymentContract(): Promise<AcceptOrRejectContractResponse> {
  return await api
    .patch<AcceptOrRejectContractResponse>(`/doctors/acceptEmploymentContract`)
    .then((res) => res.data)
}

export async function rejectEmploymentContract(): Promise<AcceptOrRejectContractResponse> {
  return await api
    .patch<AcceptOrRejectContractResponse>(`/doctors/rejectEmploymentContract`)
    .then((res) => res.data)
}

export async function getWalletMoney(
  username: string
): Promise<GetWalletMoneyResponse> {
  return await api
    .get<GetWalletMoneyResponse>('/doctors/wallet/' + username)
    .then((res) => res.data)
}

export async function getDoctorsForPatient(
  params: GetDoctorsForPatientsRequest
): Promise<GetDoctorsForPatientsResponse> {
  return await api
    .post<GetDoctorsForPatientsResponse>('/doctors/for-patient', params)
    .then((res) => res.data)
}

export async function sendDoctorRequest(formData: any) {
  console.log('hi')

  return await api
    .post('/auth/request-doctor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data; ${formData.getBoundary()}', // Axios sets the correct Content-Type header with the boundary.
      },
    })
    .then((res) => {
      return res
    })
}

export async function addHealthRecord(id: any, formData: any) {
  return await api.post(`/patients/uploadHealthRecords/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data; ${formData.getBoundary()}',
    },
  })
}

export async function deleteHealthRecord(id: any, urlToDelete: any) {
  return await api.post(
    `http://localhost:3000/patients/deleteHealthRecord/${id}`,
    { url: urlToDelete }
  )
}

export async function AddNotes(id: any, notes: any) {
  return await api.patch(`/patients/addNote/${id}`, {
    newNote: notes,
  })
}

export async function getMedicalHistory(id: any) {
  return await api.get(`/patients/getMedicalHistory/${id}`)
}

export async function getPrescriptions(username: any) {
  return await api.get(`/prescriptions/${username}`)
}

export async function addPrescriptionApi(
  patient: any,
  medicine: any,
  date: any
) {
  return await api.post(`/prescriptions`, {
    patient,
    medicine,
    date,
  })
}
