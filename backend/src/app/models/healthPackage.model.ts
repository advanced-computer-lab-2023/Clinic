import mongoose from 'mongoose'
const Schema = mongoose.Schema
const healthPackageSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    pricePerYear: { type: mongoose.Types.Decimal128, required: true },
    sessionDiscount: { type: mongoose.Types.Decimal128, required: true },
    medicineDiscount: { type: mongoose.Types.Decimal128, required: true },
    familyMemberSubscribtionDiscount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
  },
  { timestamps: true }
)

export type HealthPackageDocument = mongoose.InferSchemaType<
  typeof healthPackageSchema
>

export const HealthPackageModel = mongoose.model(
  'HealthPackage',
  healthPackageSchema
)
