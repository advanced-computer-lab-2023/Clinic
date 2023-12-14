import { useAuth } from '@/hooks/auth'
import {
  Avatar,
  Button,
  Container,
  Dialog,
  Divider,
  Popover,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import ChangePassword from '@/features/auth/routes/ChangePassword'
import { OnlyAuthenticated } from './OnlyAuthenticated'
import { UserType } from 'clinic-common/types/user.types'
import { PatientProfile } from '@/features/patient-dashboard/components/PatientProfile'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'

export function ProfileMenu() {
  const { user } = useAuth()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const open = Boolean(anchorEl)
  const id = open ? 'profile-popover' : undefined

  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState<boolean>(false)

  return (
    <>
      <Button
        aria-describedby={id}
        color="inherit"
        sx={{ textTransform: 'none' }}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          setAnchorEl(event.currentTarget)
        }}
      >
        <Avatar sx={{ marginRight: 1 }}>{user?.name[0].toUpperCase()}</Avatar>

        <Typography
          variant="body2"
          noWrap
          component="div"
          style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Hi, {user?.name}! <ArrowDropDownIcon />
        </Typography>
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null)
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack>
          <Stack py={2} px={3} direction="row" spacing={3}>
            <Avatar sx={{ width: 64, height: 64 }}>
              {user?.name[0].toUpperCase()}
            </Avatar>
            <Stack>
              <Typography variant="h6" noWrap component="div">
                {user?.name} <small>({user?.type})</small>
              </Typography>
              <Typography variant="subtitle1" noWrap component="div">
                {user?.email}
              </Typography>
              <Typography
                variant="subtitle1"
                noWrap
                component="div"
                color="text.secondary"
              >
                @{user?.username}
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack py={2} px={3} direction="row" spacing={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setChangePasswordDialogOpen(true)}
            >
              Change Password
            </Button>
            <OnlyAuthenticated requiredUserType={UserType.Patient}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setProfileDialogOpen(true)}
              >
                View Profile
              </Button>
            </OnlyAuthenticated>
          </Stack>
        </Stack>
      </Popover>

      <Dialog
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
      >
        <Container sx={{ p: 3 }}>
          <ChangePassword
            onSuccess={() => setChangePasswordDialogOpen(false)}
          />
        </Container>
      </Dialog>

      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        fullWidth
      >
        <Container sx={{ p: 3 }} maxWidth="sm">
          <PatientProfile />
        </Container>
      </Dialog>
    </>
  )
}
