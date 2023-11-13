import mongoose, { Schema, Document } from 'mongoose'

const OTPSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  expiresAt: { type: Date, required: true },
})

export interface IOtp extends Document {
  email: string
  otp: string
  createdAt: Date
  expiresAt: Date
}

const OTPModel = mongoose.model<IOtp>('OTP', OTPSchema)

export default OTPModel
