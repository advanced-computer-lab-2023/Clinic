import {
  getHealthPackages,
  subscribeCreditToHealthPackage,
  subscribeToHealthPackage,
  subscribeWalletToHealthPackage,
  unsubscribeToHealthPackage,
} from '@/api/healthPackages'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import WalletIcon from '@mui/icons-material/Wallet'
import CreditCardIcon from '@mui/icons-material/CreditCard'
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
import Checkout from '@/components/StripeCheckout'

export function SubscribeToHealthPackages() {
  const [selectedHealthPackageId, setSelectedHealthPackageId] = useState<
    null | string
  >()
  const [walletMethodIdPackage, setWalletMethodIdPackage] = useState<
    null | string
  >()
  const [creditMethodIdPackage, setCreditMethodIdPackage] = useState<
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
      setSelectedHealthPackageId(null)
      alerts.addAlert({
        severity: 'success',
        message: 'Subscribed to health package successfully.',
      })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: unsubscribeToHealthPackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['health-packages'])
      setSelectedHealthPackageId(null)
      alerts.addAlert({
        severity: 'success',
        message: 'Unsubscribed from health package successfully.',
      })
    },
  })
  const subscribeWalletMutation = useMutation({
    mutationFn: subscribeWalletToHealthPackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['health-packages'])
      setWalletMethodIdPackage(null)
      alerts.addAlert({
        severity: 'success',
        message: 'Subscribed to health package successfully.',
      })
    },
    onError: (e: Error) => {
      alerts.addAlert({
        message: e.message ?? 'Failed! Try again',
        severity: 'error',
      })
    },
  })
  const subscribeCreditMutation = useMutation({
    mutationFn: subscribeCreditToHealthPackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['health-packages'])
      setCreditMethodIdPackage(null)
      alerts.addAlert({
        severity: 'success',
        message: 'Subscribed to health package successfully.',
      })
    },
    onError: (e: Error) => {
      alerts.addAlert({
        severity: 'error',
        message: e.message ?? 'Failed! Try again',
      })
    },
  })

  const isSubscribed = useMemo(() => {
    return (
      query.data?.healthPackages.some((healthPackage) => {
        return healthPackage.isSubscribed
      }) || false
    )
  }, [query])

  // const subscribedHealthPackage = useMemo(
  //   () =>
  //     query.data?.healthPackages.find((healthPackage) => {
  //       return healthPackage.isSubscribed
  //     }),
  //   [query]
  // )

  const selectedHealthPackage = useMemo(
    () =>
      query.data?.healthPackages.find((healthPackage) => {
        return healthPackage.id === selectedHealthPackageId
      }),
    [query, selectedHealthPackageId]
  )

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
          <Grid
            item
            xl={4}
            key={healthPackage.id}
            zIndex={healthPackage.isSubscribed ? 1 : 0}
          >
            <Card
              variant="outlined"
              style={{
                transform: healthPackage.isSubscribed
                  ? 'scale(1.027)'
                  : 'scale(1)',
                transition: 'all 0.2s',
                boxShadow: healthPackage.isSubscribed
                  ? '0 2px 10px rgba(199, 127, 255, 0.91)'
                  : '',
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
                    color="secondary" // Set the color as desired
                    startIcon={<AddModerator />} // Replace with the icon you prefer
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
                      setSelectedHealthPackageId(healthPackage.id)
                    }}
                    disabled={healthPackage.isSubscribed}
                  >
                    {healthPackage.isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={!!selectedHealthPackageId}
        onClose={() => setSelectedHealthPackageId(null)}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isSubscribed ? (
              <Alert severity="error">
                You are already subscribed to a health package. If you subscribe
                to another health package, your current health package will be
                cancelled.{' '}
                <u>
                  The remaining {12 - new Date().getMonth()} months will not be
                  refunded
                </u>
                , and you will start paying{' '}
                <Chip
                  color="warning"
                  size="small"
                  label={selectedHealthPackage?.pricePerYear + '$'}
                />{' '}
                per year for the{' '}
                <Chip
                  color="info"
                  size="small"
                  label={selectedHealthPackage?.name}
                />{' '}
                health package starting from today.
              </Alert>
            ) : (
              <Alert severity="info">
                You will be charged{' '}
                <Chip
                  color="warning"
                  size="small"
                  label={selectedHealthPackage?.pricePerYear + '$'}
                />{' '}
                per year for the{' '}
                <Chip
                  color="info"
                  size="small"
                  label={selectedHealthPackage?.name}
                />{' '}
                health package starting from today.
              </Alert>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setSelectedHealthPackageId(null)}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            // onClick={() => mutation.mutateAsync(selectedHealthPackage!)}
            onClick={() => {
              setWalletMethodIdPackage(selectedHealthPackageId!)
              setSelectedHealthPackageId(null)
            }}
            loading={mutation.isLoading}
          >
            Subscribe
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!walletMethodIdPackage}
        onClose={() => setWalletMethodIdPackage(null)}
      >
        <DialogTitle>Payment Methods</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              // width: '1000px',
            }}
          >
            <Stack
              direction="row"
              spacing={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                marginTop: '1rem',
                padding: '1rem',
              }}
            >
              <LoadingButton
                variant="contained"
                onClick={() => {
                  subscribeWalletMutation.mutateAsync(walletMethodIdPackage!)
                }}
                loading={subscribeWalletMutation.isLoading}
              >
                Wallet
                <WalletIcon
                  sx={{
                    ml: 1,
                  }}
                />
              </LoadingButton>
              <Button
                variant="contained"
                onClick={() => {
                  setCreditMethodIdPackage(walletMethodIdPackage!)
                  setWalletMethodIdPackage(null)
                }}
              >
                Card
                <CreditCardIcon
                  sx={{
                    ml: 1,
                  }}
                />
              </Button>
            </Stack>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setWalletMethodIdPackage(null)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!creditMethodIdPackage}
        onClose={() => setCreditMethodIdPackage(null)}
      >
        <DialogTitle>Pay with credit</DialogTitle>
        <DialogContent>
          <Checkout
            handleSubmit={() => {
              console.log('handleSubmit')
              subscribeCreditMutation.mutateAsync(creditMethodIdPackage!)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setCreditMethodIdPackage(null)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
