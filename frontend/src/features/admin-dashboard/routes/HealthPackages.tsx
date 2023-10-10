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
import UpgradeIcon from '@mui/icons-material/Upgrade'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
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

  return (
    <div>
      <Grid container spacing={1}>
        {query.data.healthPackages.map((healthPackage) => {
          return (
            <Grid item xl={12}>
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
                        Package ID
                      </Typography>
                      <Typography variant="body1">
                        {healthPackage.id}
                      </Typography>
                    </Stack>

                    <Stack spacing={-1}>
                      <Typography variant="overline" color="text.secondary">
                        Price per year
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
                        {healthPackage.sessionDiscount}
                      </Typography>
                    </Stack>
                    <Stack spacing={-1}>
                      <Typography variant="overline" color="text.secondary">
                        Medicine From Our Pharmacy Discount
                      </Typography>
                      <Typography variant="body1">
                        {healthPackage.medicineDiscount}
                      </Typography>
                    </Stack>
                    <Stack spacing={-1}>
                      <Typography variant="overline" color="text.secondary">
                        Family Member Subscription Discount
                      </Typography>
                      <Typography variant="body1">
                        {healthPackage.familyMemberSubscribtionDiscount}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<UpgradeIcon />}>
                    Update
                  </Button>
                  <Button size="small" startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
      <Button
        size="small"
        variant="contained"
        startIcon={<AddIcon />}
        href="/admin-dashboard/add-health-Package"
      >
        AddHealthPackage
      </Button>
    </div>
  )
}
