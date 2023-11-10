import { GetFilteredAppointmentsResponse } from 'clinic-common/types/appointment.types'
import { api } from '.'

export async function getAppointments(): Promise<
  GetFilteredAppointmentsResponse['appointments']
> {
  return await api
    .get<GetFilteredAppointmentsResponse>(`/appointment/filter`)
    .then((res) => res.data.appointments)
}
