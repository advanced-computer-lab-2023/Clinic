import {
  createOrGetChat,
  getChatById,
  getChatsForUser,
  markAsRead as apiMarkAsRead,
} from '@/api/chats'
import { socket } from '@/api/socket'
import { Chat } from '@/components/chats/Chat'
import { useAuth } from '@/hooks/auth'
import { useQuery } from '@tanstack/react-query'
import { ChatBase, SocketMessage } from 'clinic-common/types/chat.types'
import { createContext, useCallback, useEffect, useState } from 'react'

interface Chat extends ChatBase {
  isMessagesLoaded: boolean
}

interface ChatsContextType {
  chats: {
    [key: string]: Chat | undefined
  }
  isLoading: boolean
  loadChatMessages: (chatId: string) => void
  createOrGetChatWith: (otherUsername: string) => Promise<string>
  markAsRead: (data: { chatId: string; username: string }) => Promise<void>
}

export const ChatsContext = createContext<ChatsContextType>(
  {} as ChatsContextType
)

export function ChatsProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<{
    [key: string]: Chat | undefined
  }>({})
  const { user } = useAuth()

  const loadChatMessages = useCallback(
    async (chatId: string) => {
      if (chats[chatId] && chats[chatId]?.isMessagesLoaded) {
        return chats[chatId]!
      }

      const chat = {
        ...(await getChatById({ chatId, readerUsername: user!.username })),
        isMessagesLoaded: true,
      }

      setChats({
        ...chats,
        [chatId]: chat,
      })

      return chat
    },
    [chats, user]
  )

  const createOrGetChatWith = useCallback(
    async (otherUsername: string) => {
      const chatId = await createOrGetChat({
        initiator: user!.username,
        receiver: otherUsername,
      })

      await loadChatMessages(chatId)

      return chatId
    },
    [loadChatMessages, user]
  )

  const markAsRead = useCallback(
    async ({ chatId, username }: { chatId: string; username: string }) => {
      await apiMarkAsRead({
        chatId,
        username,
      })

      setChats({
        ...chats,
        [chatId]: {
          ...chats[chatId]!,
          hasUnreadMessages: false,
        },
      })
    },
    [chats]
  )

  const onMessageReceived = useCallback(
    async (data: SocketMessage) => {
      const chat = await loadChatMessages(data.chatId)

      setChats({
        ...chats,
        [data.chatId]: {
          ...chat,
          messages: [...chat.messages, data],
          lastMessage: data.content,
          hasUnreadMessages: true,
        },
      })
    },
    [chats, loadChatMessages]
  )

  const onNewChat = useCallback(
    async (data: SocketMessage) => {
      const chat = await loadChatMessages(data.chatId)

      setChats({
        ...chats,
        [data.chatId]: chat,
      })
    },
    [setChats, chats, loadChatMessages]
  )

  const chatsListQuery = useQuery({
    queryKey: ['chats'],
    queryFn: () =>
      getChatsForUser({
        username: user!.username,
      }),
    onSuccess: (data) => {
      setChats(
        Object.fromEntries(
          data.map((chat) => [
            chat.id,
            {
              ...chat,
              isMessagesLoaded: false,
              messages: [],
            },
          ])
        )
      )
    },
  })

  useEffect(() => {
    socket.auth = {
      token: localStorage.getItem('token'),
    }

    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [user])

  useEffect(() => {
    socket.on('message', onMessageReceived)
    socket.on('new-chat', onNewChat)

    return () => {
      socket.off('message', onMessageReceived)
      socket.off('new-chat', onNewChat)
    }
  }, [onMessageReceived, onNewChat])

  return (
    <ChatsContext.Provider
      value={{
        chats,
        isLoading: chatsListQuery.isLoading,
        loadChatMessages,
        createOrGetChatWith,
        markAsRead,
      }}
    >
      {children}
    </ChatsContext.Provider>
  )
}
