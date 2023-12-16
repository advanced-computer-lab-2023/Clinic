import {
  Typography,
  Container,
  Button,
  CardContent,
  Card,
  CardActions,
} from '@mui/material'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { getPrescriptions } from '@/api/doctor'
import { Add, DocumentScanner, Edit, Healing } from '@mui/icons-material'

function ViewPrescription() {
  const { username } = useParams()
  const token = localStorage.getItem('token')
  const [prescriptions, setPrescriptions] = useState([])
  const pdfRef = useRef(null)

  const fetchPresciptions = async () => {
    try {
      const response = await getPrescriptions(username)
      setPrescriptions(response.data)
      console.log(prescriptions)
    } catch (error) {
      console.error('Error fetching presciptions:', error)
    }
  }

  useEffect(() => {
    fetchPresciptions()
  }, [username])

  const downloadPDF = () => {
    console.log('in pdf')
    const input = pdfRef.current
    console.log(input)
    html2canvas(input! as HTMLElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4', true)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight, imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      )
      pdf.save('prescription.pdf')
    })
  }

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
            fontWeight: 'bold',
          }}
        >
          <Healing fontSize="large" sx={{ marginRight: 2 }} />
          Prescriptions
        </Typography>

        {prescriptions.map((prescription: any, prescriptionIndex) => (
          <Card
            key={`prescription-${prescriptionIndex}`}
            sx={{
              marginBottom: 5,
              animation: 'slideUp 0.5s ease',
              borderRadius: '15px',
              backgroundColor: 'background.default',
            }}
            elevation={4}
          >
            <CardContent ref={pdfRef}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 'bold', marginBottom: '20px' }}
              >
                Prescription Date: {prescription.date.slice(0, 10)}
              </Typography>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 'bold', marginBottom: '15px' }}
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
                      style={{ margin: '5px 0' }}
                    >
                      <strong>Name:</strong> {medicine.name},{' '}
                      <strong>Dosage:</strong> {medicine.dosage},{' '}
                      <strong>Quantity:</strong> {medicine.quantity},{' '}
                    </Typography>
                  )
                )}
            </CardContent>
            <CardActions>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: 20 }}
                startIcon={<Edit />}
                onClick={() =>
                  (window.location.href = `http://localhost:5174/doctor-dashboard?PrescriptionId=${prescription._id}&token=${token}`)
                }
              >
                Edit Prescription
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: 20 }}
                startIcon={<DocumentScanner />}
                onClick={() => {
                  downloadPDF()
                }}
              >
                download as pdf
              </Button>
            </CardActions>
          </Card>
        ))}
      </Container>

      <Container component="main" maxWidth="xs">
        {/* <Link
              to={`http://localhost:5174/doctor-dashboard?patientusername=${username}&token=${token}`}
            >
              Add Another Prescription
            </Link> */}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
          size="large"
          onClick={() =>
            (window.location.href = `http://localhost:5174/doctor-dashboard?patientusername=${username}&token=${token}`)
          }
          startIcon={<Add />}
        >
          Add Prescription
        </Button>
      </Container>
    </>
  )
}

export default ViewPrescription
