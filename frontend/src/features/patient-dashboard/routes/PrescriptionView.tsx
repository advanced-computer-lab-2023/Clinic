import { getSinglePrescription } from '@/api/prescriptions'
import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useRef } from 'react'

export function PrescriptionView() {
  const { id } = useParams()
  const pdfRef = useRef(null)

  const query = useQuery({
    queryKey: [`PrescriptionView/${id}`],
    queryFn: () => getSinglePrescription(id!),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  const prescription = query.data

  if (prescription == null) {
    return <AlertsBox />
  }

  const downloadPDF = () => {
    const input = pdfRef.current
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
    <Card variant="outlined">
      <CardContent ref={pdfRef}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" color="text.secondary">
              {prescription.medicine
                .map((medicine) => medicine.name)
                .join(', ')}
            </Typography>
            <Chip
              label={prescription.isFilled ? 'Filled' : 'Unfilled'}
              color={prescription.isFilled ? 'success' : 'warning'}
              variant="outlined"
            />
          </Stack>

          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Doctor Name
            </Typography>
            <Typography variant="body1">{prescription.doctor}</Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Patient Name
            </Typography>
            <Typography variant="body1">{prescription.patient}</Typography>
          </Stack>
          <Stack spacing={-1}>
            <Typography variant="overline" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1">
              {new Date(prescription.date).toLocaleString()}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Button
        onClick={() => {
          downloadPDF()
        }}
      >
        download
      </Button>
    </Card>
  )
}
