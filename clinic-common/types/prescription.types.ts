import type { z } from 'zod'
import type { CreatePrescriptionRequestValidator } from '../validators/prescription.validator'

export type CreatePrescriptionRequest = z.infer<
  typeof CreatePrescriptionRequestValidator
>


export class PrescriptionResponseBase {
  constructor(
    public doctor: string,
    public patient: string,
    public date: string,
    public status: string
  ) {}
}

export class GetPrescriptionResponse {
  constructor(public prescriptions: PrescriptionResponseBase[]) {}
}
