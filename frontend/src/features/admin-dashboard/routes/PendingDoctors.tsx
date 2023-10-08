import { getPendingDoctors } from '@/api/doctor'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Box, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import { GetPendingDoctorsResponse } from 'clinic-common/types/doctor.types'

export function PendingDoctors() {
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
      width: 150,
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 300,
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
      width: 250,
    },
    {
      field: 'educationalBackground',
      headerName: 'Educational Background',
      width: 250,
    },
    {
      field: '',
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      headerName: 'Actions',
      width: 150,
      renderCell: (column) => (
        <>
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
        </>
      ),
    },
  ]

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={query.data?.doctors || []} columns={columns} />
    </Box>
  )
}
