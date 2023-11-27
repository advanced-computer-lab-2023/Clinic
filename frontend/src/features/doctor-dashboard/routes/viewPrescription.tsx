import { api } from '@/api'
import {
  Typography,
  Container,
  Grid,
  TextField,
  Paper,
  Button,
  CardContent,
  Card,
} from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import React from 'react'

function ViewPrescription() {
  const { username } = useParams()
  const [prescriptions, setPrescriptions] = useState([])
  const formik = useFormik({
    initialValues: {
      medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
      date: null,
    },
    onSubmit: (values) => {
      // Call your addPrescription method here
      const submissionValues = {
        ...values,
        date: new Date(),
      }
      addPrescription(submissionValues)
      // You can also reset the form if needed
      formik.resetForm()
    },
  })

  const addPrescription = async (values: any) => {
    try {
      const response = await api.post(`http://localhost:3000/prescriptions`, {
        patient: username,
        medicine: values.medicines,
        date: values.date,
      })
      console.log(response)
    } catch (error) {
      console.error('Error fetching presciptions:', error)
    }
  }

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
      <Container
        maxWidth="md"
        sx={{
          padding: '50px 0',
          animation: 'fadeIn 1s',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            marginBottom: '40px',
            textAlign: 'center',
            color: '#3f51b5',
          }}
        >
          Prescriptions
        </Typography>

        {prescriptions.map((prescription: any, prescriptionIndex) => (
          <Card
            key={`prescription-${prescriptionIndex}`}
            sx={{
              marginBottom: 20,
              animation: 'slideUp 0.5s ease',
              backgroundColor: '#e3f2fd',
              borderRadius: '15px',
            }}
            elevation={4}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                sx={{ color: '#333', fontWeight: 'bold', marginBottom: '20px' }}
              >
                Prescription Date: {prescription.date.slice(0, 10)}
              </Typography>

              <Typography
                variant="h6"
                component="h3"
                sx={{ color: '#444', fontWeight: 'bold', marginBottom: '15px' }}
              >
                Medicines:
              </Typography>

              {prescription.medicine &&
                prescription.medicine.map(
                  (medicine: any, medicineIndex: any) => (
                    <Typography
                      key={`medicine-${medicineIndex}`}
                      variant="body1"
                      component="p"
                      style={{ margin: '5px 0', color: '#555' }}
                    >
                      <strong>Name:</strong> {medicine.name},{' '}
                      <strong>Dosage:</strong> {medicine.dosage},{' '}
                      <strong>Frequency:</strong> {medicine.frequency},{' '}
                      <strong>Duration:</strong> {medicine.duration}
                    </Typography>
                  )
                )}
            </CardContent>
          </Card>
        ))}
      </Container>

      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Prescription Form
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {formik.values.medicines.map((medicine: any, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name={`medicines[${index}].name`}
                      label="Medicine Name"
                      variant="outlined"
                      onChange={formik.handleChange}
                      value={medicine.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name={`medicines[${index}].dosage`}
                      label="Dosage"
                      variant="outlined"
                      onChange={formik.handleChange}
                      value={medicine.dosage}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name={`medicines[${index}].frequency`}
                      label="Frequency"
                      variant="outlined"
                      onChange={formik.handleChange}
                      value={medicine.frequency}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name={`medicines[${index}].duration`}
                      label="Duration"
                      variant="outlined"
                      onChange={formik.handleChange}
                      value={medicine.duration}
                    />
                  </Grid>
                  {/* Repeat for dosage, frequency, and duration */}
                </React.Fragment>
              ))}
            </Grid>

            <Button
              onClick={() =>
                formik.setFieldValue('medicines', [
                  ...formik.values.medicines,
                  { name: '', dosage: '', frequency: '', duration: '' },
                ])
              }
            >
              Add Another Medicine
            </Button>

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
