import mongoose from 'mongoose'
import { type FamilyMember } from '../types/familyMember.types'

const Schema = mongoose.Schema

const familyMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    nationalId: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    relation: { type: String, required: true },
    relatedTo: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  },
  { timestamps: true }
)

export const FamilyMemberModel = mongoose.model<FamilyMember>(
  'FamilyMember',
  familyMemberSchema
)

export type FamilyMemberDocument = mongoose.InferSchemaType<
  typeof familyMemberSchema
>
