import type { z } from 'zod'
import type { CreatePrescriptionRequestValidator } from '../validators/prescription.validator'

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
export class GetPrescriptionResponse {
  date: Date
  doctor: string
  patient: string
  constructor(date: Date, doctor: string, patient: string) {
    this.date = date
    this.doctor = doctor
    this.patient = patient
  }
}
