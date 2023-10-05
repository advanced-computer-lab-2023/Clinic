import mongoose from "mongoose";
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    MobileNumber: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    Gender: { type: String, required: true },
    EmergencyContact: {
      Name: { type: String, required: true },
      MobileNumber: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const PatientModel = mongoose.model("Patient", patientSchema);
export { PatientModel };
