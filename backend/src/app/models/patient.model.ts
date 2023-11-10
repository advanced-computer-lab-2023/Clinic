import mongoose from 'mongoose'
import { Gender } from 'clinic-common/types/gender.types'

const Schema = mongoose.Schema

const patientSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      required: true,
      enum: Gender,
    },
    emergencyContact: {
      name: { type: String, required: true },
      mobileNumber: { type: String, required: true },
    },
    familyMembers: [{ type: Schema.Types.ObjectId, ref: 'FamilyMember' }],
    documents: [{ type: String }],
    healthPackage: { type: Schema.Types.ObjectId, ref: 'HealthPackage' },
    notes: [{ type: String }],
    healthRecords: [{ type: String }],
    walletMoney: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export type PatientDocument = mongoose.InferSchemaType<typeof patientSchema>

export const PatientModel = mongoose.model('Patient', patientSchema)
