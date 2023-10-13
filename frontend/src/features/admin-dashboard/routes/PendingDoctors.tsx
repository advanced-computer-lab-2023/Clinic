import { getPendingDoctors } from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Box, Button, ButtonGroup } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import { GetPendingDoctorsResponse } from 'clinic-common/types/doctor.types'
import { useNavigate } from 'react-router-dom'

export function PendingDoctors() {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['pending-doctors'],
    queryFn: () => getPendingDoctors(),
  })

  if (query.isLoading) {
    return <CardPlaceholder />
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
      width: 150,
      renderCell: (column) => (
        <ButtonGroup>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
              navigate(column.row.username)
            }}
          >
            View
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => {
              alert(`TODO: Approve doctor ${column.row.name} (Sprint 2)`)
            }}
          >
            Approve
          </Button>
        </ButtonGroup>
      ),
    },
  ]

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={query.data?.doctors || []} columns={columns} autoHeight />
    </Box>
  )
}
