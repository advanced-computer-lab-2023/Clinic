import mongoose from 'mongoose'
const Schema = mongoose.Schema

const prescriptionSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, required: true },
    medicine: { type: String, required: true },
    // status: { type: Boolean, required: true, default: false },
    isFilled: { type: Boolean, required: true, default: false }, // Renamed status, because it's more clear
  },
  { timestamps: true }
)

export type PrescriptionDocument = mongoose.InferSchemaType<
  typeof prescriptionSchema
>

export const PrescriptionModel = mongoose.model(
  'Prescription',
  prescriptionSchema
)
