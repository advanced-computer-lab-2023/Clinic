import { getNotifications, removeNotification } from '@/api/notification'
import { useAuth } from '@/hooks/auth'
import {
  Badge,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Clear } from '@mui/icons-material'

export function NotificationsList() {
  const { user } = useAuth()

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      getNotifications({
        username: user!.username,
      }),
  })

  const removeMutation = useMutation({
    mutationFn: (notificationId: string) =>
      removeNotification({
        username: user!.username,
        notificationId,
      }),
    onSuccess: () => {
      query.refetch()
    },
  })

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const refetchInterval = setInterval(() => {
      query.refetch()
    }, 5000)

    return () => clearInterval(refetchInterval)
  }, [])

  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={query.data?.notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          {query.data?.notifications.map((notification, i) => (
            <React.Fragment key={i}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeMutation.mutateAsync(notification._id)}
                  >
                    <Clear />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={notification.title}
                  secondary={notification.description}
                />
              </ListItem>
              {i < query.data?.notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {query.data?.notifications.length == 0 && (
            <ListItem>
              <ListItemText
                primary="No new notifications"
                secondary="You're all caught up!"
              />
            </ListItem>
          )}
        </List>
      </Popover>
    </>
  )
}
