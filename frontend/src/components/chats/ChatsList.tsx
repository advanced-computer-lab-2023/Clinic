import {
  Badge,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useChats } from '@/hooks/chats'
import { Message } from '@mui/icons-material'
import { useAuth } from '@/hooks/auth'
import { Chat } from './Chat'
import { UserBadge } from '../UserBadge'

export function ChatsList() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const { chats } = useChats()
  const { user } = useAuth()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const unreadChatsCount = Object.values(chats).filter(
    (c) => c?.hasUnreadMessages
  ).length

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
        <Badge badgeContent={unreadChatsCount} color="error">
          <Message />
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
          {Object.values(chats).map((chat, i) => (
            <React.Fragment key={i}>
              <ListItemButton
                onClick={() => {
                  setSelectedChatId(chat!.id)
                }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1}>
                      {chat?.users
                        .filter((u) => u.username != user?.username)
                        .map((u) => (
                          <React.Fragment key={u.username}>
                            <Typography>{u.name}</Typography>

                            <UserBadge label={u.type} userType={u.type} />
                          </React.Fragment>
                        ))}
                    </Stack>
                  }
                  secondary={chat?.lastMessage}
                />
              </ListItemButton>
              {i < Object.keys(chats).length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {Object.keys(chats).length == 0 && (
            <ListItem>
              <ListItemText primary="No chats" />
            </ListItem>
          )}
        </List>
      </Popover>
      <Dialog
        fullWidth
        open={!!selectedChatId}
        onClose={() => setSelectedChatId(null)}
        maxWidth="lg"
      >
        {selectedChatId && <Chat chatId={selectedChatId} />}
      </Dialog>
    </>
  )
}

//astyup hdfy
