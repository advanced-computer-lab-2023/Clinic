import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { type DoctorDocument, DoctorModel } from '../models/doctor.model'
import { type UserDocument, UserModel } from '../models/user.model'
import { DoctorStatus } from 'clinic-common/types/doctor.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { APIError } from '../errors'
import { type AdminDocument, AdminModel } from '../models/admin.model'
import { hash } from 'bcrypt'
import { UserType } from 'clinic-common/types/user.types'

import { faker } from '@faker-js/faker'
import { type PatientDocument, PatientModel } from '../models/patient.model'
import {
  type FamilyMemberDocument,
  FamilyMemberModel,
} from '../models/familyMember.model'
import { type WithUser } from '../utils/typeUtils'
import {
  type PrescriptionDocument,
  PrescriptionModel,
} from '../models/prescription.model'
import { Relation } from 'clinic-common/types/familyMember.types'
import { Gender } from 'clinic-common/types/gender.types'
import { type HydratedDocument } from 'mongoose'
import { createDefaultHealthPackages } from '../services/healthPackage.service'
import { AppointmentStatus } from 'clinic-common/types/appointment.types'
import {
  type AppointmentDocument,
  AppointmentModel,
} from '../models/appointment.model'
import { HealthPackageModel } from '../models/healthPackage.model'

const bcryptSalt = process.env.BCRYPT_SALT ?? '$2b$10$13bXTGGukQXsCf5hokNe2u'

// Generate a random long number to be used in usernames to avoid duplicated usernames
function randomLongId(): string {
  return Math.floor(Math.random() * 100000000000000).toString()
}

// Generate a random short number to be used in emails to avoid duplicated emails
function randomShortId(): string {
  return Math.floor(Math.random() * 10000).toString()
}

// Generate a random username with a prefix, for example prefix = 'doctor' gives 'doctor_123456789'
function randomUsername(prefix: string): string {
  return prefix + '_' + randomLongId()
}

// Generate a random email, 'mathewhany_1234243@gmail.com'
function randomEmail(): string {
  return faker.internet.userName() + '_' + randomShortId() + '@gmail.com'
}

function randomFutureDates(): string[] {
  const futureDates = []

  for (let i = 0; i < 5; i++) {
    futureDates.push(faker.date.future().toString())
  }

  return futureDates
}

const specialities = ['oncology', 'dermatology', 'cardiology', 'neurology']

// Creates a random doctor with random data and password 'doctor',
async function createDummyDoctor(
  username: string = randomUsername('doctor'),
  status: DoctorStatus = DoctorStatus.Approved,
  withAppointments: boolean = false
): Promise<WithUser<DoctorDocument>> {
  const user = await UserModel.create({
    username,
    password: await hash('doctor', bcryptSalt),
    type: UserType.Doctor,
  })

  const doctor = await DoctorModel.create({
    user: user.id,
    name: faker.person.fullName(),
    email: randomEmail(),
    dateOfBirth: faker.date.past(),
    hourlyRate: faker.number
      .float({
        min: 5,
        max: 100,
      })
      .toPrecision(2),
    affiliation: faker.company.name(),
    educationalBackground: faker.company.name(),
    speciality: faker.helpers.arrayElement(specialities),
    requestStatus: status,
    availableTimes: randomFutureDates(),
  })

  if (withAppointments) {
    for (let i = 0; i < 6; i++) {
      const patient = await createDummyPatient()

      await createDummyAppointment(patient.id, doctor.id)
    }
  }

  return await doctor.populate<{
    user: UserDocument
  }>('user')
}

async function createDummyPrescription(
  patientId: string,
  doctorId: string
): Promise<HydratedDocument<PrescriptionDocument>> {
  return await PrescriptionModel.create({
    patient: patientId,
    doctor: doctorId,
    date: faker.date.past(),
    medicine: faker.word.noun() + ' ' + faker.word.noun(),
    isFilled: faker.datatype.boolean(),
  })
}

async function createDummyFamilyMember(): Promise<
  HydratedDocument<FamilyMemberDocument>
> {
  return await FamilyMemberModel.create({
    name: faker.person.fullName(),
    nationalId: faker.string.numeric(14),
    age: faker.number.int({
      min: 20,
    }),
    gender: faker.helpers.enumValue(Gender),
    relation: faker.helpers.enumValue(Relation),
  })
}

async function createDummyAppointment(
  patientId: string,
  doctorId: string
): Promise<HydratedDocument<AppointmentDocument>> {
  return await AppointmentModel.create({
    patientID: patientId,
    doctorID: doctorId,
    date: faker.date.anytime(),
    status: faker.helpers.enumValue(AppointmentStatus),
  })
}

