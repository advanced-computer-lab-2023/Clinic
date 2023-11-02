import { getSinglePrescription } from '@/api/prescriptions'
import { AlertsBox } from '@/components/AlertsBox'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export function PrescriptionView() {
  const { id } = useParams()

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

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" color="text.secondary">
              {prescription.medicine}
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
    </Card>
  )
}
