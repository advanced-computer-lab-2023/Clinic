import { api } from '@/api'
import {
  Typography,
  Container,
  Grid,
  TextField,
  Paper,
  Button,
} from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ViewPrescription() {
  const { username } = useParams()
  const formik = useFormik({
    initialValues: {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      date: null,
    },
    onSubmit: (values) => {
      // Call your addPrescription method here
      addPrescription(values)
      // You can also reset the form if needed
      formik.resetForm()
    },
  })

  const addPrescription = async (values: any) => {
    try {
      const response = await api.post(`http://localhost:3000/prescriptions`, {
        patient: username,
        medicine: [
          {
            name: values.name,
            dosage: values.dosage,
            frequency: values.frequency,
            duration: values.duration,
          },
        ],
        date: values.date,
      })
      console.log(response)
    } catch (error) {
      console.error('Error fetching presciptions:', error)
    }
  }

  const [prescriptions, setPrescriptions] = useState([])
  useEffect(() => {
    const fetchPresciptions = async () => {
      try {
        const response = await api.get(
          `http://localhost:3000/prescriptions/${username}`
        )
        setPrescriptions(response.data)
        console.log(prescriptions)
      } catch (error) {
        console.error('Error fetching presciptions:', error)
      }
    }

    fetchPresciptions()
  }, [username, prescriptions])

  return (
    <>
      <Container maxWidth="md" className="App">
        <Typography
          variant="h3"
          style={{ marginTop: '50px' }}
          color="primary"
          component="h1"
          gutterBottom
        >
          Prescriptions
        </Typography>
      </Container>

      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Prescription Form
          </Typography>
          <form
            onSubmit={formik.handleSubmit}
            style={{ width: '100%', marginTop: 20 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Medicine Name"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="dosage"
                  name="dosage"
                  label="Dosage"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.dosage}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="frequency"
                  name="frequency"
                  label="Frequency"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.frequency}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="duration"
                  name="duration"
                  label="Duration"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.duration}
                />
              </Grid>

              <Grid>
                <DesktopDatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(date) => formik.setFieldValue('date', date)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              Add Prescription
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  )
}

export default ViewPrescription
