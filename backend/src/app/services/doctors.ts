import type { HydratedDocument } from 'mongoose'
import { DoctorModel } from '../models/doctorModel'
import type { Doctor } from '../types/doctor'

export async function getPendingDoctorRequests(): Promise<
  Array<HydratedDocument<Doctor>>
> {
  return await DoctorModel.find({
    requestStatus: 'pending',
  })
}
