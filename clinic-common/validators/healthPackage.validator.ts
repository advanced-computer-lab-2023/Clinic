import * as zod from 'zod'

export const CreateHealthPackageRequestValidator = zod.object({
  name: zod.string().min(1),
  pricePerYear: zod.number(),
  sessionDiscount: zod.number(),
  medicineDiscount: zod.number(),
  familyMemberSubscribtionDiscount: zod.number(),
})

export const UpdateHealthPackageRequestValidator = zod.object({
  name: zod.string().min(1).optional(),
  pricePerYear: zod.number().optional(),
  sessionDiscount: zod.number().optional(),
  medicineDiscount: zod.number().optional(),
  familyMemberSubscribtionDiscount: zod.number().optional(),
})
