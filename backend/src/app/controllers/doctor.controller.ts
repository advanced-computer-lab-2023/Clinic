import { Router } from 'express'

import {
  acceptEmploymentContract,
  acceptFollowupRequest,
  addAvailableTimeSlots,
  approveDoctor,
  getAllDoctors,
  getApprovedDoctorById,
  getDoctorByUsername,
  getDoctorFollowupRequests,
  getDoctorSessionRateWithMarkup,
  getPendingDoctorRequests,
  rejectDoctor,
  rejectEmploymentContract,
  rejectFollowupRequest,
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
  GetDoctorsForPatientsResponse,
} from 'clinic-common/types/doctor.types'
import { isAdmin } from '../services/auth.service'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { APIError, NotFoundError } from '../errors'
import { validate } from '../middlewares/validation.middleware'
import {
  AddAvailableTimeSlotsRequestValidator,
  UpdateDoctorRequestValidator,
} from 'clinic-common/validators/doctor.validator'
import { type UserDocument, UserModel, IUser } from '../models/user.model'
import { PatientModel } from '../models/patient.model'
import { type HydratedDocument } from 'mongoose'

import { type HealthPackageDocument } from '../models/healthPackage.model'
import {
  getDoctorSessionRateForPatient,
  hasDiscountOnDoctorSession,
} from '../services/healthPackage.service'
import { GetDoctorsForPatientsRequest } from 'clinic-common/types/doctor.types'
import { DoctorModel } from '../models/doctor.model'
import {
  FollowupRequestResponseBase,
  GetFollowupRequestsResponse,
} from 'clinic-common/types/appointment.types'
import { AppointmentModel } from '../models/appointment.model'

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

doctorsRouter.post(
  '/for-patient',
  asyncWrapper<GetDoctorsForPatientsRequest>(async (req, res) => {
    const user = await UserModel.findOne({ username: req.body.patientUsername })

    if (!user) throw new NotFoundError()

    const patient = await PatientModel.findOne({
      user: user.id,
    })

    if (!patient) throw new NotFoundError()

    const appointments = await AppointmentModel.find({
      patientID: patient.id,
    })

    const doctorIds = Array.from(
      new Set(appointments.map((appointment) => appointment.doctorID))
    )

    const doctors = await DoctorModel.find({
      _id: { $in: doctorIds },
    }).populate<{ user: IUser }>('user')

    res.send(
      doctors.map((d) => ({
        id: d.id,
        username: d.user.username,
        name: d.name,
      })) satisfies GetDoctorsForPatientsResponse
    )
  })
 )
doctorsRouter.get(
  '/followupRequests',
  asyncWrapper(async (req, res) => {
    if (!req.username) {
      throw new NotFoundError()
    }

    const followupRequests = await getDoctorFollowupRequests(req.username)
    const fetchAppointments = followupRequests.map(async (request) => {
      const appointment = await AppointmentModel.findById(request.appointment)

      if (!appointment) {
        throw new NotFoundError()
      }

      return { request, appointment }
    })

    const resolvedFetchAppointments = await Promise.all(fetchAppointments)

    const followupRequestResponsesPromises = resolvedFetchAppointments.map(
      async ({ request, appointment }) => {
        const patient = await PatientModel.findById(appointment.patientID)

        if (!patient) {
          throw new NotFoundError()
        }

        return new FollowupRequestResponseBase(
          request.id,
          appointment.patientID.toString(),
          patient.name,
          appointment.date,
          request.date,
          appointment.familyID,
          appointment.reservedFor
        )
      }
    )

    const followupRequestResponses = await Promise.all(
      followupRequestResponsesPromises
    )

    const response = new GetFollowupRequestsResponse(followupRequestResponses)

    res.send(response)
  })
)

doctorsRouter.patch(
  '/acceptFollowupRequest/:id',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    await acceptFollowupRequest(req.params.id)
    res.send()
  })
)

doctorsRouter.patch(
  '/rejectFollowupRequest/:id',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    await rejectFollowupRequest(req.params.id)
    res.send()
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
