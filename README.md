# Copilot & Sons: El7a2ny Clinic

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=40&pause=1000&color=F7187F&center=true&vCenter=true&random=false&width=1000&height=200&lines=Welcome+to+Copilot+%26+Sons%3A+El7a2ni!!+%F0%9F%98%B1)](https://git.io/typing-svg)

## Table of Contents

1. [🚀 Motivation](#-motivation)
2. [🧱 Build Status](#-build-status)
3. [🎨 Code Style](#-code-style)
4. [🎥 Screenshots & Video](#-screenshots--video)
5. [⚒️ Tech and Framework used](#-tech-and-framework-used)
6. [🔥 Features](#-features)
7. [💻 Code Examples](#-code-examples)
8. [🪛 Installation](#-installation)
9. [📚 API Reference](#-api-reference)
10. [🧪 Tests](#-tests)
11. [🧑🏻‍🏫 How to Use](#-how-to-use)
12. [🤝 Contribute](#-contribute)
13. [🫡 Credits](#-credits)
14. [📜 License](#-license)

## 🚀 Motivation

Welcome to Copilot&Sons El7a2ny Clinic, a cutting-edge virtual clinic management software. This project is driven by the vision to enhance the healthcare experience for clinics, doctors, and patients by introducing a comprehensive platform that simplifies and automates key interactions within the healthcare ecosystem.

## 🧱 Build Status

![example workflow](https://github.com/Advanced-Computer-Lab-2023/Copilot-and-Sons-Pharmacy/actions/workflows/compile.yml/badge.svg)
![example workflow](https://github.com/Advanced-Computer-Lab-2023/Copilot-and-Sons-Pharmacy/actions/workflows/lint.yml/badge.svg)

## 🎨 Code Style

We use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) to enforce a consistent code style. We use an edited version of the default ESLint TypeScript config. You can check the config in the [.eslintrc.js](.eslintrc.js) file.

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

## 🎥 Screenshots & Video

## ⚒️ Tech and Framework used

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
        healthPackage.familyMemberSubscribtionDiscount,
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

## 🪛 Installation

<details>
<summary>Without Docker (Recommended)</summary>

### Running without Docker (Recommended)

- Make sure you have [Node](https://nodejs.org/en) and [Git](https://git-scm.com/) installed

- Clone this repo

```bash
git clone https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic
```

- Install dependencies

```bash
npm install
```

- Start the project

```bash
npm start
```

</details>

<details>
<summary>Running with Docker</summary>

### Running using Docker

- Make sure you have [Docker](https://www.docker.com/), [Node](https://nodejs.org/en) and [Git](https://git-scm.com/) installed
- Clone this repo

```bash
git clone https://github.com/advanced-computer-lab-2023/Copilot-and-Sons-Clinic
```

- Install dependencies

```bash
npm install
```

- Run using docker-compose

```bash
docker compose up
```

</details>

## 📚 API Reference

## 🧪 Tests

## 🧑🏻‍🏫 How to Use

## 🤝 Contribute

We welcome contributions to Copilot&Sons El7a2ny Clinic. If you want to contribute, it's as easy as:

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

## 🫡 Credits

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
