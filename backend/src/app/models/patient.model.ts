import mongoose from 'mongoose'

const Schema = mongoose.Schema

const patientSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    emergencyContact: {
      name: { type: String, required: true },
      mobileNumber: { type: String, required: true },
    },
  },
  { timestamps: true }
)

export type PatientDocument = mongoose.InferSchemaType<typeof patientSchema>

export const PatientModel = mongoose.model('Patient', patientSchema)
