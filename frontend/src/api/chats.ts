import { api } from '.'
import {
  MarkAsReadRequest,
  MarkAsReadResponse,
  CreateOrGetChatRequest,
  CreateOrGetChatResponse,
  GetChatByIdRequest,
  GetChatByIdResponse,
  GetChatsForUserRequest,
  GetChatsForUserResponse,
  SendMessageRequest,
  SendMessageResponse,
  CHATS_GET_FOR_USER_ROUTE,
  CHATS_CREATE_OR_GET_ROUTE,
  CHATS_GET_BY_ID_ROUTE,
  CHATS_SEND_MESSAGE_ROUTE,
  CHATS_MARK_AS_READ_ROUTE,
} from 'clinic-common/types/chat.types'

export async function getChatsForUser(params: GetChatsForUserRequest) {
  return await api
    .post<GetChatsForUserResponse>(CHATS_GET_FOR_USER_ROUTE, params)
    .then((res) => res.data)
}

export async function createOrGetChat(params: CreateOrGetChatRequest) {
  return await api
    .post<CreateOrGetChatResponse>(CHATS_CREATE_OR_GET_ROUTE, params)
    .then((res) => res.data)
}

export async function getChatById(params: GetChatByIdRequest) {
  return await api
    .post<GetChatByIdResponse>(CHATS_GET_BY_ID_ROUTE, params)
    .then((res) => res.data)
}

export async function sendMessage(params: SendMessageRequest) {
  return await api
    .post<SendMessageResponse>(CHATS_SEND_MESSAGE_ROUTE, params)
    .then((res) => res.data)
}

export async function markAsRead(params: MarkAsReadRequest) {
  return await api
    .post<MarkAsReadResponse>(CHATS_MARK_AS_READ_ROUTE, params)
    .then((res) => res.data)
}
