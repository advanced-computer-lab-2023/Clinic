import mongoose from 'mongoose'
const Schema = mongoose.Schema

const prescriptionSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: Boolean },
  },
  { timestamps: true }
)

const PrescriptionModel = mongoose.model('Prescription', prescriptionSchema)
export { PrescriptionModel }
