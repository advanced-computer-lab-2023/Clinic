import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { CardPlaceholder } from '@/components/CardPlaceholder'
import { filterPatients, viewPatients } from '@/api/patient'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'

export function ViewPatients() {
  const query = useQuery(['view-patients'], viewPatients)
  const queryUpComing = useQuery(['upcoming-appointments'], filterPatients)
  const [upcomingAppointments, setUpcomingAppointments] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const navigate = useNavigate()

  if (query.isLoading || query.isRefetching || query.isFetching) {
    return <CardPlaceholder />
  }
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
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
      flex: 1,
      renderCell: (params) => (
        <strong>
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
        </strong>
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
      <div
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
              defaultChecked
              onChange={(e) => setUpcomingAppointments(e.target.checked)}
              checked={upcomingAppointments}
            />
          }
          label="Only upcoming appointments"
        />
      </div>

      {upcomingAppointments ? (
        <DataGrid
          autoHeight
          rows={
            queryUpComing.data
              ?.filter((user) => {
                return user.name.includes(searchKey)
              })
              .map((user) => {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  mobileNumber: user.mobileNumber,
                  dateOfBirth: user.dateOfBirth,
                }
              }) || []
          }
          columns={columns}
          style={{ display: 'flex', width: '100%' }}
        />
      ) : (
        <DataGrid
          autoHeight
          rows={
            query.data
              ?.filter((user: { name: string | string[] }) => {
                return user.name.includes(searchKey)
              })
              .map((user) => {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  mobileNumber: user.mobileNumber,
                  dateOfBirth: user.dateOfBirth,
                }
              }) || []
          }
          columns={columns}
          style={{ display: 'flex', width: '100%' }}
        />
      )}
    </Box>
  )
}
