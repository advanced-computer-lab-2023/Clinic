import * as zod from 'zod'

export const CreatePrescriptionRequestValidator = zod.object({
  date: zod.coerce.date(),
  patient: zod.string().min(1),
  medicine: zod
    .array(
      zod.object({
        name: zod.string().min(1),
        dosage: zod.string().min(1),
        quantity: zod.number().min(1),
      })
    )
    .min(1),
})
