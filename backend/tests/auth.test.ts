import { describe, expect, test } from '@jest/globals'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../src/app'
//write ignore @typescript-eslint/no-unused-vars for prettier
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const MongoURL =
  process.env.MONGO_URI ??
  process.env.URL ??
  'mongodb+srv://darinmfadel:Darin2002@cluster0.ghfjumf.mongodb.net/project1?retryWrites=true&w=majority'

beforeAll(async () => {
  await mongoose.connect(MongoURL)
})

afterAll(async () => {
  await mongoose.connection.close()
})

const registerUserAndGetToken = (
  callback: (token: string) => void,
  random: number
) => {
  let userToken: string
  request(app)
    .post('/auth/register-patient')
    .send({
      username: `test${random}`,
      password: 'P@ssw0rd123',
      name: 'ramez',
      email: `test${random}@gmail.com`,
      mobileNumber: '01111111111',
      dateOfBirth: new Date(),
      gender: 'Male',
      emergencyContact: {
        fullName: 'test',
        mobileNumber: '01111111111',
        relation: 'test',
      },
    })
    .expect(200)
    .expect((res) => {
      console.log('token ', res.body.token)
      userToken = res.body.token
      expect(res.body.token).toBeDefined()
      expect(res.body.token).not.toBeNull()
    })
    .end((err) => {
      if (err) throw err
      callback(userToken)
    })
}

describe('Post auth/register-patient', () => {
  test('Create a new user', (done) => {
    const random = new Date().getTime()
    request(app)
      .post('/auth/register-patient')
      .send({
        username: `test${random}`,
        password: 'P@ssw0rd123',
        name: 'ramez',
        email: `test${random}@gmail.com`,
        mobileNumber: '01111111111',
        dateOfBirth: new Date(),
        gender: 'Male',
        emergencyContact: {
          fullName: 'test',
          mobileNumber: '01111111111',
          relation: 'test',
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.token).toBeDefined()
        expect(res.body.token).not.toBeNull()
      })
      .end((err) => {
        if (err) return done(err)
        done()
      })
  }, 150000)
  afterAll((done) => {
    done()
  })
})

describe('Post auth/login', () => {
  console.log('test here')
  const random = new Date().getTime()
  beforeAll((done: any) => {
    registerUserAndGetToken(() => {
      done()
    }, random)
  })
  test('Login a user', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        username: `test${random}`,
        password: 'P@ssw0rd123',
      })
      .expect(200)
      .expect((res) => {
        console.log('token ', res.body.token)
        expect(res.body.token).toBeDefined()
        expect(res.body.token).not.toBeNull()
      })
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.token).toBeDefined()
        done()
      })
  }, 150000)
  afterAll((done) => {
    done()
  })
})

describe('Get auth/me', () => {
  console.log('test here')
  const random = new Date().getTime()
  let userToken: string

  beforeAll((done: any) => {
    registerUserAndGetToken((token) => {
      userToken = token
      done()
    }, random)
  })
  test('Retrieve user profile using /auth/me', (done) => {
    request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.username).toBe(`test${random}`)
        expect(res.body.email).toBe(`test${random}@gmail.com`)
        expect(res.body.name).toBe('ramez')
        expect(res.body.type).toBe('Patient')
      })
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })

  afterAll((done) => {
    done()
  })
})

// authRouter.get(
//     '/:username',
//     allowAuthenticated,
//     asyncWrapper(async (req, res) => {
//       // Only admins and the user itself can access this endpoint
//       if (
//         req.params.username !== req.username &&
//         !(await isAdmin(req.username as string))
//       ) {
//         throw new NotAuthorizedError()
//       }

//       const user = await getUserByUsername(req.params.username)
//       const { email, name } = await getEmailAndNameForUsername(
//         req.params.username
//       )

//       res.send({
//         id: user.id,
//         username: user.username,
//         type: user.type as UserType,
//         modelId: await getModelIdForUsername(user.username),
//         email,
//         name,
//       } satisfies GetUserByUsernameResponse)
//     })
//   )

describe('Get auth/:username', () => {
  console.log('test here')
  const random = new Date().getTime()
  let userToken: string

  beforeAll((done: any) => {
    registerUserAndGetToken((token) => {
      userToken = token
      done()
    }, random)
  })
  test('Retrieve user profile using /auth/:username', (done) => {
    request(app)
      .get(`/auth/test${random}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.username).toBe(`test${random}`)
        expect(res.body.email).toBe(`test${random}@gmail.com`)
        expect(res.body.name).toBe('ramez')
        expect(res.body.type).toBe('Patient')
      })
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
  afterAll((done) => {
    done()
  })
})

describe('Post auth/request-doctor', () => {
  const random = new Date().getTime()
  test('Create a new doctor request', (done) => {
    request(app)
      .post('/auth/request-doctor')
      .send({
        username: `test${random}`,
        password: 'P@ssw0rd123',
        name: 'ramez',
        email: `test${random}@gmail.com`,
        mobileNumber: '01111111111',
        dateOfBirth: new Date(),
        hourlyRate: 100,
        affiliation: 'test',
        educationalBackground: 'test',
        speciality: 'test',
        documents: [],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBeDefined()
        expect(res.body.username).toBe(`test${random}`)
        expect(res.body.name).toBe('ramez')
        expect(res.body.email).toBe(`test${random}@gmail.com`)
        expect(res.body.dateOfBirth).toBeDefined()
        expect(res.body.hourlyRate).toBe(100)
        expect(res.body.affiliation).toBe('test')
        expect(res.body.educationalBackground).toBe('test')
        expect(res.body.speciality).toBe('test')
        expect(res.body.requestStatus).toBe('Pending')
      })
      .end((err) => {
        if (err) return done(err)
        done()
      })
  }, 150000)
  afterAll((done) => {
    done()
  })
})
