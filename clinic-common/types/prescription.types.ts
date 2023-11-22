import type { z } from 'zod'
import type { CreatePrescriptionRequestValidator } from '../validators/prescription.validator'
import type { medicineItem } from '../../backend/src/app/models/prescription.model'

export type CreatePrescriptionRequest = z.infer<
  typeof CreatePrescriptionRequestValidator
>

export class PrescriptionResponseBase {
  constructor(
    public id: string,
    public doctor: string,
    public patient: string,
    public date: Date,
    public isFilled: boolean, // FE will show it as Filled or UnFilled,
    public medicine: medicineItem[]
  ) {}
}

export class GetPrescriptionResponse {
  constructor(public prescriptions: PrescriptionResponseBase[]) {}
}
