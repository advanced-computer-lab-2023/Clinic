import { Router } from 'express'

import {
  acceptEmploymentContract,
  addAvailableTimeSlots,
  approveDoctor,
  getAllDoctors,
  getApprovedDoctorById,
  getDoctorByUsername,
  getDoctorSessionRateWithMarkup,
  getPendingDoctorRequests,
  rejectDoctor,
  rejectEmploymentContract,
  updateDoctorByUsername,
} from '../services/doctor.service'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  allowAdmins,
  allowApprovedDoctors,
  allowApprovedandAcceptsDoctors,
  allowAuthenticated,
} from '../middlewares/auth.middleware'
import {
  GetApprovedDoctorsResponse,
  GetApprovedDoctorResponse,
  GetDoctorResponse,
  GetPendingDoctorsResponse,
  UpdateDoctorResponse,
  type DoctorStatus,
  type UpdateDoctorRequest,
  AddAvailableTimeSlotsResponse,
  GetWalletMoneyResponse,
  ApproveDoctorResponse,
  ContractStatus,
  AcceptOrRejectContractResponse,
} from 'clinic-common/types/doctor.types'
import { isAdmin } from '../services/auth.service'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { APIError, NotFoundError } from '../errors'
import { validate } from '../middlewares/validation.middleware'
import {
  AddAvailableTimeSlotsRequestValidator,
  UpdateDoctorRequestValidator,
} from 'clinic-common/validators/doctor.validator'
import { type UserDocument, UserModel } from '../models/user.model'
import { PatientModel } from '../models/patient.model'
import { type HydratedDocument } from 'mongoose'

import { type HealthPackageDocument } from '../models/healthPackage.model'
import {
  getDoctorSessionRateForPatient,
  hasDiscountOnDoctorSession,
} from '../services/healthPackage.service'

export const doctorsRouter = Router()

doctorsRouter.get(
  '/pending',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const pendingDoctorRequests = await getPendingDoctorRequests()
    res.send({
      doctors: pendingDoctorRequests.map((doctor) => ({
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
        documents: doctor.documents as [string],
      })),
    } satisfies GetPendingDoctorsResponse)
  })
)

doctorsRouter.patch(
  '/updateDoctor/:username',
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

    res.send({
      id: updatedDoctor.id,
      username: updatedDoctor.user.username,
      name: updatedDoctor.name,
      email: updatedDoctor.email,
      dateOfBirth: updatedDoctor.dateOfBirth,
      hourlyRate: updatedDoctor.hourlyRate,
      affiliation: updatedDoctor.affiliation,
      educationalBackground: updatedDoctor.educationalBackground,
      speciality: updatedDoctor.speciality,
      requestStatus: updatedDoctor.requestStatus as DoctorStatus,
    } satisfies UpdateDoctorResponse)
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

    res.send({
      doctors: doctors.map((doctor) => ({
        id: doctor.id,
        username: doctor.user.username,
        name: doctor.name,
        email: doctor.email,
        dateOfBirth: doctor.dateOfBirth,
        hourlyRate: doctor.hourlyRate,
        hourlyRateWithMarkup: getDoctorSessionRateWithMarkup({ doctor }),
        affiliation: doctor.affiliation,
        speciality: doctor.speciality,
        educationalBackground: doctor.educationalBackground,
        sessionRate: getDoctorSessionRateForPatient({ doctor, patient }),
        availableTimes: doctor.availableTimes as [Date],
        requestStatus: doctor.requestStatus as DoctorStatus,
        hasDiscount: hasDiscountOnDoctorSession({ patient }),
        documents: doctor.documents as [string],
      })),
    } satisfies GetApprovedDoctorsResponse)
  })
)

