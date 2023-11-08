import { Router } from 'express'

import {
  approveDoctor,
  getAllDoctors,
  getApprovedDoctorById,
  getDoctorByUsername,
  getPendingDoctorRequests,
  rejectDoctor,
  updateDoctorByUsername,
} from '../services/doctor.service'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins, allowAuthenticated } from '../middlewares/auth.middleware'
import {
  GetApprovedDoctorsResponse,
  GetApprovedDoctorResponse,
  GetDoctorResponse,
  GetPendingDoctorsResponse,
  UpdateDoctorResponse,
  type DoctorStatus,
  type UpdateDoctorRequest,
  GetWalletMoneyResponse,
} from 'clinic-common/types/doctor.types'
import { isAdmin } from '../services/auth.service'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { APIError, NotFoundError } from '../errors'
import { validate } from '../middlewares/validation.middleware'
import { UpdateDoctorRequestValidator } from 'clinic-common/validators/doctor.validator'
import { type UserDocument, UserModel } from '../models/user.model'
import { PatientModel } from '../models/patient.model'
import { type HydratedDocument } from 'mongoose'

import { type HealthPackageDocument } from '../models/healthPackage.model'

export const doctorsRouter = Router()

doctorsRouter.get(
  '/pending',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const pendingDoctorRequests = await getPendingDoctorRequests()
    res.send(
      new GetPendingDoctorsResponse(
        pendingDoctorRequests.map((doctor) => ({
          id: doctor.id,
          username: doctor.user.username,
          name: doctor.name,
          email: doctor.email,
          dateOfBirth: doctor.dateOfBirth,
          hourlyRate: doctor.hourlyRate,
          affiliation: doctor.affiliation,
          educationalBackground: doctor.educationalBackground,
          speciality: doctor.speciality,
          requestStatus: doctor.requestStatus as DoctorStatus,
        }))
      )
    )
  })
)

doctorsRouter.patch(
  '/:username',
  validate(UpdateDoctorRequestValidator),
  asyncWrapper<UpdateDoctorRequest>(async (req, res) => {
    if (req.username == null) {
      throw new NotAuthenticatedError()
    }

    const admin = await isAdmin(req.username)
    const sameUser = req.username === req.params.username

    if (!admin && !sameUser) {
      throw new APIError(
        'Only admins and the doctor can update their profile',
        403
      )
    }

    const updatedDoctor = await updateDoctorByUsername(
      req.params.username,
      req.body
    )

    res.send(
      new UpdateDoctorResponse(
        updatedDoctor.id,
        updatedDoctor.user.username,
        updatedDoctor.name,
        updatedDoctor.email,
        updatedDoctor.dateOfBirth,
        updatedDoctor.hourlyRate,
        updatedDoctor.affiliation,
        updatedDoctor.educationalBackground,
        updatedDoctor.speciality,
        updatedDoctor.requestStatus as DoctorStatus
      )
    )
  })
)

// Get all (approved) doctors
doctorsRouter.get(
  '/approved',
  asyncWrapper(async (req, res) => {
    const user: HydratedDocument<UserDocument> | null = await UserModel.findOne(
      { username: req.username }
    )
    if (user == null) throw new NotAuthenticatedError()
    const patient = await PatientModel.findOne({ user: user.id })
      .populate<{ healthPackage: HealthPackageDocument }>('healthPackage')
      .exec()
    if (patient == null) throw new NotAuthenticatedError()
    const doctors = await getAllDoctors()

    const discount = patient.healthPackage?.sessionDiscount ?? 0
    res.send(
      new GetApprovedDoctorsResponse(
        doctors.map((doctor) => ({
          id: doctor.id,
          username: doctor.user.username,
          name: doctor.name,
          email: doctor.email,
          dateOfBirth: doctor.dateOfBirth,
          hourlyRate: doctor.hourlyRate,
          affiliation: doctor.affiliation,
          speciality: doctor.speciality,
          educationalBackground: doctor.educationalBackground,
          sessionRate:
            doctor.hourlyRate * 1.1 - (discount * doctor.hourlyRate) / 100,
          // TODO: retrieve available times from the Appointments. Since we aren't required to make appointments for this sprint, I will
          // assume available times is a field in the doctors schema for now.
          availableTimes: doctor.availableTimes as [string],
          requestStatus: doctor.requestStatus as DoctorStatus,
        }))
      )
    )
  })
)

doctorsRouter.get(
  '/:username',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const doctor = await getDoctorByUsername(req.params.username)

    res.send(
      new GetDoctorResponse(
        doctor.id,
        doctor.user.username,
        doctor.name,
        doctor.email,
        doctor.dateOfBirth,
        doctor.hourlyRate,
        doctor.affiliation,
        doctor.educationalBackground,
        doctor.speciality,
        doctor.requestStatus as DoctorStatus
      )
    )
  })
)

// get id of an APPROVED doctor with a given id
doctorsRouter.get(
  '/approved/:id',
  asyncWrapper(async (req, res) => {
    const doctor = await getApprovedDoctorById(req.params.id)

    const user = await UserModel.findOne({ username: req.username })

    if (user == null) throw new NotAuthenticatedError()

    const patient = await PatientModel.findOne({ user: user.id })
      .populate<{ healthPackage: HealthPackageDocument }>('healthPackage')
      .exec()

    if (patient == null) throw new NotAuthenticatedError()

    const discount = patient.healthPackage?.sessionDiscount ?? 0

    res.send(
      new GetApprovedDoctorResponse(
        doctor.id,
        doctor.user.username,
        doctor.name,
        doctor.email,
        doctor.dateOfBirth,
        doctor.hourlyRate,
        doctor.affiliation,
        doctor.educationalBackground,
        doctor.speciality,
        doctor.requestStatus as DoctorStatus,
        doctor.availableTimes as [string],
        doctor.hourlyRate * 1.1 - (discount * doctor.hourlyRate) / 100
      )
    )
  })
)

doctorsRouter.patch(
  '/rejectDoctorRequest/:id',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const doctor = await rejectDoctor(req.params.id)
    res.send(
      new UpdateDoctorResponse(
        doctor.id,
        doctor.user.username,
        doctor.name,
        doctor.email,
        doctor.dateOfBirth,
        doctor.hourlyRate,
        doctor.affiliation,
        doctor.educationalBackground,
        doctor.speciality,
        doctor.requestStatus as DoctorStatus
      )
    )
  })
)
doctorsRouter.patch(
  '/acceptDoctorRequest/:id',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const doctor = await approveDoctor(req.params.id)
    res.send(
      new UpdateDoctorResponse(
        doctor.id,
        doctor.user.username,
        doctor.name,
        doctor.email,
        doctor.dateOfBirth,
        doctor.hourlyRate,
        doctor.affiliation,
        doctor.educationalBackground,
        doctor.speciality,
        doctor.requestStatus as DoctorStatus
      )
    )
  })
)

// get walletmoney of a doctor with a given username
doctorsRouter.get(
  '/wallet/:username',
  asyncWrapper(async (req, res) => {
    const doctor = await getDoctorByUsername(req.params.username)
    if (!doctor || !doctor.walletMoney) throw new NotFoundError()
    res.send(new GetWalletMoneyResponse(doctor.walletMoney))
  })
)
