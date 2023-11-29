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
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted', 'rejected'],
    },
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
