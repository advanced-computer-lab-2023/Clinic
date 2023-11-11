import { Relation } from 'clinic-common/types/familyMember.types'
import { Gender } from 'clinic-common/types/gender.types'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const familyMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    nationalId: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      required: true,
      enum: Gender,
    },
    relation: {
      type: String,
      required: true,
      enum: Relation,
    },
    healthPackage: { type: Schema.Types.ObjectId, ref: 'HealthPackage' },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
    healthPackageHistory: [
      {
        healthPackage: {
          type: Schema.Types.ObjectId,
          ref: 'HealthPackage',
          required: true,
        },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
)

export const FamilyMemberModel = mongoose.model(
  'FamilyMember',
  familyMemberSchema
)

export type FamilyMemberDocument = mongoose.InferSchemaType<
  typeof familyMemberSchema
>
