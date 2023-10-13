import mongoose from 'mongoose'
import { AppointmentStatus } from 'clinic-common/types/appointment.types'

const Schema = mongoose.Schema

const appointmentSchema = new Schema(
  {
    patientID: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorID: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: AppointmentStatus,
    },
  },
  { timestamps: true }
)

export type AppointmentDocument = mongoose.InferSchemaType<
  typeof appointmentSchema
>

export const AppointmentModel = mongoose.model('Appointment', appointmentSchema)
