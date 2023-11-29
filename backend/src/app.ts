import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import { router } from './routes'
import mongoose from 'mongoose'
import { authenticate } from './app/middlewares/auth.middleware'
import { errorHandler } from './app/middlewares/errorHandler.middleware'
import { asyncWrapper } from './app/utils/asyncWrapper'
import { logger } from './app/middlewares/logger.middleware'
import { createServer } from 'http'
import { initializeSocket } from './socket'

const app = express()
const port = process.env.PORT ?? 3000
const MongoURL =
  process.env.MONGO_URI ??
  process.env.URL ?? // Keeping this for backwards compatibility
  'mongodb+srv://admin:admin@cluster0.ugek6la.mongodb.net/'

export const server = createServer(app)

export const socketIOServer = initializeSocket(server)

app.use(cors())
app.use(express.json())
app.use(logger)
app.use(asyncWrapper(authenticate))
app.use(router)
app.use(errorHandler)

mongoose
  .connect(MongoURL)
  .then(() => {
    console.log('Database connected')

    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
