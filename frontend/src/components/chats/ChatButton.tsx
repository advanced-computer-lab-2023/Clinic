import { useMutation } from '@tanstack/react-query'
import { Dialog } from '@mui/material'
import { useState } from 'react'
import { Chat } from './Chat'
import { LoadingButton } from '@mui/lab'
import { useChats } from '@/hooks/chats'

export function ChatButton({ otherUsername }: { otherUsername: string }) {
  const { createOrGetChatWith } = useChats()

  const [chatId, setChatId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: () => createOrGetChatWith(otherUsername),
    onSuccess: (chatId) => {
      setChatId(chatId)
      setIsOpen(true)
    },
  })

  return (
    <>
      <LoadingButton
        variant="contained"
        color="primary"
        size="small"
        onClick={() => {
          mutation.mutate()
        }}
        loading={mutation.isLoading}
      >
        Chat
      </LoadingButton>

      <Dialog
        fullWidth
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="lg"
      >
        {chatId && <Chat chatId={chatId} />}
      </Dialog>
    </>
  )
}
