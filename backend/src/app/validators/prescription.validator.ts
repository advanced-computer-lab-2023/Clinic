import * as zod from 'zod'

export const CreatePrescriptionRequestValidator = zod.object({
  date: zod.coerce.date(),
  patient: zod.string().min(1),
  medicine: zod.string().min(1),
})
