import { GetMyPatientsResponse } from 'clinic-common/types/patient.types'
import { api } from '.'

export async function getPatients(): Promise<
  GetMyPatientsResponse['patients']
> {
  return await api
    .get<GetMyPatientsResponse>(`/patients/myPatients`)
    .then((res) => res.data.patients)
}
