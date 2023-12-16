import { useChats } from '@/hooks/chats'
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { sendMessage } from '@/api/chats'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/auth'
import { Send as SendIcon } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { UserBadge } from '../UserBadge'
import { ProgressCircle } from '../ProgressCircle'

interface FormData {
  content: string
}

export function Chat({ chatId }: { chatId: string }) {
  const { register, handleSubmit, resetField } = useForm<FormData>()
  const { chats, loadChatMessages, markAsRead } = useChats()
  const { user } = useAuth()

  const chat = chats[chatId]!

  const ref = useCallback(
    (node: HTMLDivElement) => {
      // Scroll to last message
      if (node !== null) {
        node.scrollTop = node.scrollHeight
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chat.messages]
  )

  const sendMessageMutation = useMutation({
    mutationFn: (data: FormData) => {
      return sendMessage({
        chatId,
        senderUsername: user!.username,
        content: data.content,
      })
    },
    onSuccess: () => {
      resetField('content')
    },
  })

  // Load chat messages if they haven't been loaded yet
  useEffect(() => {
    if (!chat.isMessagesLoaded) {
      loadChatMessages(chatId)
    }
  }, [chat.isMessagesLoaded, chatId, loadChatMessages])

  useEffect(() => {
    console.log('Hi')
    if (!chat.isMessagesLoaded || !chat.hasUnreadMessages) return

    markAsRead({
      chatId,
      username: user!.username,
    })
  }, [chat.hasUnreadMessages, chat.isMessagesLoaded, chatId, markAsRead, user])

  if (!chat.isMessagesLoaded) {
    return <ProgressCircle />
  }

  return (
    <Stack spacing={1} p={1}>
      <Box overflow="scroll" ref={ref} maxHeight={500}>
        {chat.messages.map((message, i) => (
          <Card
            key={i}
            variant="outlined"
            sx={{
              marginY: 1,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1}>
                <Typography variant="h6">
                  {message.senderDetails.name}
                </Typography>
                <UserBadge
                  userType={message.senderType}
                  label={message.senderType}
                />
              </Stack>{' '}
              <Typography variant="body1" fontSize={20}>
                {message.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(message.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {chat.messages.length === 0 && (
        <Typography variant="body1">No messages</Typography>
      )}

      <form onSubmit={handleSubmit((data) => sendMessageMutation.mutate(data))}>
        <Stack spacing={1} direction="row">
          <TextField label="Message" {...register('content')} fullWidth />
          <LoadingButton
            variant="contained"
            type="submit"
            loading={sendMessageMutation.isLoading}
          >
            <SendIcon />
          </LoadingButton>
        </Stack>
      </form>
    </Stack>
  )
}
