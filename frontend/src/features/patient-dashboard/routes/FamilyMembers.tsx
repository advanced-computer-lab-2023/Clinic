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
import { getFamilyMembers } from '@/api/familyMembers'
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
    </Box>
  )
}
