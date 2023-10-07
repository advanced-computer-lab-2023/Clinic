import { CardPlaceholder } from '@/components/CardPlaceholder'
import { Box, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import { GetFamilyMembersResponse } from '@/types/familyMember.types'
import { getFamilyMembers } from '@/api/familyMembers'

export function FamilyMembers() {
  const query = useQuery({
    queryKey: ['pending-doctors'],
    queryFn: getFamilyMembers,
  })

  if (query.isLoading) {
    return <CardPlaceholder />
  }

  const columns: GridColDef<GetFamilyMembersResponse['familyMembers'][0]>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'nationalId',
      headerName: 'National ID',
      width: 300,
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 150,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 150,
    },
    {
      field: 'relation',
      headerName: 'Relation',
      width: 100,
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
        <>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => {
              alert(`TODO: Remove ${column.row.name}`)
            }}
          >
            Remove
          </Button>
        </>
      ),
    },
  ]

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={query.data?.familyMembers || []} columns={columns} />
    </Box>
  )
}
