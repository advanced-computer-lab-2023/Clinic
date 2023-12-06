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
import { sendAppointmentNotificationToPatient } from './sendNotificationForAppointment'
import { DoctorModel } from '../models/doctor.model'
import { UserModel } from '../models/user.model'
import AppError from '../utils/appError'
import { ERROR } from '../utils/httpStatusText'
import { FollowupRequestModel } from '../models/followupRequest.model'

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
  reservedFor: string,
  paidByPatient: number,
  paidToDoctor: number
): Promise<AppointmentDocument | null> {
  // Create a new appointment
  const newDate = new Date(date).toISOString()
  let newAppointment

  if (reservedFor == 'Me') {
    const patient = await PatientModel.findById(patientID)
    const patientName = patient?.name

    newAppointment = new AppointmentModel({
      patientID,
      doctorID,
      date: newDate,
      familyID,
      reservedFor: patientName,
      status: AppointmentStatus.Upcoming,
      paidByPatient,
      paidToDoctor,
    })
  } else {
    newAppointment = new AppointmentModel({
      patientID,
      doctorID,
      date: newDate,
      familyID,
      reservedFor,
      status: AppointmentStatus.Upcoming,
      paidByPatient,
      paidToDoctor,
    })
  }

  await removeTimeFromDoctorAvailability(doctorID, date)
  // Save the new appointment
  await newAppointment.save()
  sendAppointmentNotificationToPatient(newAppointment, 'accepted')

  return newAppointment
}

export async function createFollowUpAppointment(
  appointment: AppointmentDocument
): Promise<AppointmentDocument> {
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
  await newAppointment.save()
  sendAppointmentNotificationToPatient(newAppointment, 'confirmed')

  return newAppointment
}

export async function checkForExistingFollowUp(appointmentID: string) {
  const existingRequest = await FollowupRequestModel.findOne({
    appointment: appointmentID,
    status: { $ne: 'rejected' },
  })

  return !!existingRequest
}

export async function requestFollowUpAppointment(
  appointmentID: string,
  newDate: string
) {
  const hasExistingFollowUp = await checkForExistingFollowUp(appointmentID)

  if (!hasExistingFollowUp) {
    const request = new FollowupRequestModel({
      appointment: appointmentID,
      date: newDate,
    })
    console.log(request)

    return await request.save()
  } else {
    throw new Error('A follow-up request already exists for this appointment.')
  }
}

export async function deleteAppointment(
  appointmentId: string,
  cancelledByDoctor: boolean
): Promise<AppointmentDocument | null> {
  // Find the appointment by ID
  const appointment = await AppointmentModel.findById(appointmentId)

  if (!appointment) {
    throw new AppError("Couldn't find appointment", 404, ERROR)
  }
  //add the date to the available times here

  const doctorID = appointment.doctorID
  const appointmentDate = new Date(appointment.date)

  const doctor = await DoctorModel.findById(doctorID)
  const doctorUIser = await UserModel.findById(doctor!.user)
  const patient = await PatientModel.findById(appointment.patientID)

  if (!doctor || !doctorUIser || !patient) {
    throw new AppError(
      "Couldn't find appointment's doctor or patient",
      404,
      ERROR
    )
  }

  const timeTillAppointment = Math.abs(
    new Date().getTime() - appointmentDate.getTime()
  )
  const hoursTillAppointment = Math.ceil(timeTillAppointment / (1000 * 60 * 60))

  // refund the money to the patient and from doctor if apptmt is cancelled 24 hours before
  // or if cancelled by doctor
  if (hoursTillAppointment >= 24 || cancelledByDoctor) {
    doctor.walletMoney -= appointment.paidToDoctor
    patient.walletMoney += appointment.paidByPatient
    await doctor.save()
    await patient.save()
  }

  const updatedDoctor = await addAvailableTimeSlots(doctorUIser!.username, {
    time: appointmentDate,
  })

  if (!updatedDoctor) {
    throw new AppError("Couldn't add date to doctor", 500, ERROR)
  }

  //update the status to cancelled
  appointment.status = AppointmentStatus.Cancelled
  const deletedAppointment = await appointment.save()
  sendAppointmentNotificationToPatient(deletedAppointment, 'cancelled')

  return deletedAppointment
}
