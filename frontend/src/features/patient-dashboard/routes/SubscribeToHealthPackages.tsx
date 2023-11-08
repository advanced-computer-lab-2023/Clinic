import {
  getHealthPackages,
  subscribeToHealthPackage,
  unsubscribeToHealthPackage,
} from '@/api/healthPackages'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { AddModerator } from '@mui/icons-material'
import { useAlerts } from '@/hooks/alerts'

export function SubscribeToHealthPackages() {
  const [selectedHealthPackage, setSelectedHealthPackage] = useState<
    null | string
  >()

  const queryClient = useQueryClient()
  const alerts = useAlerts()
  const query = useQuery({
    queryKey: ['health-packages'],
    queryFn: getHealthPackages,
  })
  const mutation = useMutation({
    mutationFn: subscribeToHealthPackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['health-packages'])
      setSelectedHealthPackage(null)
      alerts.addAlert({
        severity: 'success',
        message: 'Subscribed to health package successfully.',
      })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: unsubscribeToHealthPackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['health-packages']);
      setSelectedHealthPackage(null);
      alerts.addAlert({
        severity: 'success',
        message: 'Unsubscribed from health package successfully.',
      });
    },
  });

  const isSubscribed = useMemo(() => {
    return (
      query.data?.healthPackages.some((healthPackage) => {
        return healthPackage.isSubscribed
      }) || false
    )
  }, [query])

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <>
      <Grid container spacing={1}>
        {!isSubscribed && (
          <Grid item xl={12}>
            <Alert severity="info">
              You are not subscribed to any health package. Please subscribe to
              a health package to get discounts on your appointments and
              medicines.
            </Alert>
          </Grid>
        )}
        {query.data?.healthPackages.map((healthPackage) => (
          <Grid item xl={4} key={healthPackage.id}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">{healthPackage.name}</Typography>

                    {healthPackage.isSubscribed && (
                      <Chip
                        variant="filled"
                        color="success"
                        label="Subscribed"
                      />
                    )}
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
                      Family Member Subscription Discount
                    </Typography>
                    <Typography variant="body1">
                      {healthPackage.familyMemberSubscribtionDiscount}%
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
              <CardActions>
              {healthPackage.isSubscribed ? (
          <Button
            variant="contained"
            fullWidth
            color="secondary"  // Set the color as desired
            startIcon={<AddModerator />}  // Replace with the icon you prefer
            onClick={() => cancelMutation.mutateAsync(healthPackage.id)}  
          >
            Unsubscribe
          </Button>
        ) : (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddModerator />}
                  onClick={() => {
                    setSelectedHealthPackage(healthPackage.id)
                  }}
                  disabled={healthPackage.isSubscribed}
                >
                  {healthPackage.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Button>)}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={!!selectedHealthPackage}
        onClose={() => setSelectedHealthPackage(null)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Alert severity="info">
              When you subscribe to a health package, you will also be
              subscribing for your family members.
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setSelectedHealthPackage(null)}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={() => mutation.mutateAsync(selectedHealthPackage!)}
            loading={mutation.isLoading}
          >
            Subscribe
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
