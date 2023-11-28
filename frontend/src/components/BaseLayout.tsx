import { AccountCircle, Logout } from '@mui/icons-material'
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material'
import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { OnlyAuthenticated } from './OnlyAuthenticated'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { NotificationsList } from './Notifications'
import MenuIcon from '@mui/icons-material/Menu'

interface ListItemLinkProps {
  icon?: React.ReactElement
  primary: string
  to: string
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props
  const location = useLocation()

  return (
    <li>
      <ListItemButton
        component={Link}
        to={to}
        selected={location.pathname === to}
      >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItemButton>
    </li>
  )
}

export type OutletContextType = {
  setSidebarLinks: React.Dispatch<React.SetStateAction<SidebarLink[]>>
  sidebarLinks: SidebarLink[]
}

const drawerWidth = 240

interface SidebarLink {
  to: string
  text: string
  icon?: React.ReactElement
}

export function BaseLayout() {
  const [sidebarLinks, setSidebarLinks] = React.useState<SidebarLink[]>([])
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDrawerOpen = () => {
    setOpenDrawer(true)
  }

  const handleDrawerClose = () => {
    setOpenDrawer(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={!openDrawer ? handleDrawerOpen : handleDrawerClose}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            Clinic
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <OnlyAuthenticated>
            <NotificationsList />
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              // aria-controls={menuId}
              aria-haspopup="true"
              // onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </OnlyAuthenticated>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="temporary"
        anchor="left"
        open={openDrawer}
        onClose={handleDrawerClose}
      >
        <Toolbar />
        <Divider />
        <List aria-label="main mailbox folders">
          {sidebarLinks.map((link) => (
            <ListItemLink
              key={link.to}
              to={link.to}
              primary={link.text}
              icon={link.icon}
            />
          ))}

          <OnlyAuthenticated>
            <ListItemLink
              to="/auth/logout"
              primary="Logout"
              icon={<Logout />}
            />
          </OnlyAuthenticated>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Outlet
            context={
              { setSidebarLinks, sidebarLinks } satisfies OutletContextType
            }
          />
        </LocalizationProvider>
      </Box>
    </Box>
  )
}
