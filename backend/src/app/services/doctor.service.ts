import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import { UserModel, type UserDocument } from '../models/user.model'
import {
  AddAvailableTimeSlotsRequest,
  DoctorStatus,
  type UpdateDoctorRequest,
} from 'clinic-common/types/doctor.types'
import { APIError, NotFoundError } from '../errors'
import { type WithUser } from '../utils/typeUtils'
import {
  FollowupRequestDocument,
  FollowupRequestModel,
} from '../models/followupRequest.model'
import { AppointmentModel } from '../models/appointment.model'

/**
 * TODO: Replace DoctorDocumentWithUser with WithUser<DoctorDocument>,
 * leaving it for now not to break other PRs
 */
export type DoctorDocumentWithUser = WithUser<DoctorDocument>

export async function getPendingDoctorRequests(): Promise<
  DoctorDocumentWithUser[]
> {
  const models = await DoctorModel.find({
    requestStatus: DoctorStatus.Pending,
  }).populate<{ user: UserDocument }>('user')

  return models
}

export async function updateDoctorByUsername(
  username: string,
  request: UpdateDoctorRequest
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const doctor = await DoctorModel.findOne({ user: user.id })

  // If the doctor tried to change their email with the same email they already have,
  // no errors should be thrown, otherwise, check if the email already exists
  if (
    doctor?.email !== request.email &&
    (await DoctorModel.count({ email: request.email })) > 0
  ) {
    throw new APIError('Email already exists', 400)
  }

  const updatedDoctor = await DoctorModel.findOneAndUpdate(
    { user: user.id },
    request,
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')

  if (updatedDoctor == null) {
    throw new NotFoundError()
  }

  return updatedDoctor
}

// fetches approved doctors only
export async function getAllDoctors(): Promise<DoctorDocumentWithUser[]> {
  const models = await DoctorModel.find({
    requestStatus: 'approved',
  }).populate<{ user: UserDocument }>('user')

  return models
}

export async function getDoctorByUsername(
  username: string
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const doctor = await DoctorModel.findOne({ user: user.id }).populate<{
    user: UserDocument
  }>('user')

  if (doctor == null) throw new NotFoundError()

  return doctor
}

export async function getApprovedDoctorById(
  doctorId: string
): Promise<DoctorDocumentWithUser> {
  const doctor = await DoctorModel.findById({
    _id: doctorId,
    requestStatus: 'approved',
  }).populate<{
    user: UserDocument
  }>('user')

  if (doctor == null) throw new NotFoundError()

  return doctor
}

export async function approveDoctor(
  doctorId: string
): Promise<DoctorDocumentWithUser> {
  const doctor = await DoctorModel.findByIdAndUpdate(
    doctorId,
    { requestStatus: 'approved' },
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')
  if (doctor == null) throw new NotFoundError()
  const doctorWithContract = await DoctorModel.findByIdAndUpdate(
    doctorId,
    {
      $push: {
        employmentContract: [
          `Name:${doctor.name}`,
          `Fees:${doctor.hourlyRate}`,
          `ClinicMarkUp:10%`,
          `ContractStatus:${doctor.contractStatus}`,
          `ContractDuration:1 Year`,
        ],
      },
    },
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')
  if (doctorWithContract == null) throw new NotFoundError()

  return doctorWithContract
}

export async function rejectDoctor(
  doctorId: string
): Promise<DoctorDocumentWithUser> {
  const doctor = await DoctorModel.findByIdAndUpdate(
    doctorId,
    { requestStatus: 'rejected' },
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')
  if (doctor == null) throw new NotFoundError()

  return doctor
}

export async function addAvailableTimeSlots(
  username: string,
  req: AddAvailableTimeSlotsRequest
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const doctor = await DoctorModel.findOneAndUpdate(
    { user: user.id },
    { $push: { availableTimes: new Date(req.time) } },
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')
  if (doctor == null) throw new NotFoundError()

  return doctor
}

export async function rejectEmploymentContract(
  username: string
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const doctor = await DoctorModel.findOneAndUpdate(
    { user: user.id },
    {
      contractStatus: 'rejected',
      'employmentContract.3': `ContractStatus:rejected`,
    },
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')
  if (doctor == null) throw new NotFoundError()

  return doctor
}

export async function acceptEmploymentContract(
  username: string
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const doctor = await DoctorModel.findOneAndUpdate(
    { user: user.id },
    {
      contractStatus: 'accepted',
      'employmentContract.3': `ContractStatus:accepted`,
    },
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')
  if (doctor == null) throw new NotFoundError()

  return doctor
}

export async function removeTimeFromDoctorAvailability(
  doctorID: string,
  timeToRemove: Date
): Promise<DoctorDocument | null> {
  // Find the doctor by ID
  const doctor = await DoctorModel.findById(doctorID)

  if (!doctor) {
    throw new NotFoundError()
  }

  // Ensure doctor.availableTimes exists before accessing it
  if (!doctor.availableTimes) {
    throw new APIError("Doctor's availableTimes is undefined", 400)
  }

  // Check if the time exists in the doctor's availableTimes array
  const removed = new Date(timeToRemove)
  const indexOfTimeToRemove = doctor.availableTimes.findIndex(
    (time) => time.getTime() === removed.getTime()
  )

  if (indexOfTimeToRemove === -1) {
    // The time is not found in the availableTimes array
    throw new APIError("Time not found in doctor's available times", 400)
  }

  // Remove the time from the availableTimes array
  doctor.availableTimes.splice(indexOfTimeToRemove, 1)

  // Save the updated doctor document
  const updatedDoctor = await doctor.save()

  return updatedDoctor
}

export function getDoctorSessionRateWithMarkup({
  doctor,
}: {
  doctor: Pick<DoctorDocument, 'employmentContract' | 'hourlyRate'>
}) {
  // TODO: Update this in MS3
  const clinicMarkup = Number(
    doctor.employmentContract[2].split(':')[1].replace('%', '')
  )

  return doctor.hourlyRate * (1 + clinicMarkup / 100)
}

export async function getDoctorFollowupRequests(
  username: string
): Promise<FollowupRequestDocument[]> {
  const doctor = await getDoctorByUsername(username)
  if (!doctor) throw new NotFoundError()

  const followupRequests = await FollowupRequestModel.find({
    appointment: {
      $in: await AppointmentModel.find({ doctorID: doctor.id }).distinct('_id'),
    },
  })

  const followupRequestsFiltered = followupRequests.filter(
    (status) => status.status === 'pending'
  )

  return followupRequestsFiltered
}

export async function rejectFollowupRequest(id: string): Promise<void> {
  const request = await FollowupRequestModel.findById(id)
  if (!request) throw new NotFoundError()

  request.status = 'rejected'
  await request.save()
}

export async function acceptFollowupRequest(id: string): Promise<void> {
  const request = await FollowupRequestModel.findById(id)
  if (!request) throw new NotFoundError()

  request.status = 'accepted'
  await request.save()
}
