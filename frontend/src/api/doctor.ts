import {
  AcceptOrRejectContractResponse,
  AddAvailableTimeSlotsRequest,
  AddAvailableTimeSlotsResponse,
  GetApprovedDoctorResponse,
  GetApprovedDoctorsResponse,
  GetDoctorResponse,
  GetPendingDoctorsResponse,
  GetWalletMoneyResponse,
  UpdateDoctorRequest,
  UpdateDoctorResponse,
} from 'clinic-common/types/doctor.types'
import { GetFollowupRequestsResponse } from 'clinic-common/types/appointment.types'
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
    .then((res) => {
      console.log(res.data + 'getWalletMoney' + username)

      return res.data
    })
}

export async function getFollowupRequests(): Promise<GetFollowupRequestsResponse> {
  return await api
    .get<GetFollowupRequestsResponse>('/doctors/followupRequests')
    .then((res) => res.data)
}
