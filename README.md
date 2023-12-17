# Copilot & Sons: El7a2ny Clinic

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=40&pause=1000&color=F7187F&center=true&vCenter=true&random=false&width=1000&height=200&lines=Welcome+to+Copilot+%26+Sons%3A+El7a2ni!!+%F0%9F%98%B1)](https://git.io/typing-svg)

## Table of Contents

1. [🚀 Motivation](#-motivation)
2. [🧱 Build Status](#-build-status)
3. [🎨 Code Style](#-code-style)
4. [🎥 Screenshots & Video](#-screenshots--video)
5. [⚒️ Tech and Frameworks used](#-tech-and-framework-used)
6. [🔥 Features](#-features)
7. [💻 Code Examples](#-code-examples)
8. [⚙️ Installation](#-installation)
9. [📚 API Reference](#-api-reference)
10. [🧪 Tests](#-tests)
11. [🧑🏻‍🏫 How to Use](#-how-to-use)
12. [🤝 Contribute](#-contribute)
13. [©️ Credits](#-credits)
14. [📜 License](#-license)

## 🚀 Motivation

Welcome to Copilot & Sons El7a2ny Clinic, a cutting-edge virtual clinic management software. This project is driven by the vision to enhance the healthcare experience for clinics, doctors, and patients by introducing a comprehensive platform that simplifies and automates key interactions within the healthcare ecosystem.

## 🧱 Build Status

![example workflow](https://github.com/Advanced-Computer-Lab-2023/Copilot-and-Sons-Clinic/actions/workflows/test.yml/badge.svg)

- This project is under development and should not be used in a production settings
- Check **Issues** for a list of all the reported issues
- More automated tests should be added in the future
- More documentation should be added

## 🎨 Code Style

We use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to enforce a consistent code style. We use an edited version of the default ESLint TypeScript config. You can check the config in the [.eslintrc.js](.eslintrc.js) file.

<details>
<summary>Useful Commands</summary>

### Useful Commands

- Check formatting using Prettier

```bash
npm run format
```

- And then fix formatting using Prettier

```bash
npm run format:fix
```

- Check linting using ESLint

```bash
npm run lint
```

- And then fix linting using ESLint

```bash
npm run lint:fix
```

- Check compilation of all subpackages using TypeScript

```bash
npm run compile:all
```

</details>

## 🎥 Screenshots & Video

## ⚒️ Tech and Frameworks used

- [NodeJs](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [ReactJs](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [MUI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [React Query](https://react-query.tanstack.com/)
- [Formik](https://formik.org/)
- [Toastify](https://fkhadra.github.io/react-toastify/introduction)
- [Socket.io](https://socket.io/)
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [NodeMailer](https://nodemailer.com/about/)
- [JsonWebToken](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Postman](https://www.postman.com/)

## 🔥 Features

<details>
<summary>User Registration 📝</summary>

- Register as a patient with essential details.
- Upload/remove medical documents (PDF, JPEG, JPG, PNG).
- Submit a request to register as a doctor with professional details.
- Upload required documents for doctor registration.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/user-registration.png)
</details>

<details>
<summary>User Authentication 🔐</summary>
- Login and logout securely.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/user-authentication.png)
</details>

<details>
<summary>Administrator Functions 👩‍💼</summary>
- Add/remove another administrator.
- Manage doctors and patients.
- Accept or reject doctor registration requests.
- View information uploaded by doctors.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/administrator-functions.png)
</details>

<details>
<summary>Health Packages 💼</summary>
- Administrators can add/update/delete health packages with different price ranges.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/health-packages.png)
</details>

<details>
<summary>Account Management 🔄</summary>
- Change password.
- Reset forgotten password via email.
- Edit/update email, hourly rate, or affiliation.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/account-management.png)
</details>

<details>
<summary>Doctor Functions 🩺</summary>
- Accept employment contract.
- Add available time slots for appointments.
- View information and health records of registered patients.
- View a list of all patients.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/doctor-functions.png)
</details>

<details>
<summary>Patient Functions 🤒</summary>
- Add family members and link accounts.
- Pay for appointments using wallet or credit card.
- Subscribe to health packages for self and family.
- View subscribed health packages and subscription status.
- Cancel a subscription.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/patient-functions.png)
</details>

<details>
<summary>Appointment Management 📅</summary>
- Filter appointments by date/status.
- View upcoming/past appointments.
- Patient can reschedule or cancel appointments.
- Doctor can reschedule appointments for patients.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/appointment-management.png)
</details>

<details>
<summary>Prescription Management 💊</summary>
- Doctor can add/delete medicine to/from prescriptions.
- Doctor can add/update dosage for each medicine.
- Patients can view and filter prescriptions based on various criteria.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/prescription-management.png)
</details>

<details>
<summary>Wallet Management 💰</summary>
- Receive a refund in the wallet for canceled appointments.
- View the amount in the wallet.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/wallet-management.png)
</details>

<details>
<summary>Communication 📬</summary>
- Patients and doctors can chat with each other.
- Doctors and Patients can start/end video calls.
![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/communication.png)
</details>

## 💻 Code Examples

<details>
<summary>BE Routes Example</summary>

```js
router.use('/auth', authRouter)
router.use('/doctors', doctorsRouter)

router.use('/debug', debugRouter)

router.use('/prescriptions', prescriptionsRouter)
router.use('/family-members', familyMemberRouter)
router.use('/health-packages', healthPackagesRouter)
router.use('/patients', patientRouter)
router.use('/appointment', appointmentsRouter)
router.use('/admins', asyncWrapper(allowAdmins), adminRouter)
```

</details>

<details>
<summary>BE Add Health Package Controller Example</summary>

```js
export const healthPackagesRouter = Router()

healthPackagesRouter.post(
  '/',
  asyncWrapper(allowAdmins),
  validate(CreateHealthPackageRequestValidator),
  asyncWrapper<createHealthPackageRequest>(async (req, res) => {
    const healthPackage = await addHealthPackages(req.body)

    res.send({
      name: healthPackage.name,
      id: healthPackage.id,
      pricePerYear: healthPackage.pricePerYear,
      sessionDiscount: healthPackage.sessionDiscount,
      medicineDiscount: healthPackage.medicineDiscount,
      familyMemberSubscribtionDiscount:
        'healthPackage'.familyMemberSubscribtionDiscount,
    } satisfies AddHealthPackageResponse)
  })
)
```

</details>

<details>
<summary>BE Add Health Package Service Example</summary>

```js

export async function addHealthPackages(
  request: createHealthPackageRequest
): Promise<HydratedDocument<HealthPackageDocument>> {
  const healthPackage = await HealthPackageModel.create({
    name: request.name,
    pricePerYear: request.pricePerYear,
    sessionDiscount: request.sessionDiscount,
    medicineDiscount: request.medicineDiscount,
    familyMemberSubscribtionDiscount: request.familyMemberSubscribtionDiscount,
  })

  return healthPackage
}
```

</details>

<details>
<summary>BE Health Package Model Example</summary>

```js
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const healthPackageSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    pricePerYear: { type: Number, required: true },
    sessionDiscount: { type: Number, required: true },
    medicineDiscount: { type: Number, required: true },
    familyMemberSubscribtionDiscount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export type HealthPackageDocument = mongoose.InferSchemaType<
  typeof healthPackageSchema
>

export const HealthPackageModel = mongoose.model(
  'HealthPackage',
  healthPackageSchema
)
```

</details>

<details>
<summary>Add Health Package Validator Example</summary>

```js
import * as zod from 'zod'

export const CreateHealthPackageRequestValidator = zod.object({
  name: zod.string().min(1),
  pricePerYear: zod.number(),
  sessionDiscount: zod.number(),
  medicineDiscount: zod.number(),
  familyMemberSubscribtionDiscount: zod.number(),
})
```

</details>

<details>
<summary>Health Package TypeScript Types Example</summary>

```js
export type createHealthPackageRequest = z.infer<
  typeof CreateHealthPackageRequestValidator
>

export type UpdateHealthPackageRequest = z.infer<
  typeof UpdateHealthPackageRequestValidator
>

export interface HealthPackageResponseBase {
  name: string
  id: string
  pricePerYear: number
  sessionDiscount: number
  medicineDiscount: number
  familyMemberSubscribtionDiscount: number
}

export interface UpdateHealthPackageResponse
  extends HealthPackageResponseBase {}

export interface AddHealthPackageResponse extends HealthPackageResponseBase {}
```

</details>

<details>
<summary>FE Admin Dashboard Routes Example</summary>

```js

export const adminDashboardRoutes: RouteObject[] = [
  {
    element: <AdminDashboardLayout />,
    children: [
      {
        path: '',
        element: <AdminDashboardHome />,
      },
      {
        path: 'change-password',
        element: <ChangePassword />,
      },

      {
        path: 'pending-doctors',
        element: <PendingDoctors />,
      },
      {
        path: 'pending-doctors/:username',
        element: <PendingDoctorDetails />,
      },
      {
        path: 'health-packages',
        element: <HealthPackages />,
      },
      {
        path: 'add-health-package',
        element: <AddHealthPackage />,
      },
      {
        path: 'update-health-package/:id',
        element: <UpdateHealthPackage />,
      },
      {
        path: 'add-admin',
        element: <AddAdmin />,
      },
      {
        path: 'add-admin',
        element: <AddAdmin />,
      },
      {
        path: 'users',
        element: <Users />,
      },
    ],
  },
]
```

</details>

<details>
<summary>FE Add Health Package Page Example</summary>

```js

export function AddHealthPackage() {
  const navigate = useNavigate()

  return (
    <ApiForm<createHealthPackageRequest>
      fields={[
        { label: 'Name', property: 'name' },
        {
          label: 'Price Per Year',
          property: 'pricePerYear',
          valueAsNumber: true,
        },
        {
          label: 'Session Discount Percentage',
          property: 'sessionDiscount',
          valueAsNumber: true,
        },
        {
          label: 'Medicine Discount Percentage',
          property: 'medicineDiscount',
          valueAsNumber: true,
        },
        {
          label: 'Family Member Subscribtion Discount Percentage',
          property: 'familyMemberSubscribtionDiscount',
          valueAsNumber: true,
        },
      ]}
      validator={CreateHealthPackageRequestValidator}
      successMessage="Added health package successfully"
      action={(data) => addHealthPackage(data)}
      onSuccess={() => {
        navigate('/admin-dashboard/health-packages')
      }}
    />
  )
}
```

</details>

## ⚙️ Installation

- Make sure you have [Node](https://nodejs.org/en) and [Git](https://git-scm.com/) installed

- Make a new folder for the sub system of Clinic & Pharmacy

```bash
mkdir Copilot-and-Sons
cd Copilot-and-Sons
```

- Clone this repo + pharmacy repo

```bash
git clone https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic
git clone https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Pharmacy
```

- Install dependencies for clinic

```bash
cd Copilot-and-Sons-Clinic
npm install
```

- Install dependencies for pharmacy

```bash
cd ../Copilot-and-Sons-Pharmacy
npm install
```

## 📚 API Reference

<details>
<summary>Admin Endpoints</summary>

- `POST /admins` - Add a new admin
  - **Request body**
    - `username`: string
    - `password`: string
    - `email`: string
  - **Response**: The created admin
- `GET /admins/get-users` - Get all users
  - **Response**: A list of all users
  ```
  [
      {
          username: string,
          type: string
      }
  ]
  ```
- `DELETE /admins/username/:id` - Delete a user by username
</details>

<details>
<summary>Appointment Endpoints</summary>

- `GET /appointment/filter` - Returns a list of all appointments
  - **Response Body**
  ```
  [
      {
          'id': string,
          'patientID': string,
          'doctorID': string,
          'doctorName': string,
          'doctorTimes': string[],
          'date': string,
          'familyID': string,
          'reservedFor': string
          'status': AppointmentStatus
      }
  ]
  ```
- `POST /appointment/makeappointment` - Reserve an appointment
  - **Request Body**
  ```
  {
      'doctorid': string,
      'date': Date | null,
      'familyID': string,
      'reservedFor': string,
      'toPayUsingWallet': number,
      'sessionPrice': number
  }
  ```
  - **Response Body**
  ```
  {
      'id': string,
      'patientID': string,
      'doctorID': string,
      'doctorName': string,
      'doctorTimes': string[],
      'date': string,
      'familyID': string,
      'reservedFor': string
      'status': AppointmentStatus
  }
  ```
- `POST /appointment/delete/:id` - Delete an appointment
  - **Request Body**
  ```
  {
      'appointmentId': string,
      'cancelledByDoctor': boolean
  }
  ```
- `POST /appointment/reschedule` - Reschedule an appointment - **Request Body**
`     {
        appointment: string, 
        rescheduleDate: string
    }
    ` - **Response Body**
`     {
        'id': string,
        'patientID': string,
        'doctorID': string,
        'doctorName': string,
        'doctorTimes': string[],
        'date': string,
        'familyID': string,
        'reservedFor': string
        'status': AppointmentStatus
    }
    `
</details>

<details>
<summary>Auth Endpoints</summary>

- `POST /auth/login` - Authenticate a user and retrieve an access token.

  - **Request Body:**

  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

  - **Response Body:**

  ```json
  {
    "token": "string"
  }
  ```

- `POST /auth/register-patient` - Register a patient and obtain an access token.

  - **Request Body:**

  ```json
  {
    "username": "string",
    "name": "string",
    "email": "string",
    "password": "string",
    "dateOfBirth": "string",
    "gender": "string",
    "mobileNumber": "string",
    "emergencyContact": {
      "fullName": "string",
      "mobileNumber": "string"
    }
  }
  ```

  - **Response Body:**

  ```json
  {
    "token": "string"
  }
  ```

- `GET /auth/me` - Retrieve information about the currently authenticated user.

- **Response Body:**

  ```json
  {
    "id": "string",
    "username": "string",
    "name": "string",
    "email": "string",
    "dateOfBirth": "string",
    "gender": "string",
    "mobileNumber": "string",
    "emergencyContact": {
      "fullName": "string",
      "mobileNumber": "string"
    }
  }
  ```

- `POST /patient/requestOtp` - Request to send OTP for forgetting password

  - **Request Body:**

  ```
  {
      email: string
  }
  ```

  - **Response Body:**: N/A

- `POST /patient/verifyOtp` - Verify OTP for forgetting password

  - **Request Body:**

  ```
  {
      email: string,
      otp: string,
  }
  ```

  - **Response Body:**: N/A

- `POST /patient/updatePassword` - Update patient password after forgetting password

      - **Request Body:**
      ```
      {
          email: string,
          newPassword: string
      }
      ```

      - **Response Body:**: N/A

</details>

<details>
<summary>Chat Endpoints</summary>

- `POST '/chats/get-all' - Get all chats for a user
  - **Request Body**:
  ```
  {
      'username': string // Could be username of a patient, doctor, or admin
  }
  ```
  - **Response Body**
  ```
  {
      'id': string
      'users': Array<{
          'id': string
          'username': string
          'name': string
          'email': string
          'type': UserType
      }>
      'createdAt': string
      'lastMessage': string
      'hasUnreadMessages': boolean
  }
  ```
- `POST /chats/create-or-get` - Creates a new chat or gets one if it already exists between the users
  - **Request Body**
    ```
    {
        'initiator': string
        'receiver': string
    }
    ```
  - **Reponse Body**: `string` -> ID of the created chat
- `POST /chats/get-by-id` - Gets a chat by its id

  - **Request Body**
    ```
    {
        'chatId': string
        'readerUsername': string
    }
    ```
  - **Reponse Body**
    ```
    {
        'id': string
        users: Array<{
            'id': string
            'username': string
            'name': string
            'email': string
            'type': UserType
        }>
        'messages': Array<{
            'id': string
            'sender': string
            'senderType': UserType
            'senderDetails': {
                'name': string
                'email': string
            }
            'content': string
            'createdAt': string
        }>
        'createdAt': string
        'lastMessage': string
        'hasUnreadMessages': boolean
    }
    ```

- `POST /chats/send-message` - Sends a message

  - **Request Body**
    ```
    {
        'chatId': string
        'senderUsername': string
        'content': string
    }
    ```
  - **Reponse Body**: N/A

- `POST '/chats/mark-as-read'` - Marks a chat as being read
  - **Request Body**
    ```
    {
        'chatId': string
        'username': string
    }
    ```
  - **Reponse Body**: N/A

</details>

<details>
<summary>Doctors Endpoints</summary>

- `PATCH '/doctors/updateDoctor/:username'` - Updates a doctor information
  - **Request Body**
    ```
    {
        'name': string,
        'email': string,
        'dateOfBirth': string,
        'hourlyRate': number,
        'affiliation': string,
        'educationalBackground': string,
    }
    ```
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
    }
    ```
- `GET /doctors/:username` - Gets doctor information by username

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
        'contractStatus': ContractStatus
        'availableTimes': [Date]
        'employmentContract': [string]
        'documents': [string]
        'wallet': number
    }
    ```

- `GET /doctors/pending` - Gets pending doctors requests

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'doctors': Array<{
            'id': string
            'username': string
            'name': string
            'email': string
            'dateOfBirth': Date
            'hourlyRate': number
            'affiliation': string
            'educationalBackground': string
            'speciality': string
            'requestStatus': DoctorStatus
        }>
    }
    ```

- `GET /doctors/approved` - Gets approved doctors

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'doctors': Array<{
            'id': string
            'username': string
            'name': string
            'email': string
            'dateOfBirth': Date
            'hourlyRate': number
            'affiliation': string
            'educationalBackground': string
            'speciality': string
            'requestStatus': DoctorStatus
        }>
    }
    ```

- `GET /doctors/approved/:id` - Gets approved doctor by id

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
        'availableTimes': [Date]
        'sessionRate': number
        'hasDiscount': boolean
        'hourlyRateWithMarkup': number
    }
    ```

- `PATCH /doctors/acceptDoctorRequest/:id` - Accept a doctor by id
  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
        'availableTimes': [Date]
        'sessionRate': number
        'hasDiscount': boolean
        'hourlyRateWithMarkup': number
    }
    ```
- `PATCH /doctors/rejectDoctorRequest/:id` - Reject a doctor by id
  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
        'availableTimes': [Date]
        'sessionRate': number
        'hasDiscount': boolean
        'hourlyRateWithMarkup': number
    }
    ```
- `PATCH /doctors/addAvailableTimeSlots` - Add available time slots for doctor

  - **Request Body**:
    ```
    {
        'time': Date,
    }
    ```
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
        'availableTimes': [Date]
    }
    ```

- `PATCH /doctors/acceptEmploymentContract` - Accept employment contract

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
        'contractStatus': ContractStatus
        'availableTimes': [Date]
        'employmentContract': [string]
        'documents': [string]
    }
    ```

- `PATCH /doctors/rejectEmploymentContract` - Reject employment contract
  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
        'contractStatus': ContractStatus
        'availableTimes': [Date]
        'employmentContract': [string]
        'documents': [string]
    }
    ```
- `GET /doctors/wallet/:username` - Get doctor's wallet money

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'money': number
    }
    ```

- `POST /doctors/for-patient` - Get doctor for patient
  - **Request Body**:
    ```
    {
       'patientUsername': string
    }
    ```
  - **Reponse Body**:
    ```
    [
        {
            'id': string
            'username': string
            'name': string
        }
    ]
    ```
- `POST /auth/request-doctor'` - Request to register as a doctor
  - **Request Body**:
    ```
    {
        'name': string
        'email': string
        'username': string
        'password': string
        'dateOfBirth': string
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'documents': File[]
    }
    ```
  - **Reponse Body**:
    ```
    {
        'id': string
        'username': string
        'name': string
        'email': string
        'dateOfBirth': Date
        'hourlyRate': number
        'affiliation': string
        'educationalBackground': string
        'speciality': string
        'requestStatus': DoctorStatus
    }
    ```
- `POST /patients/uploadHealthRecords/:id'` - Upload health record for a patient

  - **Request Body**:
    ```
    {
        HealthRecord: File[]
    }
    ```
  - **Reponse Body**:
    ```
    {
        'id': string,
        'username': string,
        'name': string,
        'email': string,
        'mobileNumber': string,
        'dateOfBirth': Date,
        'gender': Gender,
        'emergencyContact': {
            'name': string
            'mobileNumber': string
        },
        'notes': string[]
    }
    ```

- `POST /patients/deleteHealthRecord/:id'` - Delete health record for a patient

  - **Request Body**:
    ```
    {
        url: string // URL to delete
    }
    ```
  - **Reponse Body**: N/A

- `GET /patients/getMedicalHistory/:id` - Get medical history of patient

  - **Request Body**: N/A
  - **Reponse Body**: `[string]`

- `PATCH /doctors/acceptFollowupRequest/:id` - Accept a followup request by id of the request
  - **Request Body**: N/A
  - **Reponse Body**: N/A
- `PATCH /doctors/rejectFollowupRequest/:id` - Reject a followup request by id of the request - **Request Body**: N/A - **Reponse Body**: N/A
</details>

<details>
<summary>Family Members Endpoints</summary>

- `GET /family-members/mine` - Get family members of currently logged in user

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'id': string
        'name': string
        'nationalId': string
        'age': number
        'gender': Gender
        'relation': Relation
        'healthPackage': {
            'name'?: string
            'renewalDate'?: string
            'id'?: string
        }
        'healthPackageHistory': [
            { package: string; date: Date }
         ] //has the name not id
    }
    ```

- `GET /family-members/linking-me` - Get names of users linking me as family member

  - **Request Body**: N/A
  - **Reponse Body**: `[string]`

- `GET /family-members/:id` - Get family member details by id

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'familyMember': {
            'id': string
            'name': string
            'nationalId': string
            'age': number
            'gender': Gender
            'relation': Relation
            'healthPackage': {
                'name'?: string
                'renewalDate'?: string
                'id'?: string
            }
            'healthPackageHistory': [
                { package: string; date: Date }
            ] //has the name not id
        }
        'patient': {
            'id': string,
            'username': string,
            'name': string,
            'email': string,
            'mobileNumber': string,
            'dateOfBirth': Date,
            'gender': Gender,
            'emergencyContact': {
                'name': string
                'mobileNumber': string
            },
            'notes': string[]
        }
    }
    ```

- `POST /family-members/:username:` - Add a family member to patient that has certain username

  - **Request Body**:
    ```
    {
        name: string,
        nationalId: string,
        age: number,
        gender: string,
        relation: string,
    }
    ```
  - **Reponse Body**: N/A

- `POST /family-members/link` - Link a family member

  - **Request Body**:
    ```
    {
        'email'?: string,
        'phonenumber'?: string,
        'relation': string,
    }
    ```
  - **Reponse Body**:
    ```
    {
        'id': string
        'name': string
        'nationalId': string
        'age': number
        'gender': Gender
        'relation': Relation
        'healthPackage': {
            'name'?: string
            'renewalDate'?: string
            'id'?: string
        }
        'healthPackageHistory': [
            { package: string; date: Date }
        ] //has the name not id
    }
    ```

- `GET /family-members/mine/linked` - Get linked family members of current user - **Request Body**: N/A - **Reponse Body**:
`          {
            'id': string
            'patientId': string
            'username': string
            'mobileNumber': string
            'email': string
            'dateOfBirth': string
            'name': string
            'gender': string
            'relation': Relation
            'healthPackage': {
                'name': string
                'id': string
            }
        }
        `
</details>

<details>
<summary>Health Packages Endpoints</summary>

- `POST /health-packages/for-patient` - Get health packages for patient

  - **Request Body**:
    ```
    {
        'patientId': string,
        'isFamilyMember': boolean, // Whether the patient is a family member or an actual patient
    }
    ```
  - **Reponse Body**:
    ```
    [
        {
            'name': string
            'id': string
            'pricePerYear': number
            'sessionDiscount': number
            'medicineDiscount': number
            'familyMemberSubscribtionDiscount': number
            'discountedPricePerYear': number
        }
    ]
    ```

- `GET /health-packages` - Get all health packages

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    [
        {
            'name': string
            'id': string
            'pricePerYear': number
            'sessionDiscount': number
            'medicineDiscount': number
            'familyMemberSubscribtionDiscount': number
        }
    ]
    ```

- `GET /health-packages/:id` - Get a health package by id
  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    {
        'name': string
        'id': string
        'pricePerYear': number
        'sessionDiscount': number
        'medicineDiscount': number
        'familyMemberSubscribtionDiscount': number
    }
    ```
- `PATCH /health-packages/:id` - Update a health package by id

  - **Request Body**:
    ```
    {
        name: string,
        pricePerYear: number,
        sessionDiscount: number,
        medicineDiscount: number,
        familyMemberSubscribtionDiscount: number,
    }
    ```
  - **Reponse Body**: `string` -> ID of the updated health package

- `POST /health-packages` - Create a health package

  - **Request Body**:
    ```
    {
        name: string,
        pricePerYear: number,
        sessionDiscount: number,
        medicineDiscount: number,
        familyMemberSubscribtionDiscount: number,
    }
    ```
  - **Reponse Body**:
    ```
    {
        'name': string
        'id': string
        'pricePerYear': number
        'sessionDiscount': number
        'medicineDiscount': number
        'familyMemberSubscribtionDiscount': number
    }
    ```

- `DELETE /health-packages/:id` - Delete a health package
  - **Request Body**: N/A
  - **Reponse Body**: `string` -> ID of the deleted health package
- `GET /health-packages/isPackageHasSubscribers/:id` - Check if a health package has subscribers
  - **Request Body**: N/A
  - **Reponse Body**: `boolean`
- `PATCH /health-packages/wallet/subscriptions` - Subscribe to a health package using wallet

  - **Request Body**:

    ```
    {
        // patientId or familyMemberId for the person that should be subscribed to the health package
        'subscriberId': string

        // The person that is paying for the subscription
        'payerUsername': string

        // Indicates whether the subscribee is a the id for FamilyMember or Patient
        'isFamilyMember': boolean
        'healthPackageId': string
    }
    ```

  - **Reponse Body**: N/A

- `PATCH /health-packages/credit-card/subscriptions` - Subscribe to a health package using credit card

  - **Request Body**:

    ```
    {
        // patientId or familyMemberId for the person that should be subscribed to the health package
        'subscriberId': string

        // The person that is paying for the subscription
        'payerUsername': string

        // Indicates whether the subscribee is a the id for FamilyMember or Patient
        'isFamilyMember': boolean
        'healthPackageId': string
    }
    ```

  - **Reponse Body**: N/A

- `POST /health-packages/unsubscribe` - Unsubscribe to a health package using credit card
  - **Request Body**:
    ```
    {
        'subscriberId': string
        'payerUsername': string
        'isFamilyMember': boolean
    }
    ```
  - **Reponse Body**: N/A
- `POST /health-packages/subscribed` - Get health package of user
  - **Request Body**:
    ```
    {
        'patientId': string // patientId or familyMemberId
        'isFamilyMember': boolean
    }
    ```
  - **Reponse Body**:
    ```
    {
        healthPackage: {
            'name': string
            'id': string
            'pricePerYear': number
            'sessionDiscount': number
            'medicineDiscount': number
            'familyMemberSubscribtionDiscount': number
            'renewalDate': string
            'remainingMonths': number
        },
    }
    ```
- `POST /health-packages/patient-cancelled` - Get cancelled health packages of user
  - **Request Body**:
    ```
    {
        'id': string // patientId or familyMemberId
        'isFamilyMember': boolean
    }
    ```
  - **Reponse Body**:
    ```
    {
        // Maps ID of cancelled healthPackage to Date of cancellation
        [id: string]: string
    }
    ```
- `POST /health-packages/cancellation-date/:healthPackageId` - Get cancellation date for health package of user - **Request Body**:
  `        { id: string; isFamilyMember: boolean }` - **Reponse Body**: `string` -> Date of cancellation
  </details>

<details>
<summary>Notifications Endpoints</summary>

- `POST /notifications/all'` - Get all notifications for a user

  - **Request Body**:
    ```
    {
        'username': string,
    }
    ```
  - **Reponse Body**:
    ```
    {
        notifications: [
            {
                _id: string
                title: string
                description?: string
            }
        ]
    }
    ```

- `DELETE /notifications'` - Delete a notification
  - **Request Body**:
  ```
  {
    username: string,
    notificationId: string,
  }
  ```
  - **Reponse Body**: N/A

</details>

<details>
<summary>Patient Endpoints</summary>

- `GET /patients/myPatients'` - Get all patients for a user

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    [
        {
            id: string
            name: string
            username: string
            email: string
            mobileNumber: string
            dateOfBirth: string
            gender: Gender
            emergencyContact: {
                name: string
                mobileNumber: string
            }
            familyMembers: string[]
        }
    ]
    ```

- `GET /patients/search?name={name}` - Search for patient by name

  - **Request Body**: N/A
  - **Reponse Body**:

  ```
  [
      {
          id: string
          name: string
          username: string
          email: string
          mobileNumber: string
          dateOfBirth: string
          gender: Gender
          emergencyContact: {
              name: string
              mobileNumber: string
          }
          familyMembers: string[]
      }
  ]
  ```

- `GET /patients/filter` - Filter patients

  - **Request Body**: N/A
  - **Reponse Body**:

  ```
  [
      {
          id: string
          name: string
          username: string
          email: string
          mobileNumber: string
          dateOfBirth: string
          gender: Gender
          emergencyContact: {
              name: string
              mobileNumber: string
          }
          familyMembers: string[]
      }
  ]
  ```

- `GET /patients/:id` - Get patient by id

  - **Request Body**: N/A
  - **Reponse Body**:

  ```
  {
      id: string
      name: string
      username: string
      email: string
      mobileNumber: string
      dateOfBirth: string
      gender: Gender
      emergencyContact: {
          name: string
          mobileNumber: string
      }
      familyMembers: string[]
  }
  ```

- `GET /patients/username/:username` - Get patient by username
  - **Request Body**: N/A
  - **Reponse Body**:
  ```
  {
      id: string
      name: string
      username: string
      email: string
      mobileNumber: string
      dateOfBirth: string
      gender: Gender
      emergencyContact: {
          name: string
          mobileNumber: string
      }
      familyMembers: string[]
      documents: string[],
      appointments: [
          {
              'id': string,
              'patientID': string,
              'doctorID': string,
              'doctorName': string,
              'doctorTimes': string[],
              'date': string,
              'familyID': string,
              'reservedFor': string
              'status': AppointmentStatus
          }
      ],
      prescriptions: any[],
      notes: string[],
      walletMoney: number
  }
  ```
- `GET /patients/wallet/:id` - Get wallet money for a patient
  - **Request Body**: N/A
  - **Reponse Body**:
  ```
  {
      money: number
  }
  ```
- `GET /patients/viewHealthRecords/me` - Get health notes for current user
  - **Request Body**: N/A
  - **Reponse Body**: `[string]` -> The notes
- `GET /patients/viewMedicalHistory` - Get Medical History for current user

  - **Request Body**: N/A
  - **Reponse Body**: `[string]` -> The url of the documents

- `GET /patients/viewHealthRecords/Files/:id` - Get health notes for user by id
  - **Request Body**: N/A
  - **Reponse Body**: `[string]` -> The notes
- `POST /appointment/createFollowUp` - Create a follow up for a user
  - **Request Body**:
    ```
    {
        doctorID: string,
        patientID: string,
        followUpDate: Date,
        appointmentID: string
    }
    ```
  - **Reponse Body**: N/A
- `POST /patients/deleteMedicalHistory/mine'` - Delete a file from the medical history
  - **Request Body**:
    ```
    {
        url: string, // Url to delete
    }
    ```
  - **Reponse Body**: N/A
- `POST /patients/uploadMedicalHistory/mine` - Upload medical history
  - **Request Body**:
    ```
    {
        medicalHistory: File,
    }
    ```
  - **Reponse Body**: N/A
- `POST `/appointment/requestFollowUp` - Request a follow up
  - **Request Body**:
    ```
    {
      appointmentID: string,
      date: string
    }
    ```
  - **Reponse Body**: N/A
- `POST `/appointment/checkFollowUp/:appointmentID`- Checks if a follow up exists
    - **Request Body**:
        ```
       {
          appointmentID: string,
          date: string
        }
        ```
    - **Reponse Body**:`boolean` -> Whether the follow up exists or not
</details>

<details>
<summary>Prescriptions Endpoints</summary>

- `GET /prescriptions/mine'` - Get all prescriptions of current patient

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    [
        {
            'id': string,
            'doctor': string,
            'patient': string,
            'date': Date,
            'isFilled': boolean,
            'medicine': [
                {
                    'name': string
                    'dosage': string
                    'quantity': number
                }
            ]
        }
    ]
    ```

- `GET prescriptions/mine/:id` - Get a single prescription by id
  - **Request Body**: N/A
  - **Reponse Body**:
  ```
  {
      id: string
      name: string
      username: string
      email: string
      mobileNumber: string
      dateOfBirth: string
      gender: Gender
      emergencyContact: {
          name: string
          mobileNumber: string
      }
      familyMembers: string[]
  }
  ```
- `GET /prescriptions/:username` - Get prescriptions for patient

  - **Request Body**: N/A
  - **Reponse Body**:
    ```
    [
        {
            'id': string,
            'doctor': string,
            'patient': string,
            'date': Date,
            'isFilled': boolean,
            'medicine': [
                {
                    'name': string
                    'dosage': string
                    'quantity': number
                }
            ]
        }
    ]
    ```

- `POST /prescriptions` - Add a prescription to a patient

  - **Request Body**:
    ```
    {
        patient: string,
        medicine: string,
        date: string,
    }
    ```
    - **Reponse Body**:
      ```
        {
          'id': string,
          'doctor': string,
          'patient': string,
          'date': Date,
          'isFilled': boolean,
          'medicine': [
              {
                  'name': string
                  'dosage': string
                  'quantity': number
              }
          ]
      }
      ```

- `PUT /prescriptions/edit/:id` - Edit a prescription by id
  - **Request Body**:
    ```
    {
      medicine: [
        {
          name: string,
          dosage: string,
          quantity: number,
        }
      ],
      date: Date,
      patient: string // Id of patient
    }
    ```
    - **Reponse Body**: N/A

</details>

## 🧪 Tests

We use `jest` to automatically test parts of our code.
To run the tests, run the following command

```bash
> cd backend && npm run test
```

![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/jest.PNG)

We also use `Postman` to manually test all our api references by making sure the response is as expected. We use it as some kind of sanity-check.

Here is an example of testing one of our endpoints using Postman:

![image](https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic/blob/main/images/postman.PNG)

## 🧑🏻‍🏫 How to Use

- Make sure to follow the [Installation](#-installation) steps first

- Add a `.env` in the `backend` of both repos `Copilot-and-Sons-Clinic` and `Copilot-and-Sons-Pharmacy` with the following variables (replace the values with your own)

```bash
MONGO_URI="<Your Mongo Connection String>"
PORT=3000
BCRYPT_SALT="<A secret string to use for encrypting passwords>"
JWT_TOKEN="<A secret string to use for hashing JWT tokens>"
```

- Start clinic

```bash
cd Copilot-and-Sons-Clinic
npm start
```

- Start pharmacy in a different terminal

```bash
cd Copilot-and-Sons-Pharmacy
npm start
```

> **NOTE**
>
> If you want to use Docker Compose to start to project, you can replace the last step with `docker compose up`

## 🤝 Contribute

We welcome contributions to Copilot & Sons El7a2ny Clinic. If you want to contribute, it's as easy as:

1. Fork the repo
2. Create a new branch (`git checkout -b my-new-feature`)
3. Make changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create a new Pull Request
7. Wait for your PR to be reviewed and merged

> **NOTE**
>
> We welcome all contributions, but please make sure to follow our code style and linting rules. You can check the [Code Style](#-code-style) section for more details.

## ⚙️ Credits

### Docs

- [Mongoose docs](https://mongoosejs.com/docs/)
- [Express docs](https://expressjs.com/en/4x/api.html)
- [ReactJs docs](https://reactjs.org/docs/getting-started.html)
- [NodeJs docs](https://nodejs.org/en/docs/)
- [TypeScript docs](https://www.typescriptlang.org/docs/)
- [Docker docs](https://docs.docker.com/)
- [Docker Compose docs](https://docs.docker.com/compose/)
- [ESLint docs](https://eslint.org/docs/user-guide/getting-started)
- [Prettier docs](https://prettier.io/docs/en/index.html)
- [MUI docs](https://mui.com/getting-started/usage/)
- [React Router docs](https://reactrouter.com/en/6.21.0)
- [React Hook Form docs](https://react-hook-form.com/get-started)
- [React Query docs](https://react-query.tanstack.com/overview)
- [Formik docs](https://formik.org/docs/overview)
- [Toastify docs](https://fkhadra.github.io/react-toastify/introduction)

### YouTube Videos

- [Mongoose Crash Course](https://www.youtube.com/watch?v=DZBGEVgL2eE)
- [Express Crash Course](https://www.youtube.com/watch?v=SccSCuHhOw0)
- [ReactJs Crash Course](https://www.youtube.com/watch?v=w7ejDZ8SWv8)
- [MUI Crash Course](https://www.youtube.com/watch?v=vyJU9efvUtQ)
- [React Router Crash Course](https://www.youtube.com/watch?v=Law7wfdg_ls)
- [React Hook Form Crash Course](https://www.youtube.com/watch?v=-mFXqOaqgZk)
- [React Query Crash Course](https://www.youtube.com/watch?v=seU46c6Jz7E)

## 📜 License

The software is open source under the `Apache 2.0 License`.

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
