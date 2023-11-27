import mongoose from 'mongoose'

const Schema = mongoose.Schema

const followupRequestSchema = new Schema(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    date: { type: String, required: true },
  },
  { timestamps: true }
)

export type FollowupRequestDocument = mongoose.InferSchemaType<
  typeof followupRequestSchema
>

export const FollowupRequestModel = mongoose.model(
  'FollowupRequest',
  followupRequestSchema
)
