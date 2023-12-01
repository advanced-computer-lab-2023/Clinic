import mongoose from 'mongoose'
const Schema = mongoose.Schema

export const MedicineItemSchema = new Schema<medicineItem>({
  name: String,
  dosage: String,
  quantity: Number,
})

export type medicineItem = {
  name: string
  dosage: string
  quantity: number
}

const prescriptionSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, required: true },
    //array of medicine items
    medicine: [MedicineItemSchema],

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
