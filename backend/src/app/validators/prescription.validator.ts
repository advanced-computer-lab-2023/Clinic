import * as zod from 'zod'

export const CreatePrescriptionRequestValidator = zod.object({
  date: zod.string().min(1),
  patient: zod.string().min(1),
})