doctorsRouter.get(
  '/:username',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const doctor = await getDoctorByUsername(req.params.username)

    res.send({
      id: doctor.id,
      username: doctor.user.username,
      name: doctor.name,
      email: doctor.email,
      dateOfBirth: doctor.dateOfBirth,
      hourlyRate: doctor.hourlyRate,
      affiliation: doctor.affiliation,
      speciality: doctor.speciality,
      educationalBackground: doctor.educationalBackground,
      requestStatus: doctor.requestStatus as DoctorStatus,
      availableTimes: doctor.availableTimes as [Date],
      contractStatus: doctor.contractStatus as ContractStatus,
      employmentContract: doctor.employmentContract as [string],
      documents: doctor.documents as [string],
    } satisfies GetDoctorResponse)
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

    res.send({
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
      availableTimes: doctor.availableTimes as [Date],
      sessionRate: getDoctorSessionRateForPatient({ doctor, patient }),
      hourlyRateWithMarkup: getDoctorSessionRateWithMarkup({ doctor }),
      hasDiscount: hasDiscountOnDoctorSession({ patient }),
    } satisfies GetApprovedDoctorResponse)
  })
)

doctorsRouter.patch(
  '/rejectDoctorRequest/:id',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const doctor = await rejectDoctor(req.params.id)
    res.send({
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
    } satisfies UpdateDoctorResponse)
  })
)
doctorsRouter.patch(
  '/acceptDoctorRequest/:id',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const doctor = await approveDoctor(req.params.id)
    res.send({
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
      availableTimes: doctor.availableTimes as [Date],
      employmentContract: doctor.employmentContract as [string],
    } satisfies ApproveDoctorResponse)
  })
)
//reject employment contract
doctorsRouter.patch(
  '/rejectEmploymentContract',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    const doctor = await rejectEmploymentContract(req.username!)
    res.send({
      id: doctor.id,
      username: doctor.user.username,
      name: doctor.name,
      email: doctor.email,
      dateOfBirth: doctor.dateOfBirth,
      hourlyRate: doctor.hourlyRate,
      affiliation: doctor.affiliation,
      speciality: doctor.speciality,
      educationalBackground: doctor.educationalBackground,
      requestStatus: doctor.requestStatus as DoctorStatus,
      availableTimes: doctor.availableTimes as [Date],
      contractStatus: doctor.contractStatus as ContractStatus,
      employmentContract: doctor.employmentContract as [string],
      documents: doctor.documents as [string],
    } satisfies AcceptOrRejectContractResponse)
  })
)
//accept employment contract
doctorsRouter.patch(
  '/acceptEmploymentContract',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    const doctor = await acceptEmploymentContract(req.username!)
    res.send({
      id: doctor.id,
      username: doctor.user.username,
      name: doctor.name,
      email: doctor.email,
      dateOfBirth: doctor.dateOfBirth,
      hourlyRate: doctor.hourlyRate,
      affiliation: doctor.affiliation,
      speciality: doctor.speciality,
      educationalBackground: doctor.educationalBackground,
      requestStatus: doctor.requestStatus as DoctorStatus,
      availableTimes: doctor.availableTimes as [Date],
      contractStatus: doctor.contractStatus as ContractStatus,
      employmentContract: doctor.employmentContract as [string],
      documents: doctor.documents as [string],
    } satisfies AcceptOrRejectContractResponse)
  })
)

doctorsRouter.patch(
  '/addAvailableTimeSlots',
  validate(AddAvailableTimeSlotsRequestValidator),
  asyncWrapper(allowApprovedandAcceptsDoctors),
  asyncWrapper(async (req, res) => {
    const doctor = await addAvailableTimeSlots(req.username!, req.body)

    res.send({
      id: doctor.id,
      username: doctor.user.username,
      name: doctor.name,
      email: doctor.email,
      dateOfBirth: doctor.dateOfBirth,
      hourlyRate: doctor.hourlyRate,
      affiliation: doctor.affiliation,
      speciality: doctor.speciality,
      educationalBackground: doctor.educationalBackground,
      availableTimes: doctor.availableTimes as [Date],
      requestStatus: doctor.requestStatus as DoctorStatus,
    } satisfies AddAvailableTimeSlotsResponse)
  })
)

// get walletmoney of a doctor with a given username
doctorsRouter.get(
  '/wallet/:username',
  asyncWrapper(async (req, res) => {
    const doctor = await getDoctorByUsername(req.params.username)
    if (!doctor) throw new NotFoundError()
    res.send({
      money: doctor.walletMoney ?? 0,
    } satisfies GetWalletMoneyResponse)
  })
)