// Creates a random patient with random data and password 'patient',
async function createDummyPatient(
  username?: string
): Promise<WithUser<PatientDocument>> {
  username = username ?? randomUsername('patient')

  const user = await UserModel.create({
    username,
    password: await hash('patient', bcryptSalt),
    type: UserType.Patient,
  })

  const patient = await PatientModel.create({
    user: user.id,
    name: faker.person.fullName(),
    email: randomEmail(),
    dateOfBirth: faker.date.past(),
    mobileNumber: faker.phone.number(),
    gender: 'female',
    emergencyContact: {
      name: faker.person.fullName(),
      mobileNumber: faker.phone.number(),
    },
    healthPackage: faker.helpers.arrayElement([
      ...(await HealthPackageModel.find()).map((hp) => hp.id),
      undefined,
    ]),
    notes: [faker.lorem.sentence()],
  })

  for (let i = 0; i < 3; i++) {
    const familyMember = await createDummyFamilyMember()
    patient.familyMembers.push(familyMember.id)
  }

  for (let i = 0; i < 6; i++) {
    const doctor = await createDummyDoctor()

    await createDummyPrescription(patient.id, doctor.id)
  }

  for (let i = 0; i < 6; i++) {
    const doctor = await createDummyDoctor()

    await createDummyAppointment(patient.id, doctor.id)
  }

  await patient.save()

  return await patient.populate(['familyMembers', 'user'])
}

async function createDummyAdmin(
  username?: string
): Promise<WithUser<AdminDocument>> {
  username = username ?? randomUsername('admin')

  const user = await UserModel.create({
    username,
    password: await hash('admin', bcryptSalt),
    type: UserType.Admin,
  })

  const admin = await AdminModel.create({
    user: user.id,
  })

  return await admin.populate<{ user: UserDocument }>('user')
}

/**
 * This is a controller that has some helper endpoints for debugging purposes.
 */

export const debugRouter = Router()

debugRouter.post(
  '/create-doctor',
  asyncWrapper(async (req, res) => {
    res.send(
      await createDummyDoctor(
        randomUsername('doctor'),
        DoctorStatus.Approved,
        true
      )
    )
  })
)

// debugRouter.post(
//   '/create-patient',
//   asyncWrapper(async (req, res) => {
//     const user = await UserModel.create({
//       username: 'patient' + Math.random(),
//       password: await hash('patient', bcryptSalt),
//       type: UserType.Patient,
//     })

//     const patient = await PatientModel.create({
//       user: user.id,
//       name: 'Patient',
//       email: user.username + '@gmail.com',
//       mobileNumber: '01001111111',
//       dateOfBirth: new Date(),
//       gender: 'female',
//       emergencyContact: {
//         name: 'Emergency1',
//         mobileNumber: '0100111111',
//       },
//     })

//     res.send(patient)
//   })
// )

debugRouter.post(
  '/create-patient-onlyonce',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: 'patientP',
      password: await hash('patient', bcryptSalt),
      type: UserType.Patient,
    })

    const patient = await PatientModel.create({
      user: user.id,
      name: 'Patient',
      email: user.username + '@gmail.com',
      mobileNumber: '01001111111',
      dateOfBirth: new Date(),
      gender: 'female',
      emergencyContact: {
        name: 'Emergency1',
        mobileNumber: '0100111111',
      },
    })

    res.send(patient)
  })
)
debugRouter.post(
  '/create-pending-doctor',
  asyncWrapper(async (req, res) => {
    res.send(
      await createDummyDoctor(
        randomUsername('pending_doctor'),
        DoctorStatus.Pending
      )
    )
  })
)

debugRouter.get(
  '/doctors',
  asyncWrapper(async (req, res) => {
    res.send(await DoctorModel.find().populate('user'))
  })
)

/**
 * This endpoint makes the current user an admin.
 */
debugRouter.get(
  '/make-me-admin',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const user = await UserModel.findOne({ username: req.username })

    if (user == null) {
      throw new APIError('User not found', 404)
    }

    if ((await AdminModel.count({ user: user.id })) > 0) {
      throw new APIError('User is already an admin', 400)
    }

    const admin = await AdminModel.create({ user: user.id })

    user.type = UserType.Admin
    await user.save()

    res.send(admin)
  })
)

/**
 * This endpoint creates an admin with random username and password 'admin',
 * and returns the created admin, for testing purposes.
 */
debugRouter.post(
  '/create-admin',
  asyncWrapper(async (req, res) => {
    const admin = await createDummyAdmin()

    res.send(await admin.populate('user'))
  })
)

/**
 * This endpoint creates a patient with random data and password 'patient',
 * and returns the created patient, for testing purposes.
 * It also creates some family members for the patient.
 * It also creates some prescriptions for the patient.
 */
debugRouter.post(
  '/create-patient',
  asyncWrapper(async (req, res) => {
    res.send(await createDummyPatient())
  })
)

/**
 * Creates random data for the database, for testing purposes.
 * Will be used for the evaluation.
 */
debugRouter.post(
  '/seed',
  asyncWrapper(async (req, res) => {
    await createDefaultHealthPackages()

    const admin = await createDummyAdmin('admin')
    const patient = await createDummyPatient('patient')
    const doctor = await createDummyDoctor(
      'doctor',
      DoctorStatus.Approved,
      true
    )

    for (let i = 0; i < 3; i++) {
      await createDummyDoctor(
        randomUsername('pending_doctor'),
        DoctorStatus.Pending
      )
    }

    res.send({
      admin,
      patient,
      doctor,
    })
  })
)
