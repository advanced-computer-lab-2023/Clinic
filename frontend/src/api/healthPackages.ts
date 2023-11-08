import { api } from '.'
import {
  AddHealthPackageResponse,
  GetAllHealthPackagesResponse,
  GetHealthPackageResponse,
  UpdateHealthPackageRequest,
  UpdateHealthPackageResponse,
  createHealthPackageRequest,
} from 'clinic-common/types/healthPackage.types'

export async function getHealthPackages(): Promise<GetAllHealthPackagesResponse> {
  return await api
    .get<GetAllHealthPackagesResponse>(`/health-packages/`)
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

export async function subscribeToHealthPackage(id: string): Promise<void> {

  return await api
    .post<void>(`/health-packages/${id}/subscribe`)
    .then((res) => res.data)
}

export async function unsubscribeToHealthPackage(id: string): Promise<void> {

  return await api
    .post<void>(`/health-packages/${id}/unsubscribe`)
    .then((res) => res.data)
}
