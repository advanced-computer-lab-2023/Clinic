import { Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material'
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
import { NotificationsList } from './Notifications'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { ChatsList } from './chats/ChatsList'
import { ChatsProvider } from '@/providers/ChatsProvider'
import { useAuth } from '@/hooks/auth'
import { VideoCallProvider } from '@/providers/VideoCallProvider'

import { useNavigate } from 'react-router-dom'

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
  const [sidebarLinks, setSidebarLinks] = useState<SidebarLink[]>([])
  const [openDrawer, setOpenDrawer] = useState(false)
  const { user } = useAuth()

  const handleDrawerOpen = () => {
    setOpenDrawer(true)
  }

  const handleDrawerClose = () => {
    setOpenDrawer(false)
  }

  const navigate = useNavigate()

  // Function to handle the back button click
  const handleBackButtonClick = () => {
    navigate(-1) // This will navigate back one step in the browser history
  }

  // Function to handle the forward button click
  const handleForwardButtonClick = () => {
    navigate(1) // This will navigate forward one step in the browser history
  }

  const layout = (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={!openDrawer ? handleDrawerOpen : handleDrawerClose}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleBackButtonClick}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleForwardButtonClick}
            sx={{ mr: 2 }}
          >
            <ArrowForwardIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            Clinic
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <OnlyAuthenticated>
            <NotificationsList />
            <ChatsList />
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
              icon={<LogoutIcon />}
            />
          </OnlyAuthenticated>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Outlet
          context={
            { setSidebarLinks, sidebarLinks } satisfies OutletContextType
          }
        />
      </Box>
    </Box>
  )

  if (user) {
    return (
      <VideoCallProvider>
        <ChatsProvider>{layout}</ChatsProvider>
      </VideoCallProvider>
    )
  } else {
    return layout
  }
}
