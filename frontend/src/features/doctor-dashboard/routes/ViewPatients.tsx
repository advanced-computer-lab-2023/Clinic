import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { filterPatients, viewPatients } from '@/api/patient'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import { GetMyPatientsResponse } from 'clinic-common/types/patient.types'
import { ChatButton } from '@/components/chats/ChatButton'
import { VideoCallButton } from '@/components/video-call/VideoCallButton'

export function ViewPatients() {
  const query = useQuery(['view-patients'], viewPatients)
  const queryUpComing = useQuery(['upcoming-appointments'], filterPatients)
  const [upcomingAppointments, setUpcomingAppointments] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const navigate = useNavigate()

  if (query.isLoading || query.isRefetching || query.isFetching) {
    return <CardPlaceholder />
  }

  const columns: GridColDef<GetMyPatientsResponse['patients'][0]>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 2,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'mobileNumber',
      headerName: 'Mobile Number',
      flex: 1,
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 3,
      renderCell: (params) => (
        <Stack spacing={1} direction="row">
          <VideoCallButton otherUsername={params.row.username} />
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 0 }}
            onClick={() => {
              navigate(`/doctor-dashboard/patient/${params.id}`)
            }}
          >
            View Patient
          </Button>
          <ChatButton otherUsername={params.row.username} />
        </Stack>
      ),
    },
  ]

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '10px',
      }}
      height="auto"
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <TextField
          id="outlined-basic"
          label="Search for patient"
          variant="outlined"
          style={{ width: '50%', alignSelf: 'center' }}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => setUpcomingAppointments(e.target.checked)}
              checked={upcomingAppointments}
            />
          }
          label="Only upcoming appointments"
        />
      </Box>

      {upcomingAppointments ? (
        <DataGrid
          autoHeight
          rows={
            queryUpComing.data?.filter((user) => {
              return user.name.includes(searchKey)
            }) || []
          }
          columns={columns}
        />
      ) : (
        <DataGrid
          autoHeight
          rows={
            query.data?.filter((user: { name: string | string[] }) => {
              return user.name.includes(searchKey)
            }) || []
          }
          columns={columns}
        />
      )}
    </Box>
  )
}
