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
  toPayUsingWallet: number,
  sessionPrice: number
) {
  const response = await api.post('/appointment/makeappointment', {
    doctorid,
    date,
    familyID,
    reservedFor,
    toPayUsingWallet,
    sessionPrice,
  })

  return response
}

export async function cancelAppointment(
  appointmentId: string,
  cancelledByDoctor: boolean
) {
  const response = await api
    .post(`/appointment/delete/${appointmentId}`, {
      cancelledByDoctor,
    })
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
