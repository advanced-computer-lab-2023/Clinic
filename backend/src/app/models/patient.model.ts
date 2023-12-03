import mongoose from 'mongoose'
import { Gender } from 'clinic-common/types/gender.types'
import validator from 'validator'
const Schema = mongoose.Schema

const patientSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'field must be valid email address'],
    },
    mobileNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      required: true,
      enum: Gender,
    },
    emergencyContact: {
      fullName: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      relation: { type: String, required: true },
    },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    deliveryAddresses: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
      },
    ],
    walletMoney: { type: Number, required: true, default: 0 },
    familyMembers: [{ type: Schema.Types.ObjectId, ref: 'FamilyMember' }],
    documents: [{ type: String }],
    healthPackage: { type: Schema.Types.ObjectId, ref: 'HealthPackage' },
    healthPackageRenewalDate: { type: Date },
    notes: [{ type: String }],
    healthRecords: [{ type: String }],

    healthPackageHistory: [
      {
        healthPackage: {
          type: Schema.Types.ObjectId,
          ref: 'HealthPackage',
          required: true,
        },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
)

export type PatientDocument = mongoose.InferSchemaType<typeof patientSchema>

export const PatientModel = mongoose.model('Patient', patientSchema)
