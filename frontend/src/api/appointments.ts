import { GetFilteredAppointmentsResponse } from 'clinic-common/types/appointment.types'
import { api } from '.'

export async function getAppointments(): Promise<
  GetFilteredAppointmentsResponse['appointments']
> {
  return await api
    .get<GetFilteredAppointmentsResponse>(`/appointment/filter`)
    .then((res) => res.data.appointments)
}

export async function reserveTimes(
  doctorid: string,
  date: Date | null,
  familyID: string,
  reservedFor: string,
  toPayUsingWallet: number
) {
  const response = await api.post('/appointment/makeappointment', {
    doctorid,
    date,
    familyID,
    reservedFor,
    toPayUsingWallet,
  })

  return response
}

export async function cancelAppointment(appointmentId: string) {
  const response = await api
    .delete(`/appointment/delete/${appointmentId}`)
    .then((res) => res.data)
    .catch((err) => err)

  return response
}

export async function reschedule(appointment: any, rescheduleDate: any) {
  return await api.post(`/appointment/reschedule`, {
    appointment,
    rescheduleDate,
  })
}
