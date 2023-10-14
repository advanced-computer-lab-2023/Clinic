import { CardPlaceholder } from '@/components/CardPlaceholder'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { DeleteUserApi, GetUsersApi } from '@/api/admin'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'

export function Users() {
  const query = useQuery({
    queryKey: ['get-users'],
    queryFn: () => GetUsersApi(),
  })

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deletedUser, setDeletedUser] = useState<string>()
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setLoading(false)
  }
  const deleteUser = () => {
    setLoading(true)
    DeleteUserApi(deletedUser!)
      .then(() => {
        query
          .refetch()
          .then(() => handleClose())
          .catch((e) => console.log(e))
      })
      .catch((e) => {
        console.log(e)
      })
  }
  if (query.isLoading) {
    return <CardPlaceholder />
  }
  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Username',
      flex: 1,
      editable: false,
    },
    {
      field: 'type',
      headerName: 'Type',
      editable: false,
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 0 }}
            onClick={() => {
              setDeletedUser(params.row.id)
              handleClickOpen()
            }}
          >
            Delete
          </Button>
        </strong>
      ),
    },
  ]

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Alert'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that you want to delete this user.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
          <LoadingButton
            onClick={deleteUser}
            loading={loading}
            variant="contained"
          >
            <span>Delete</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <DataGrid
        autoHeight
        rows={
          query.data?.user
            .filter((user) => {
              return user.type
            })
            .map((user) => {
              return {
                id: user.username,
                username: user.username,
                type: user.type,
              }
            }) || []
        }
        columns={columns}
        style={{ display: 'flex', width: '100%' }}
      />
    </Box>
  )
}
