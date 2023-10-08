import { api } from '.'
import { GetPrescriptionResponse } from 'clinic-common/types/prescription.types'

export async function getLoggedInUserPrescriptions(): Promise<
  GetPrescriptionResponse['prescriptions']
> {
  return await api
    .get<GetPrescriptionResponse>(`/prescriptions/mine`)
    .then((res) => res.data.prescriptions)
}
