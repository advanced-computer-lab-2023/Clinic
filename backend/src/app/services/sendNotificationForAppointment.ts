import nodemailer from 'nodemailer'
import { PatientModel } from '../models/patient.model'
import { AppointmentDocument } from '../models/appointment.model'
import { DoctorModel } from '../models/doctor.model'
import { UserModel } from '../models/user.model'
import { addUserNotification } from './notification.service'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'el7a2niii@gmail.com',
    pass: 'bavi qann luqe evhy',
  },
  tls: {
    rejectUnauthorized: false,
  },
})

export async function sendNotificationPerMail(
  emailAddress: string,
  doctorName: string,
  time: any,
  status: string
) {
  let mailOptions

  if (status === 'cancelled') {
    mailOptions = {
      from: 'el7a2niii@gmail.com',
      to: emailAddress,
      subject: 'Appointment Cancellation',
      text: `Hello!
      This is an automated mail to inform you that your appointment request  with Dr. ${doctorName} at time ${time} has been cancelled. 
     
      Best regards,
      El7a2ni team
        `,
    }
  } else {
    mailOptions = {
      from: 'el7a2niii@gmail.com',
      to: emailAddress,
      subject: 'Appointment Update',
      text: `Hello!
    This is an automated mail to inform you that your appointment request has been ${status}, and it's set with Dr. ${doctorName} at time ${time}. The address of the clinic is 5th Settlement.

    If you have any questions or need to reschedule, please do this using your account on the clinic's website.
    
    We look forward to seeing you.
    
    Best regards,
    El7a2ni team
      `,
    }
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Notification sent successfully.')
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

export async function sendNotificationOnTheSystem(
  username: string,
  doctorName: string,
  time: any,
  status: string
) {
  console.log('hi i am posting notifications now')

  const notification = {
    description: `Appointment with Dr. ${doctorName} at time ${time} is ${status}`,
    title: 'Appointment Update',
  }

  addUserNotification({ username, notification })
}

export async function sendAppointmentNotificationToPatient(
  appointment: AppointmentDocument,
  status: string
) {
  const patient = await PatientModel.findById(appointment?.patientID)
  const patientUser = await UserModel.findById(patient?.user).lean()
  const doctor = await DoctorModel.findById(appointment?.doctorID)

  if (patientUser && doctor && appointment) {
    const patientUsername = patientUser?.username
    console.log(patientUsername)
    sendNotificationOnTheSystem(
      patientUsername,
      doctor?.name,
      appointment?.date,
      status
    )
  }

  if (patient && doctor && appointment)
    await sendNotificationPerMail(
      patient.email,
      doctor?.name,
      appointment?.date,
      status
    )
  else console.log("one of them isn't found idk which")
}
