import {
  addHealthPackage,
  deleteHealthPackage,
  getAllHealthPackages,
  updateHealthPackage,
} from '@/api/healthPackages'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  TextField,
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

// import { useAlerts } from '@/hooks/alerts'
// import { Alert } from '@/providers/AlertsProvider'
import {
  //  useMemo,
  useState,
} from 'react'
import { LoadingButton } from '@mui/lab'
import { ToastContainer, toast } from 'react-toastify'

import { createHealthPackageRequest } from 'clinic-common/types/healthPackage.types'

export function HealthPackages() {
  const query = useQuery({
    queryKey: ['health-packages'],
    queryFn: () => getAllHealthPackages(),
  })

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [packageId, setPackageId] = useState('')

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [EditDialogOpen, setEditDialogOpen] = useState(false)
  const [healthPackage, setHealthPackage] =
    useState<createHealthPackageRequest>({
      name: '',
      pricePerYear: 0,
      sessionDiscount: 0,
      medicineDiscount: 0,
      familyMemberSubscribtionDiscount: 0,
    })

  const handleEditHealthPackage = () => {
    updateHealthPackage(packageId, healthPackage)
      .then(() => {
        toast.success('Health Package updated successfully')
        query.refetch()
        closeEditDialog()
        setHealthPackage({
          name: '',
          pricePerYear: 0,
          sessionDiscount: 0,
          medicineDiscount: 0,
          familyMemberSubscribtionDiscount: 0,
        })
        setPackageId('')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  const handleAddHealthPackage = () => {
    addHealthPackage(healthPackage)
      .then(() => {
        toast.success('Health Package added successfully')
        query.refetch()
        closeAddDialog()
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  if (query.isError) {
    return <h1>error</h1>
  }

  const openAddDialog = () => {
    setAddDialogOpen(true)
  }

  const closeAddDialog = () => {
    setAddDialogOpen(false)
    setHealthPackage({
      name: '',
      pricePerYear: 0,
      sessionDiscount: 0,
      medicineDiscount: 0,
      familyMemberSubscribtionDiscount: 0,
    })
  }

  const openEditDialog = () => {
    setEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditDialogOpen(false)
    setHealthPackage({
      name: '',
      pricePerYear: 0,
      sessionDiscount: 0,
      medicineDiscount: 0,
      familyMemberSubscribtionDiscount: 0,
    })
    setPackageId('')
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setLoading(false)
  }

  function handleDelelte() {
    setLoading(true)
    deleteHealthPackage(packageId)
      .then(() => {
        handleClose()
        query.refetch()
        toast.success('Package deleted successfully')
      })
      .catch((err) => {
        handleClose()
        toast.error(err.message)
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
            Are you sure, you want to delete this package?
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

      <Dialog open={addDialogOpen} onClose={closeAddDialog}>
        <DialogTitle>Add Health Package</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            value={healthPackage.name}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                name: e.target.value,
              })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price Per Year"
            variant="outlined"
            value={healthPackage.pricePerYear}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                pricePerYear: Number(e.target.value),
              })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Session Discount Percentage"
            variant="outlined"
            value={healthPackage.sessionDiscount}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                sessionDiscount: Number(e.target.value),
              })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Medicine Discount Percentage"
            variant="outlined"
            value={healthPackage.medicineDiscount}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                medicineDiscount: Number(e.target.value),
              })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Family Member Subscribtion Discount Percentage"
            variant="outlined"
            value={healthPackage.familyMemberSubscribtionDiscount}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                familyMemberSubscribtionDiscount: Number(e.target.value),
              })
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={closeAddDialog}>Cancel</LoadingButton>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleAddHealthPackage}
            loading={loading}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={EditDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Edit Health Package</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            value={healthPackage.name}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                name: e.target.value,
              })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price Per Year"
            variant="outlined"
            value={healthPackage.pricePerYear}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                pricePerYear: Number(e.target.value),
              })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Session Discount Percentage"
            variant="outlined"
            value={healthPackage.sessionDiscount}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                sessionDiscount: Number(e.target.value),
              })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Medicine Discount Percentage"
            variant="outlined"
            value={healthPackage.medicineDiscount}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                medicineDiscount: Number(e.target.value),
              })
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Family Member Subscribtion Discount Percentage"
            variant="outlined"
            value={healthPackage.familyMemberSubscribtionDiscount}
            onChange={(e) => {
              setHealthPackage({
                ...healthPackage,
                familyMemberSubscribtionDiscount: Number(e.target.value),
              })
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={closeEditDialog}>Cancel</LoadingButton>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleEditHealthPackage}
            loading={loading}
          >
            Edit
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Grid container spacing={4}>
        <Grid item xs={16}>
          <Button
            size="large"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
          >
            Add Health Package
          </Button>
        </Grid>
        {query.data.map((healthPackage) => {
          return (
            <>
              <ToastContainer />
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
                          E£ {healthPackage.pricePerYear}
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
                    <Button
                      size="small"
                      startIcon={<UpgradeIcon />}
                      onClick={() => {
                        setHealthPackage(healthPackage)
                        openEditDialog()
                        setPackageId(healthPackage.id)
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
            </>
          )
        })}
      </Grid>
    </>
  )
}
