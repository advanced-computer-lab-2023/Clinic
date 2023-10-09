import { getHealthPackages } from '@/api/healthPackages'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'

export function HealthPackages() {
  const query = useQuery({
    queryKey: ['health-packages'],
    queryFn: () => getHealthPackages(),
  })
  if (query.isLoading) {
    return <CardPlaceholder />
  }
  if (query.isError) {
    return <h1>error</h1>
  }

  query.data.healthPackages.map((healthPackage) => {
    ;<Grid item xl={3}>
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
                {healthPackage.name}
              </Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Cost Per Year
              </Typography>
              <Typography variant="body1">
                {healthPackage.pricePerYear}
              </Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Session Discount
              </Typography>
              <Typography variant="body1">
                {healthPackage.sessionDiscount}%
              </Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Medicine From Our Pharmacy Discount
              </Typography>
              <Typography variant="body1">
                {healthPackage.medicineDiscount}%
              </Typography>
            </Stack>
            <Stack spacing={-1}>
              <Typography variant="overline" color="text.secondary">
                Family Member Subscribtion To Any package Discount
              </Typography>
              <Typography variant="body1">
                {healthPackage.familyMemberSubscribtionDiscount}%
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions>
          <Button size="small">Update</Button>
          <Button size="small">delete</Button>
        </CardActions>
      </Card>
    </Grid>
  })
}
