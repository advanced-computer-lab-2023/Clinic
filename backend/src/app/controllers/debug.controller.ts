import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { DoctorModel } from '../models/doctor.model'
import { UserModel } from '../models/user.model'
import { DoctorStatus } from 'clinic-common/types/doctor.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { APIError } from '../errors'
import { AdminModel } from '../models/admin.model'
import { hash } from 'bcrypt'
import { UserType } from 'clinic-common/types/user.types'

import { faker } from '@faker-js/faker'
import { PatientModel } from '../models/patient.model'
import { FamilyMemberModel } from '../models/familyMember.model'

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

/**
 * This is a controller that has some helper endpoints for debugging purposes.
 */

export const debugRouter = Router()

debugRouter.post(
  '/create-doctor',
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
      requestStatus: DoctorStatus.Approved,
    })

    res.send(await doctor.populate('user'))
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
    const user = await UserModel.create({
      username: randomUsername('admin'),
      password: await hash('admin', bcryptSalt),
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
      gender: faker.person.gender(),
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
        gender: faker.person.gender(),
        relation: faker.helpers.arrayElement([
          'father',
          'mother',
          'brother',
          'sister',
        ]),
      })

      patient.familyMembers.push(familyMember.id)
    }

    await patient.save()

    res.send(await patient.populate(['familyMembers', 'user']))
  })
)
