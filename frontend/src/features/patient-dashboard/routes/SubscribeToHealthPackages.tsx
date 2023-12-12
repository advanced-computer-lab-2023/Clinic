import {
  getCancelledHealthPackagesForPatient,
  getSubscribedHealthPackageForPatient,
  getAllHealthPackagesForPatient,
  subscribeCreditToHealthPackage,
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
import { useAuth } from '@/hooks/auth'
import { GetAllHealthPackagesForPatientResponse } from 'clinic-common/types/healthPackage.types'
import { DiscountedPrice } from '@/components/DiscountedPrice'

function HealthPackagePrice({
  healthPackage,
}: {
  healthPackage: GetAllHealthPackagesForPatientResponse[0]
}) {
  if (!healthPackage) {
    return null
  }

  return (
    <DiscountedPrice
      originalPrice={healthPackage.pricePerYear}
      discountedPrice={healthPackage.discountedPricePerYear}
    />
  )
}

export function SubscribeToHealthPackages({
  subscriberId,
  isFamilyMember = false,
}: {
  subscriberId?: string
  isFamilyMember?: boolean
}) {
  const [selectedHealthPackageId, setSelectedHealthPackageId] = useState<
    null | string
  >()
  const [walletMethodIdPackage, setWalletMethodIdPackage] = useState<
    null | string
  >()
  const [creditMethodIdPackage, setCreditMethodIdPackage] = useState<
    null | string
  >()

  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)

  const alerts = useAlerts()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const id = subscriberId || user!.modelId
  const payerUsername = user!.username

  const query = useQuery({
    queryKey: ['health-packages', subscriberId],
    queryFn: () =>
      getAllHealthPackagesForPatient({
        patientId: id,
        isFamilyMember,
      }),
  })

  const subscribedHealthPackageQuery = useQuery({
    queryKey: ['subscribed-health-packages', isFamilyMember, id],
    queryFn: () =>
      getSubscribedHealthPackageForPatient({
        patientId: id,
        isFamilyMember,
      }),
  })
  const cancelledHealthPackagesQuery = useQuery({
    queryKey: ['cancelled-health-packages', id, isFamilyMember],
    queryFn: () => getCancelledHealthPackagesForPatient({ id, isFamilyMember }),
  })

  const onSuccess =
    (message: string = 'Subscribed to health package successfully.') =>
    () => {
      query.refetch()
      subscribedHealthPackageQuery.refetch()
      cancelledHealthPackagesQuery.refetch()
      queryClient.invalidateQueries(['family-members'])
      setSelectedHealthPackageId(null)
      setWalletMethodIdPackage(null)
      setCreditMethodIdPackage(null)
      alerts.addAlert({
        severity: 'success',
        message,
      })
    }

  const cancelMutation = useMutation({
    mutationFn: unsubscribeToHealthPackage,
    onSuccess: onSuccess('Unsubscribed from health package successfully.'),
  })

  const subscribeWalletMutation = useMutation({
    mutationFn: subscribeWalletToHealthPackage,
    onSuccess: onSuccess(),
    onError: (e: Error) => {
      alerts.addAlert({
        message: e.message ?? 'Failed! Try again',
        severity: 'error',
      })
    },
  })

  const subscribeCreditMutation = useMutation({
    mutationFn: subscribeCreditToHealthPackage,
    onSuccess: onSuccess(),
    onError: (e: Error) => {
      alerts.addAlert({
        severity: 'error',
        message: e.message ?? 'Failed! Try again',
      })
    },
  })

  const subscribedPackage = subscribedHealthPackageQuery.data?.healthPackage

  const isSubscribed = useMemo(() => {
    return !!subscribedPackage
  }, [subscribedPackage])

  const selectedHealthPackage = useMemo(
    () =>
      query.data?.find((healthPackage) => {
        return healthPackage.id === selectedHealthPackageId
      }),
    [query, selectedHealthPackageId]
  )

  if (
    query.isLoading ||
    subscribedHealthPackageQuery.isFetching ||
    cancelledHealthPackagesQuery.isFetching
  ) {
    return <CardPlaceholder />
  }

  return (
    <>
      <Grid container spacing={1}>
        {!isSubscribed && (
          <Grid item xs={12}>
            <Alert severity="info">
              You are not subscribed to any health package. Please subscribe to
              a health package to get discounts on your appointments and
              medicines.
            </Alert>
          </Grid>
        )}
        {query.data?.map((healthPackage) => (
          <Grid
            item
            xl={4}
            key={healthPackage.id}
            zIndex={subscribedPackage?.id == healthPackage.id ? 1 : 0}
          >
            <Card
              variant="outlined"
              style={{
                transform:
                  subscribedPackage?.id == healthPackage.id
                    ? 'scale(1.027)'
                    : 'scale(1)',
                transition: 'all 0.2s',
                boxShadow:
                  subscribedPackage?.id == healthPackage.id
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

                    <>
                      {subscribedPackage?.id == healthPackage.id && (
                        <Chip
                          variant="filled"
                          color="success"
                          label="Subscribed"
                        />
                      )}

                      {!!cancelledHealthPackagesQuery.data![
                        healthPackage.id
                      ] && (
                        <>
                          <Chip
                            label={`Cancelled on ${
                              cancelledHealthPackagesQuery.data![
                                healthPackage.id
                              ]
                            }`}
                            color="error"
                            size="small"
                          />
                        </>
                      )}
                    </>
                  </Stack>

                  <Stack spacing={-1}>
                    <Typography variant="overline" color="text.secondary">
                      Price per year
                    </Typography>
                    <HealthPackagePrice healthPackage={healthPackage} />
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
                  {subscribedPackage?.id == healthPackage.id && (
                    <Stack spacing={-1}>
                      <Typography variant="overline" color="text.secondary">
                        Renewal Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(
                          subscribedPackage?.renewalDate
                        ).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
              <CardActions>
                {subscribedPackage?.id == healthPackage.id &&
                new Date(subscribedPackage?.renewalDate) > new Date() ? (
                  <LoadingButton
                    loading={cancelMutation.isLoading}
                    variant="contained"
                    fullWidth
                    color="secondary"
                    startIcon={<AddModerator />} // Replace with cancel icon
                    onClick={() => {
                      setShowCancelConfirmation(true)
                    }}
                  >
                    Unsubscribe
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddModerator />}
                    onClick={() => {
                      setSelectedHealthPackageId(healthPackage.id)
                    }}
                    color={
                      subscribedPackage?.id == healthPackage.id
                        ? 'success'
                        : 'primary'
                    }
                  >
                    {subscribedPackage?.id == healthPackage.id
                      ? 'Renew'
                      : 'Subscribe'}
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
              new Date(subscribedPackage!.renewalDate) > new Date() ? (
                <Alert severity="error">
                  You are already subscribed to a health package. If you
                  subscribe to another health package, your current health
                  package will be cancelled.{' '}
                  <u>
                    The remaining {subscribedPackage?.remainingMonths} months
                    will not be refunded
                  </u>
                  , and you will start paying{' '}
                  <Chip
                    color="warning"
                    size="small"
                    label={
                      <HealthPackagePrice
                        healthPackage={selectedHealthPackage!}
                      />
                    }
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
                  You are going to renew your subscription to{' '}
                  <Chip
                    color="info"
                    size="small"
                    label={selectedHealthPackage?.name}
                  />{' '}
                  . You will be charged{' '}
                  <Chip
                    color="warning"
                    size="small"
                    label={
                      <HealthPackagePrice
                        healthPackage={selectedHealthPackage!}
                      />
                    }
                  />{' '}
                  per year for the health package starting from today.
                </Alert>
              )
            ) : (
              <Alert severity="info">
                You will be charged{' '}
                <Chip
                  color="warning"
                  size="small"
                  label={
                    <HealthPackagePrice
                      healthPackage={selectedHealthPackage!}
                    />
                  }
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
                  subscribeWalletMutation.mutateAsync({
                    healthPackageId: walletMethodIdPackage!,
                    isFamilyMember,
                    payerUsername,
                    subscriberId: id,
                  })
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
              subscribeCreditMutation.mutateAsync({
                healthPackageId: creditMethodIdPackage!,
                isFamilyMember,
                payerUsername,
                subscriberId: id,
              })
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setCreditMethodIdPackage(null)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showCancelConfirmation}
        onClose={() => setShowCancelConfirmation(false)}
      >
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel the subscription for this health
            package?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelConfirmation(false)}>
            No, Go Back
          </Button>
          <Button
            onClick={() => {
              cancelMutation.mutateAsync({
                subscriberId: id,

                payerUsername,
                isFamilyMember,
              })
              setShowCancelConfirmation(false)
            }}
            color="secondary"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
