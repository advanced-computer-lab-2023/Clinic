import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { type DoctorDocument, DoctorModel } from '../models/doctor.model'
import { type UserDocument, UserModel } from '../models/user.model'
import { DoctorStatus } from 'clinic-common/types/doctor.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { APIError } from '../errors'
import { AdminModel } from '../models/admin.model'
import { hash } from 'bcrypt'
import { UserType } from 'clinic-common/types/user.types'

import { faker } from '@faker-js/faker'
import { PatientModel } from '../models/patient.model'
import { FamilyMemberModel } from '../models/familyMember.model'
import { type WithUser } from '../utils/typeUtils'
import { PrescriptionModel } from '../models/prescription.model'

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

// Creates a random doctor with random data and password 'doctor',
async function createDummyDoctor(): Promise<WithUser<DoctorDocument>> {
  const user = await UserModel.create({
    username: randomUsername('doctor'),
    password: await hash('doctor', bcryptSalt),
    type: UserType.Doctor,
  })

  const doctor = await DoctorModel.create({
    user: user.id,
    name: faker.person.fullName(),
    email: randomEmail(),
    dateOfBirth: faker.date.past(),
    hourlyRate: faker.number.float().toPrecision(2),
    affiliation: faker.company.name(),
    educationalBackground: faker.company.name(),
    speciality: faker.helpers.arrayElement(specialities),
    requestStatus: DoctorStatus.Approved,
    availableTimes: faker.date.future(),
  })

  return await doctor.populate<{
    user: UserDocument
  }>('user')
}

/**
 * This is a controller that has some helper endpoints for debugging purposes.
 */

export const debugRouter = Router()

const specialities = ['oncology', 'dermatology', 'cardiology', 'neurology']

debugRouter.post(
  '/create-doctor',
  asyncWrapper(async (req, res) => {
    res.send(await createDummyDoctor())
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
    const user = await UserModel.create({
      username: randomUsername('doctor'),
      password: await hash('doctor', bcryptSalt),
      type: UserType.Doctor,
    })

    const doctor = await DoctorModel.create({
      user: user.id,
      name: faker.person.fullName(),
      email: randomEmail(),
      dateOfBirth: faker.date.past(),
      hourlyRate: faker.number.float().toPrecision(2),
      affiliation: faker.company.name(),
      educationalBackground: faker.company.name(),
      speciality: faker.helpers.arrayElement(specialities),
      requestStatus: DoctorStatus.Pending,
    })

    res.send(await doctor.populate('user'))
  })
)

debugRouter.get(
  '/doctors',
  asyncWrapper(async (req, res) => {
    res.send(await DoctorModel.find().populate('user'))
  })
)

/**
 * This endpoint makes the current user an admin.ts.
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
      throw new APIError('User is already an admin.ts', 400)
    }

    const admin = await AdminModel.create({ user: user.id })

    user.type = UserType.Admin
    await user.save()

    res.send(admin)
  })
)

/**
 * This endpoint creates an admin.ts with random username and password 'admin.ts',
 * and returns the created admin.ts, for testing purposes.
 */
debugRouter.post(
  '/create-admin',
  asyncWrapper(async (req, res) => {
    const user = await UserModel.create({
      username: randomUsername('admin.ts'),
      password: await hash('admin.ts', bcryptSalt),
      type: UserType.Admin,
    })

    const admin = await AdminModel.create({
      user: user.id,
    })

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
    const user = await UserModel.create({
      username: randomUsername('patient'),
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
    })

    for (let i = 0; i < 3; i++) {
      const familyMember = await FamilyMemberModel.create({
        name: faker.person.fullName(),
        nationalId: faker.string.numeric(14),
        age: faker.number.int({
          min: 20,
        }),
        gender: 'female',
        relation: faker.helpers.arrayElement([
          'son',
          'husband',
          'daughter',
          'wife',
        ]),
      })

      patient.familyMembers.push(familyMember.id)
    }

    for (let i = 0; i < 6; i++) {
      const doctor = await createDummyDoctor()

      await PrescriptionModel.create({
        patient: patient.id,
        doctor: doctor.id,
        date: faker.date.past(),
        medicine: faker.word.noun() + ' ' + faker.word.noun(),
        isFilled: faker.datatype.boolean(),
      })
    }

    await patient.save()

    res.send(await patient.populate(['familyMembers', 'user']))
  })
)
