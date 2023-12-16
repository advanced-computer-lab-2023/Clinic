import { getSinglePrescription } from '@/api/prescriptions'
import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import {
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useEffect, useRef, useState } from 'react'
import { addPrescriptionTocart } from '@/api/pharmacy'
import { toast } from 'react-toastify'
import { GridColDef, DataGrid } from '@mui/x-data-grid'

export function PrescriptionView() {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const pdfRef = useRef(null)
  const [buttonVisible, setButtonVisible] = useState(true)
  const [filled, setfilled] = useState(false)

  const query = useQuery({
    queryKey: [`PrescriptionView/${id}`],
    queryFn: () => getSinglePrescription(id!),
  })

  useEffect(() => {
    if (query.isLoading) {
      return // Don't proceed if still loading
    }

    const prescription = query.data

    if (prescription) {
      setfilled(prescription.isFilled || false)
    }
  }, [query.isLoading, query.data])

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  const prescription = query.data

  if (prescription == null) {
    return <AlertsBox />
  }

  const downloadPDF = () => {
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

  function HandleCheckout(): void {
    setButtonVisible(false)
    setfilled(true)
    addPrescriptionTocart(id, token)
    toast.success(
      <Paper>
        <h4>Prescription is added to your cart successfully!</h4>
        <div style={{ marginTop: '8px' }}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            style={{ marginBottom: '10px' }}
            onClick={() =>
              (window.location.href = `http://localhost:5174/patient-dashboard?token=${token}`)
            }
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => toast.dismiss()}
          >
            Close
          </Button>
        </div>
      </Paper>,
      {
        position: toast.POSITION.TOP_RIGHT,
      }
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Medicine Name',
      flex: 1,
      editable: false,
    },
    {
      field: 'dosage',
      headerName: 'Dosage',
      editable: false,
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      editable: false,
      flex: 1,
    },
  ]

  return (
    <Card variant="outlined">
      <CardContent ref={pdfRef}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent={'space-between'}>
            <Stack spacing={-1}>
              <Typography
                variant="overline"
                fontSize={18}
                color="text.secondary"
              >
                Doctor Name
              </Typography>

              <Typography variant="body1">{prescription.doctor}</Typography>
            </Stack>
            <Chip
              label={filled ? 'Filled' : 'Unfilled'}
              color={filled ? 'success' : 'warning'}
              variant="outlined"
            />
          </Stack>

          <Stack spacing={-1}>
            <Typography variant="overline" fontSize={15} color="text.secondary">
              Patient Name
            </Typography>
            <Typography variant="body1">{prescription.patient}</Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" fontSize={15} color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1">
              {new Date(prescription.date).toLocaleString()}
            </Typography>
          </Stack>
          <Stack>
            <Typography variant="overline" fontSize={15} color="text.secondary">
              Medicines
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <DataGrid
              autoHeight
              rows={
                prescription.medicine.map((medicine) => {
                  return {
                    id: medicine.name,
                    name: medicine.name,
                    dosage: medicine.dosage,
                    quantity: medicine.quantity,
                  }
                }) || []
              }
              columns={columns}
              style={{ display: 'flex', width: '100%' }}
            />
          </Stack>
        </Stack>
      </CardContent>
      <Button
        variant="contained"
        onClick={() => {
          downloadPDF()
        }}
      >
        download
      </Button>
      {!prescription.isFilled && buttonVisible && (
        <Button
          variant="contained"
          onClick={() => {
            HandleCheckout()
          }}
        >
          checkout
        </Button>
      )}
    </Card>
  )
}
