import { useState } from 'react'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  TextField,
  Typography,
  Grid,
  RadioGroup,
  Radio,
  Box,
  Container,
  FormControlLabel,
} from '@mui/material'
import { sendDoctorRequest } from '@/api/doctor'

export const RequestDoctor = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  //mobile number
  const [hourlyRate, setHourlyRate] = useState('')
  const [affilation, setAffilation] = useState('')
  const [educationalBackground, setEducationalBackground] = useState('')
  const [speciality, setSpeciality] = useState('')

  const [fieldValue, setFieldValue] = useState({ files: [] } as any)

  async function submit(e: any) {
    console.log('submit')
    console.log(fieldValue.files)

    e.preventDefault()

    const formData = new FormData()

    formData.append('name', name)
    formData.append('email', email)
    formData.append('username', username)
    formData.append('password', password)
    formData.append('dateOfBirth', dateOfBirth)
    formData.append('hourlyRate', hourlyRate)
    formData.append('affiliation', affilation)
    formData.append('educationalBackground', educationalBackground)

    formData.append('speciality', speciality)

    // formData.append('documents', fieldValue.files)
    for (let i = 0; i < fieldValue.files.length; i++) {
      formData.append('documents', fieldValue.files[i])
    }

    console.log(formData)

    try {
      await sendDoctorRequest(formData)
      toast.success('Your request has been sent successfully')
    } catch (e: any) {
      console.log(e)
      toast.error(e.message)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <ToastContainer />

        <form action="POST">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="standard-basic"
                label="Name"
                type="text"
                onChange={(e) => {
                  setName(e.target.value)
                }}
                placeholder="Enter your Name"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                id="standard-basic"
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                placeholder="Enter your email address"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="standard-basic"
                type="text"
                label="Username"
                onChange={(e) => {
                  setUsername(e.target.value)
                }}
                placeholder="Enter userrname"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="standard-basic"
                type="password"
                label="Password"
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                placeholder="Enter password"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                type="date"
                onChange={(e) => {
                  setDateOfBirth(e.target.value)
                }}
                placeholder="Enter date of birth"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="standard-basic"
                type="number"
                label="Excpected Hourly Rate"
                onChange={(e) => {
                  setHourlyRate(e.target.value)
                }}
                placeholder="Enter hourly rate in $"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Affiliation"
                id="standard-basic"
                type="text"
                onChange={(e) => {
                  setAffilation(e.target.value)
                }}
                placeholder="Enter affiliation"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="standard-basic"
                label="Speciality"
                type="text"
                required
                onChange={(e) => {
                  setSpeciality(e.target.value)
                }}
                placeholder="Enter your speciality"
              />
            </Grid>

            <Grid item xs={12}>
              <label>Select your educational background </label>

              <RadioGroup
                onChange={(e) => {
                  setEducationalBackground(e.target.value)
                }}
              >
                <FormControlLabel
                  value="Associate degree"
                  control={<Radio />}
                  label="Associate degree"
                />
                <FormControlLabel
                  value="Bachelor's degree"
                  control={<Radio />}
                  label="Bachelor's degree"
                />
                <FormControlLabel
                  value="Master's degree"
                  control={<Radio />}
                  label="Master's degree"
                />
                <FormControlLabel
                  value="Doctoral degree"
                  control={<Radio />}
                  label="Doctoral degree"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <label>Please upload your ID, medical license and degree</label>
              <input
                id="file"
                name="file"
                type="file"
                multiple
                onChange={(event) => {
                  if (
                    event.currentTarget.files &&
                    event.currentTarget.files.length > 2
                  )
                    setFieldValue({ files: event.currentTarget.files })
                  else {
                    toast.error('Please upload all required documents')
                  }
                }}
              />
            </Grid>
          </Grid>
          <br />
          <Button
            type="submit"
            fullWidth
            onClick={submit}
            className="btn btn-primary"
            variant="contained"
            endIcon={<SendIcon />}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default RequestDoctor
