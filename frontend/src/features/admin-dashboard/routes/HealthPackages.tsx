import { deleteHealthPackage, getHealthPackages } from '@/api/healthPackages'
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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import UpgradeIcon from '@mui/icons-material/Upgrade'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
// import { useAlerts } from '@/hooks/alerts'
// import { Alert } from '@/providers/AlertsProvider'
import {
  //  useMemo,
  useState,
} from 'react'
import { LoadingButton } from '@mui/lab'

export function HealthPackages() {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['health-packages'],
    queryFn: () => getHealthPackages(),
  })
  // const { addAlert } = useAlerts()
  // const alertScope = useMemo(() => uuidv4(), [])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [packageId, setPackageId] = useState('')

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  if (query.isError) {
    return <h1>error</h1>
  }

  function handleUpdate(id: string) {
    navigate(`/admin-dashboard/update-health-package/${id}`)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setLoading(false)
  }

  function handleDelelte() {
    // addAlert(new Alert("successMessage", 'success',alertScope))
    setLoading(true)
    deleteHealthPackage(packageId).then(() => {
      handleClose()
      query.refetch()
    })
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure,you want to delete this package?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            size="small"
            color="primary"
            onClick={handleDelelte}
            loading={loading}
          >
            <span>Delete</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Grid container spacing={1}>
        <Grid item xl={12}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            href="/admin-dashboard/add-health-Package"
          >
            Add Health Package
          </Button>
        </Grid>
        {query.data.healthPackages.map((healthPackage) => {
          return (
            <Grid item xl={4}>
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
                  <Button
                    size="small"
                    startIcon={<UpgradeIcon />}
                    onClick={() => {
                      handleUpdate(healthPackage.id)
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      // handleDelte(healthPackage.id)
                      setPackageId(healthPackage.id)
                      handleClickOpen()
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
