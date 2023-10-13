import { api } from '.'
import {
  GetPrescriptionResponse,
  PrescriptionResponseBase,
} from 'clinic-common/types/prescription.types'

export async function getLoggedInUserPrescriptions(): Promise<
  GetPrescriptionResponse['prescriptions']
> {
  return await api
    .get<GetPrescriptionResponse>(`/prescriptions/mine`)
    .then((res) => res.data.prescriptions)
}

export async function getSinglePrescription(
  id: string
): Promise<PrescriptionResponseBase> {
  return await api
    .get<PrescriptionResponseBase>(`prescriptions/mine/${id}`)
    .then((res) => res.data)
}
