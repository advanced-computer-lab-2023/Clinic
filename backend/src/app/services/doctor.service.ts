import type { HydratedDocument } from 'mongoose'
import { DoctorModel } from '../models/doctor.model'
import type { Doctor } from '../types/doctor.types'

export async function getPendingDoctorRequests(): Promise<
  Array<HydratedDocument<Doctor>>
> {
  return await DoctorModel.find({
    requestStatus: 'pending',
  })
}
