import express from 'express'
import { router } from './routes'
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT ?? 3000
const MongoURL =
  process.env.URL ?? 'mongodb+srv://admin:admin@cluster0.ugek6la.mongodb.net/'

app.use(router)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

mongoose
  .connect(MongoURL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log(err)
  })

// const connection = mongoose.connection;
