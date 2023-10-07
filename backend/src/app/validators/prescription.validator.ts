import * as zod from 'zod'

export const CreatePrescriptionRequestValidator = zod.object({
  date: zod.date(),
  patient: zod.string().min(1),
})
