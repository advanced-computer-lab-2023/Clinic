import { type HydratedDocument } from 'mongoose'
import {
  AppointmentModel,
  type AppointmentDocument,
} from '../models/appointment.model'
import { AppointmentStatus } from 'clinic-common/types/appointment.types'

import {
  addAvailableTimeSlots,
  removeTimeFromDoctorAvailability,
} from './doctor.service'
import { PatientModel } from '../models/patient.model'
import { NotFoundError } from '../errors'
import { DoctorModel } from '../models/doctor.model'
import { UserModel } from '../models/user.model'
import AppError from '../utils/appError'
import { ERROR } from '../utils/httpStatusText'

export async function getfilteredAppointments(
  query: any
): Promise<Array<HydratedDocument<AppointmentDocument>>> {
  if (
    query.patientID !== undefined &&
    query.patientID !== null &&
    query.patientID !== ''
  ) {
    // Search for appointments where patientID or familyID matches the specified user ID
    return await AppointmentModel.find({
      $or: [{ patientID: query.patientID }, { familyID: query.patientID }],
    })
  } else if (
    query.doctorID !== undefined &&
    query.doctorID !== null &&
    query.doctorID !== ''
  ) {
    return await AppointmentModel.find({
      doctorID: query.doctorID,
    })
  } else {
    return await AppointmentModel.find()
  }
}

export async function createAndRemoveTime(
  patientID: string,
  doctorID: string,
  date: Date,
  familyID: string,
  reservedFor: string
): Promise<AppointmentDocument | null> {
  // Create a new appointment
  const newDate = new Date(date).toISOString()
  let newAppointment

  if (reservedFor == 'Me') {
    const patient = await PatientModel.findById(patientID)
    const patientName = patient?.name
    console.log(patientName)

    newAppointment = new AppointmentModel({
      patientID,
      doctorID,
      date: newDate,
      familyID,
      reservedFor: patientName,
      status: AppointmentStatus.Upcoming,
    })
  } else {
    newAppointment = new AppointmentModel({
      patientID,
      doctorID,
      date: newDate,
      familyID,
      reservedFor,
      status: AppointmentStatus.Upcoming,
    })
  }

  await removeTimeFromDoctorAvailability(doctorID, date)
  // Save the new appointment
  await newAppointment.save()

  console.log(newAppointment)

  return newAppointment
}

export async function createFollowUpAppointment(
  appointment: AppointmentDocument
): Promise<AppointmentDocument> {
  console.log(appointment.patientID)
  const patient = await PatientModel.findById(appointment.patientID)

  if (patient == null) {
    throw new NotFoundError()
  }

  const patientName = patient?.name

  const newAppointment = new AppointmentModel({
    ...appointment,
    date: new Date(appointment.date),
    status: AppointmentStatus.Upcoming,
    reservedFor: patientName,
  })

  return await newAppointment.save()
}

export async function deleteAppointment(
  appointmentId: string
): Promise<AppointmentDocument | null> {
  // Find the appointment by ID
  const appointment = await AppointmentModel.findById(appointmentId)

  if (!appointment) {
    throw new AppError("Couldn't find appointment", 404, ERROR)
  }
  //add the date to the availabel times here

  const doctorID = appointment.doctorID
  const appointmentDate = new Date(appointment.date)

  const doctor = await DoctorModel.findById(doctorID)
  const doctorUIser = await UserModel.findById(doctor!.user)

  const updatedDoctor = await addAvailableTimeSlots(doctorUIser!.username, {
    time: appointmentDate,
  })

  if (!updatedDoctor) {
    throw new AppError("Couldn't add date to doctor", 500, ERROR)
  }

  // Delete the appointment from the database
  const deletedAppointment =
    await AppointmentModel.findByIdAndDelete(appointmentId)

  return deletedAppointment
}
