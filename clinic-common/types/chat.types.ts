import { UserType } from './user.types'

export type Message = {
  id: string
  sender: string
  senderType: UserType
  senderDetails: {
    name: string
    email: string
  }
  content: string
  createdAt: string
}

export interface ChatBase {
  id: string
  users: Array<{
    id: string
    username: string
    name: string
    email: string
    type: UserType
  }>
  messages: Message[]
  createdAt: string
  lastMessage: string
  hasUnreadMessages: boolean
}

export const CHATS_GET_FOR_USER_ROUTE = '/chats/get-all'

export interface GetChatsForUserRequest {
  username: string // Could be username of a patient, doctor, or admin
}

export type GetChatsForUserResponse = Array<Omit<ChatBase, 'messages'>>

export const CHATS_CREATE_OR_GET_ROUTE = '/chats/create-or-get'

export interface CreateOrGetChatRequest {
  initiator: string
  receiver: string
}

export type CreateOrGetChatResponse = string // ID of the created chat

export const CHATS_GET_BY_ID_ROUTE = '/chats/get-by-id'

export interface GetChatByIdRequest {
  chatId: string
  readerUsername: string
}

export type GetChatByIdResponse = ChatBase

export const CHATS_SEND_MESSAGE_ROUTE = '/chats/send-message'

export interface SendMessageRequest {
  chatId: string
  senderUsername: string
  content: string
}

export type SendMessageResponse = void

export const CHATS_MARK_AS_READ_ROUTE = '/chats/mark-as-read'

export interface MarkAsReadRequest {
  chatId: string
  username: string
}

export type MarkAsReadResponse = void

// A socket event that is emitted when a new message is sent
export interface SocketMessage extends Message {
  chatId: string
  sender: string
  content: string
  createdAt: string
}

// A socket event that is emitted when a new chat is created
export interface SocketNewChat {
  chatId: string
}
