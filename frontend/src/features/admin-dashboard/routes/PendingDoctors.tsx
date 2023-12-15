import {
  acceptDoctorRequest,
  getPendingDoctors,
  rejectDoctorRequest,
} from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Button, ButtonGroup, Paper } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import { GetPendingDoctorsResponse } from 'clinic-common/types/doctor.types'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function PendingDoctors() {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['pending-doctors'],
    queryFn: () => getPendingDoctors(),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  function handleApprove(id: string) {
    const promise = acceptDoctorRequest(id).then(() => {
      query.refetch()
    })
    toast.promise(promise, {
      pending: 'Loading',
      success: 'Doctor Request Approved Successfully!',
      error: 'error',
    })
  }

  function handleReject(id: string) {
    const promise = rejectDoctorRequest(id).then(() => {
      query.refetch()
    })
    toast.promise(promise, {
      pending: 'Loading',
      success: 'Doctor Request Rejected Successfully!',
      error: 'error',
    })
  }

  const columns: GridColDef<GetPendingDoctorsResponse['doctors'][0]>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 100,
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 200,
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      width: 150,
    },
    {
      field: 'hourlyRate',
      headerName: 'Hourly Rate',
      width: 100,
    },
    {
      field: 'affiliation',
      headerName: 'Affiliation',
      width: 200,
    },
    {
      field: 'educationalBackground',
      headerName: 'Educational Background',
      width: 200,
    },
    {
      field: 'speciality',
      headerName: 'Speciality',
      width: 250,
    },
    {
      field: 'actions',
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      headerName: 'Actions',
      width: 250,
      renderCell: (column) => (
        <ButtonGroup>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
              navigate(column.row.username)
            }}
            style={{ marginLeft: 5 }}
          >
            View
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => {
              handleApprove(column.row.id)
            }}
            style={{ marginLeft: 5 }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => {
              handleReject(column.row.id)
            }}
            style={{ marginLeft: 5 }}
          >
            Reject
          </Button>
        </ButtonGroup>
      ),
    },
  ]

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={query.data?.doctors || []} columns={columns} autoHeight />
    </Paper>
  )
}
