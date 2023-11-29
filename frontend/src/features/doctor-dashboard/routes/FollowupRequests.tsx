import {
  acceptDoctorRequest,
  getFollowupRequests,
  rejectDoctorRequest,
} from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Box, Button, ButtonGroup } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GetFollowupRequestsResponse } from 'clinic-common/types/appointment.types'

export function FollowupRequests() {
  const query = useQuery({
    queryKey: ['followup-requests'],
    queryFn: () => getFollowupRequests(),
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

  const columns: GridColDef<GetFollowupRequestsResponse['requests'][0]>[] = [
    {
      field: 'patientName',
      headerName: 'Patient Name',
      width: 100,
    },
    {
      field: 'followupDate',
      headerName: 'Follow-up Date and Time',
      width: 200,
    },
    {
      field: 'appointmentDate',
      headerName: 'Past Appointment Date',
      width: 200,
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
            color="success"
            onClick={() => {
              handleApprove(column.row.id)
            }}
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
          >
            Reject
          </Button>
        </ButtonGroup>
      ),
    },
  ]

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <ToastContainer />
      <DataGrid
        rows={query.data?.requests || []}
        columns={columns}
        autoHeight
      />
    </Box>
  )
}
