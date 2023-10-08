import mongoose from 'mongoose'
const Schema = mongoose.Schema
const healthPackageSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    pricePerYear: { type: Number, required: true },
    sessionDiscount: { type: Number, required: true },
    medicineDiscount: { type: Number, required: true },
    familyMemberSubscribtionDiscount: {
      type: Number,
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
