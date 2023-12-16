import {
  Avatar,
  Dialog,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useChats } from '@/hooks/chats'
import { useAuth } from '@/hooks/auth'
import { Chat } from './Chat'
import { ProgressCircle } from '../ProgressCircle'

export function AllChats() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const { chats, isLoading } = useChats()
  const { user } = useAuth()

  if (isLoading) {
    return <ProgressCircle />
  }

  return (
    <>
      <List>
        <h3
          style={{
            marginTop: '0',
            marginBottom: '8px',
            font: 'bold',
          }}
        >
          Messages
        </h3>
        {Object.values(chats).map((chat, i) => (
          <React.Fragment key={i}>
            <ListItemButton
              sx={{
                borderRadius: '12px',
                marginBottom: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => {
                setSelectedChatId(chat!.id)
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    fontWeight="bold"
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        marginRight: 2,
                        width: '23',
                        height: '24',
                      }}
                    >
                      {chat?.users
                        .filter((u) => u.username !== user?.username)
                        .map((u) => u.username)
                        .join(', ')
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>
                    <div>
                      <div>
                        {chat?.users
                          .filter((u) => u.username !== user?.username)
                          .map((u) => u.username)
                          .join(', ')}
                      </div>
                      <div
                        style={{
                          margin: 'auto',
                          display: 'flex',
                          fontWeight: 'normal',
                        }}
                      >
                        {chat?.lastMessage}
                      </div>
                    </div>
                  </Typography>
                }
              />
            </ListItemButton>
            {i < Object.keys(chats).length - 1}
          </React.Fragment>
        ))}

        {Object.keys(chats).length == 0 && (
          <ListItem>
            <ListItemText primary="No chats" />
          </ListItem>
        )}
      </List>
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
