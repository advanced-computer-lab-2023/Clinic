import { getLoggedInUserPrescriptions } from '@/api/prescriptions'
import { useAuth } from '@/hooks/auth'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { FilteredList } from '../../../components/FilteredList'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'

export const FilteredPrescriptions = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  function handleView(id: string) {
    navigate(`/patient-dashboard/prescriptions/${id}`)
  }

  return (
    <FilteredList
      dataFetcher={getLoggedInUserPrescriptions}
      filters={[
        {
          label: 'Doctor Name',
          property: (v) => v.doctor,
          filter: (actual: string, required: string) =>
            actual.toLowerCase().includes(required.toLowerCase()),
          type: 'text',
        },
        {
          label: 'From Date',
          property: (v) => v.date,
          filter: (actual: Date, required: Date) =>
            new Date(actual).getTime() >= required.getTime(),
          type: 'date',
        },
        {
          label: 'To Date',
          property: (v) => v.date,
          filter: (actual: Date, required: Date) => {
            return new Date(actual).getTime() <= required.getTime()
          },
          type: 'date',
        },
        {
          label: 'Is Filled?',
          property: (v) => v.isFilled,
          filter: (actual: boolean, required: boolean) => actual == required,
          type: 'boolean',
          customComponent: ({ value, setValue }) =>
            value != undefined ? (
              <Chip
                label={value ? 'Filled' : 'Unfilled'}
                color={value ? 'success' : 'warning'}
                variant="outlined"
                onDelete={() => setValue(undefined)}
              />
            ) : undefined,
        },
      ]}
      queryKey={['prescriptions', user!.username]}
      component={(prescription) => (
        <Grid item xl={3}>
          <Card
            variant="outlined"
            style={{
              height: '350px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '-2px 2px 10px rgba(0, 0, 0, 0.15)',
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
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
                  <Typography variant="body1">
                    {prescription.patient}
                  </Typography>
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

              <CardActions style={{ justifyContent: 'center' }}>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => {
                    handleView(prescription.id)
                  }}
                >
                  view
                </Button>
                {/* <Stack direction="row" spacing={1}></Stack> */}
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
      )}
    />
  )
}
