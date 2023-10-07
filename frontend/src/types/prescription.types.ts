import * as zod from 'zod'
import type { z } from 'zod'

export const CreatePrescriptionRequestValidator = zod.object({
  date: zod.date(),
  doctor: zod.string().min(1),
  patient: zod.string().min(1),
})

export type CreatePrescriptionRequest = z.infer<
  typeof CreatePrescriptionRequestValidator
>

export class CreatePrescriptionResponse {
  date: Date
  doctor: string
  patient: string

  constructor(date: Date, doctor: string, patient: string) {
    this.date = date
    this.doctor = doctor
    this.patient = patient
  }
}
