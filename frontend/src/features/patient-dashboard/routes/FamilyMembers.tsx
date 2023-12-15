import { CardPlaceholder } from '@/components/CardPlaceholder'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Modal,
  Stack,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import {
  GetFamilyMembersResponse,
  GetLinkedFamilyMembersResponse,
} from 'clinic-common/types/familyMember.types'
import {
  getFamilyMembers,
  getLinkedFamilyMembers,
  getUsersLinkingMe,
} from '@/api/familyMembers'
import { useState } from 'react'
import { AddFamilyMember } from './AddFamilyMember'
import { useNavigate } from 'react-router-dom'
import { SubscribeToHealthPackages } from './SubscribeToHealthPackages'

function ManageHealthPackagesButton({
  patientId,
  isFamilyMember,
}: {
  patientId: string
  isFamilyMember: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <SubscribeToHealthPackages
            isFamilyMember={isFamilyMember}
            subscriberId={patientId}
          />
        </DialogContent>
      </Dialog>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => {
            setOpen(true)
          }}
        >
          Manage Health Package
        </Button>
      </ButtonGroup>
    </>
  )
}

function LinkedFamilyMembers() {
  const linkedFamilyMembersQuery = useQuery({
    queryKey: ['family-members', 'linked'],
    queryFn: getLinkedFamilyMembers,
  })

  const linkedMembers: GridColDef<GetLinkedFamilyMembersResponse[0]>[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 200,
    },
    {
      field: 'mobileNumber',
      headerName: 'Mobile Number',
      width: 200,
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
      field: 'healthPackage',
      valueGetter: (params) => params.row.healthPackage?.name || 'None',
      headerName: 'Health Package',
      width: 150,
    },
    {
      field: 'actions',
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      headerName: 'Actions',
      width: 400,
      renderCell: (column) => (
        <ManageHealthPackagesButton
          patientId={column.row.patientId}
          isFamilyMember={false}
        />
      ),
    },
  ]

  if (linkedFamilyMembersQuery.isLoading) {
    return <CardPlaceholder />
  }

  return (
    <DataGrid
      rows={linkedFamilyMembersQuery.data || []}
      columns={linkedMembers}
      autoHeight
    />
  )
}

export function FamilyMembers() {
  const navigate = useNavigate()
  const [addFamilyMemberModalOpen, setAddFamilyMemberModalOpen] =
    useState(false)

  const query = useQuery({
    queryKey: ['family-members'],
    queryFn: getFamilyMembers,
  })

  const reverseQuery = useQuery({
    queryKey: ['reverseFamilyMembers'],
    queryFn: getUsersLinkingMe,
  })

  if (query.isLoading || reverseQuery.isLoading) {
    return <CardPlaceholder />
  }

  const columns: GridColDef<GetFamilyMembersResponse[0]>[] = [
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
      field: 'healthPackage',
      valueGetter: (params) => params.row.healthPackage.name || 'None',
      headerName: 'Health Package',
    },
    {
      field: 'actions',
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      headerName: 'Actions',
      width: 300,
      renderCell: (column) => (
        <Stack direction="row" spacing={1}>
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
          <ManageHealthPackagesButton
            patientId={column.row.id}
            isFamilyMember={true}
          />
        </Stack>
      ),
    },
  ]

  const columnsLinkingMe: GridColDef<{ name: string }>[] = [
    {
      field: 'name',
      headerName: 'The following patients have you linked',
      width: 300,
    },
    // Additional columns for linkingMe data
  ]

  const linkingMeRows = reverseQuery.data?.names.map((name, index) => ({
    id: index.toString(), // Use index as a simple identifier, you may need a more robust solution
    name,
  }))

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
      <h2>Family Members</h2>
      <DataGrid rows={query.data || []} columns={columns} autoHeight />
      <Divider sx={{ my: 2 }} />
      <h2>Patients Linked as Family Members</h2>
      <LinkedFamilyMembers />
      <Divider sx={{ my: 2 }} />
      <DataGrid
        rows={linkingMeRows || []}
        columns={columnsLinkingMe}
        autoHeight
      />
    </Box>
  )
}
