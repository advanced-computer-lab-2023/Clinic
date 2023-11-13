import { api } from '.'
import {
  AddHealthPackageResponse,
  GetAllHealthPackagesForPatientResponse,
  GetCancelledHealthPackagesForPatientResponse,
  GetSubscribedHealthPackageForPatientRequest,
  GetSubscribedHealthPackageForPatientResponse,
  GetHealthPackageResponse,
  SubscribeToHealthPackageRequest,
  UnsubscribeToHealthPackageRequest,
  UpdateHealthPackageRequest,
  UpdateHealthPackageResponse,
  createHealthPackageRequest,
  GetAllHealthPackagesForPatientRequest,
  GetAllHealthPackagesResponse,
} from 'clinic-common/types/healthPackage.types'

export async function getAllHealthPackagesForPatient(
  params: GetAllHealthPackagesForPatientRequest
): Promise<GetAllHealthPackagesForPatientResponse> {
  return await api
    .post<GetAllHealthPackagesForPatientResponse>(
      `/health-packages/for-patient`,
      params
    )
    .then((res) => res.data)
}

export async function getAllHealthPackages(): Promise<GetAllHealthPackagesResponse> {
  return await api
    .get<GetAllHealthPackagesResponse>(`/health-packages`)
    .then((res) => res.data)
}

export async function getHealthPackage(
  id: string
): Promise<GetHealthPackageResponse> {
  return await api
    .get<GetHealthPackageResponse>(`/health-packages/${id}`)
    .then((res) => res.data)
}

export async function updateHealthPackage(
  id: string,
  req: UpdateHealthPackageRequest
): Promise<UpdateHealthPackageResponse> {
  return await api
    .patch<UpdateHealthPackageResponse>(`/health-packages/${id}`, req)
    .then((res) => res.data)
}

export async function addHealthPackage(
  req: createHealthPackageRequest
): Promise<AddHealthPackageResponse> {
  return await api
    .post<AddHealthPackageResponse>(`/health-packages/`, req)
    .then((res) => res.data)
}

export async function deleteHealthPackage(id: string): Promise<void> {
  await api.delete(`/health-packages/${id}`).then((res) => res.data)
}

// export async function subscribeToHealthPackage(id: string): Promise<void> {
//   return await api
//     .post<void>(`/health-packages/${id}/subscribe`)
//     .then((res) => res.data)
// }

export async function subscribeWalletToHealthPackage(
  params: SubscribeToHealthPackageRequest
): Promise<void> {
  return await api
    .patch<void>(`/health-packages/wallet/subscriptions`, params)
    .then((res) => res.data)
}

export async function subscribeCreditToHealthPackage(
  params: SubscribeToHealthPackageRequest
): Promise<void> {
  return await api
    .patch<void>(`/health-packages/credit-card/subscriptions`, params)
    .then((res) => res.data)
}

export async function unsubscribeToHealthPackage(
  params: UnsubscribeToHealthPackageRequest
): Promise<void> {
  return await api
    .post<void>(`/health-packages/unsubscribe`, params)
    .then((res) => res.data)
}

export async function getSubscribedHealthPackageForPatient(
  params: GetSubscribedHealthPackageForPatientRequest
): Promise<GetSubscribedHealthPackageForPatientResponse> {
  return await api
    .post<GetSubscribedHealthPackageForPatientResponse>(
      `/health-packages/subscribed`,
      params
    )
    .then((res) => res.data)
}

export async function getCancelledHealthPackagesForPatient(params: {
  id: string
  isFamilyMember: boolean
}): Promise<GetCancelledHealthPackagesForPatientResponse> {
  return await api
    .post<GetCancelledHealthPackagesForPatientResponse>(
      `/health-packages/patient-cancelled`,
      params
    )
    .then((res) => res.data)
}

export async function getCanellationDate(
  healthPackageId: string,
  params: { id: string; isFamilyMember: boolean }
): Promise<string> {
  return await api
    .post<string>(
      `/health-packages/cancellation-date/${healthPackageId}`,
      params
    )
    .then((res) => res.data)
}
