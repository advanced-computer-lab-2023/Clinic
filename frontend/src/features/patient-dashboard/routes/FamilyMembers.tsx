import { CardPlaceholder } from '@/components/CardPlaceholder'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Modal,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import { GetFamilyMembersResponse } from 'clinic-common/types/familyMember.types'
import { getFamilyMembers, getUsersLinkingMe } from '@/api/familyMembers'
import { useState } from 'react'
import { AddFamilyMember } from './AddFamilyMember'
import { useNavigate } from 'react-router-dom'

export function FamilyMembers() {
  const navigate = useNavigate()
  const [addFamilyMemberModalOpen, setAddFamilyMemberModalOpen] =
    useState(false)

  const query = useQuery({
    queryKey: ['familyMembers'],
    queryFn: getFamilyMembers,
  })

  const reverseQuery = useQuery({
    queryKey: ['reverseFamilyMembers'],
    queryFn: getUsersLinkingMe,
  })

  if (query.isLoading || reverseQuery.isLoading) {
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
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => {
              navigate(column.row.id)
            }}
          >
            View
          </Button>
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
        </ButtonGroup>
      ),
    },
  ]
  const columnsLinkingMe: GridColDef<{ name: string }>[] = [
    { field: 'name', headerName: 'The following patients have you linked', width: 300 },
    // Additional columns for linkingMe data
  ]

  const linkingMeRows = reverseQuery.data?.names.map((name, index) => ({
    id: index.toString(), // Use index as a simple identifier, you may need a more robust solution
    name,
  }));
  
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Modal
        open={addFamilyMemberModalOpen}
        onClose={() => setAddFamilyMemberModalOpen(false)}
      >
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <AddFamilyMember
            onSuccess={() => setAddFamilyMemberModalOpen(false)}
          />
        </Container>
      </Modal>

      <Button
        variant="contained"
        size="large"
        onClick={() => setAddFamilyMemberModalOpen(true)}
      >
        Add Family Member
      </Button>
      <Divider sx={{ my: 2 }} />
      <DataGrid
        rows={query.data?.familyMembers || []}
        columns={columns}
        autoHeight
      />
      <Divider sx={{ my: 2 }} />
      <DataGrid
        rows={linkingMeRows || []}
        columns={columnsLinkingMe}
        autoHeight
      />
    </Box>
  )
}
