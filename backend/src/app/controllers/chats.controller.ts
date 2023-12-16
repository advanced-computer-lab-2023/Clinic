import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { ChatDocument, ChatModel } from '../models/chat.model'
import { UserType } from 'clinic-common/types/user.types'
import { IUser, UserModel } from '../models/user.model'
import {
  MarkAsReadRequest,
  CreateOrGetChatResponse,
  GetChatByIdRequest,
  GetChatByIdResponse,
  GetChatsForUserRequest,
  SendMessageRequest,
  SocketMessage,
  SocketNewChat,
  CHATS_GET_FOR_USER_ROUTE,
  CHATS_CREATE_OR_GET_ROUTE,
  CHATS_GET_BY_ID_ROUTE,
  CHATS_SEND_MESSAGE_ROUTE,
  CHATS_MARK_AS_READ_ROUTE,
} from 'clinic-common/types/chat.types'
import { GetChatsForUserResponse } from 'clinic-common/types/chat.types'
import { CreateOrGetChatRequest } from 'clinic-common/types/chat.types'
import { APIError, NotFoundError } from '../errors'
import { socketIOServer } from '../../app'
import { getEmailAndNameForUsername } from '../services/auth.service'

export const chatsRouter = Router()

type PopulatedUsers = {
  users: IUser[]
}

type PopulatedMessages = {
  messages: Array<
    ChatDocument['messages'][0] & {
      sender: IUser
    }
  >
}

function hasUnreadMessages(
  chat: Pick<ChatDocument, 'lastRead'> & {
    messages: Array<Pick<ChatDocument['messages'][0], 'id' | 'createdAt'>>
  },
  userId: string
): boolean {
  const lastRead = chat.lastRead.get(userId)

  if (chat.messages.length == 0) return false

  console.log(lastRead)

  if (!lastRead) return true

  const lastMessage = chat.messages[chat.messages.length - 1]

  return (
    lastRead.messageId?.toString() !== lastMessage.id.toString() ||
    lastRead.readAt < lastMessage.createdAt
  )
}

chatsRouter.post(
  CHATS_GET_FOR_USER_ROUTE,
  asyncWrapper<GetChatsForUserRequest>(async (req, res) => {
    const { username } = req.body

    const user = await UserModel.findOne({
      username,
    })

    if (!user) {
      throw new NotFoundError()
    }

    const chats = await ChatModel.find({
      users: { $in: [user.id] },
    }).populate<PopulatedUsers>('users')

    res.json(
      (await Promise.all(
        chats.map(async (chat) => ({
          id: chat.id,
          users: await Promise.all(
            chat.users.map(async (user) => ({
              id: user.id as string,
              username: user.username,
              type: user.type as UserType,
              ...(await getEmailAndNameForUsername(user.username)),
            }))
          ),
          createdAt: chat.createdAt.toISOString(),
          lastMessage:
            chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].content
              : 'No messages',
          hasUnreadMessages: hasUnreadMessages(chat, user.id),
        }))
      )) satisfies GetChatsForUserResponse
    )
  })
)

chatsRouter.post(
  CHATS_CREATE_OR_GET_ROUTE,
  asyncWrapper<CreateOrGetChatRequest>(async (req, res) => {
    const { initiator, receiver } = req.body

    const initiatorUser = await UserModel.findOne({
      username: initiator,
    })

    if (!initiatorUser) {
      throw new NotFoundError()
    }

    const receiverUser = await UserModel.findOne({
      username: receiver,
    })

    if (!receiverUser) {
      throw new NotFoundError()
    }

    const existingChat = await ChatModel.findOne({
      users: { $all: [initiatorUser.id, receiverUser.id] },
    })

    if (existingChat) {
      res.json(existingChat.id satisfies CreateOrGetChatResponse)
    } else {
      const chat = await ChatModel.create({
        users: [initiatorUser.id, receiverUser.id],
      })

      socketIOServer.to([receiver, initiator]).emit('new-chat', {
        chatId: chat.id,
      } satisfies SocketNewChat)

      res.json(chat.id satisfies CreateOrGetChatResponse)
    }
  })
)

chatsRouter.post(
  CHATS_GET_BY_ID_ROUTE,
  asyncWrapper<GetChatByIdRequest>(async (req, res) => {
    const { chatId, readerUsername } = req.body

    const chat = await ChatModel.findById(chatId).populate<
      PopulatedUsers & PopulatedMessages
    >(['users', 'messages.sender'])

    if (!chat) {
      throw new NotFoundError()
    }

    const reader = await UserModel.findOne({
      username: readerUsername,
    })

    if (!reader) {
      throw new NotFoundError()
    }

    res.json({
      id: chat.id,
      users: await Promise.all(
        chat.users.map(async (user) => ({
          id: user.id as string,
          username: user.username,
          type: user.type as UserType,
          ...(await getEmailAndNameForUsername(user.username)),
        }))
      ),
      messages: await Promise.all(
        chat.messages.map(async (message) => ({
          id: message.id,
          sender: message.sender.username,
          senderType: message.sender.type as UserType,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          senderDetails: await getEmailAndNameForUsername(
            message.sender.username
          ),
        }))
      ),
      createdAt: chat.createdAt.toISOString(),
      lastMessage:
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1].content
          : 'No messages',
      hasUnreadMessages: hasUnreadMessages(chat, reader.id),
    } satisfies GetChatByIdResponse)
  })
)

chatsRouter.post(
  CHATS_SEND_MESSAGE_ROUTE,
  asyncWrapper<SendMessageRequest>(async (req, res) => {
    const { chatId, senderUsername, content } = req.body

    const chat =
      await ChatModel.findById(chatId).populate<PopulatedUsers>('users')

    if (!chat) {
      throw new NotFoundError()
    }

    const sender = await chat.users.find(
      (user) => user.username === senderUsername
    )

    if (!sender) {
      throw new APIError("Sender doesn't exist in this chat", 400)
    }

    chat.messages.push({
      sender: sender.id,
      content,
    })

    await chat.save()

    const latestMessage = chat.messages[chat.messages.length - 1].toObject()

    // Send message to all users in the chat, socket is used to send
    // the message from BE to FE without FE having to send a request
    // to the BE to get the new message.
    socketIOServer.to(chat.users.map((u) => u.username)).emit('message', {
      ...latestMessage,
      chatId,
      sender: sender.username,
      senderType: sender.type as UserType,
      senderDetails: await getEmailAndNameForUsername(sender.username),
    } satisfies SocketMessage)

    res.status(200).end()
  })
)

chatsRouter.post(
  CHATS_MARK_AS_READ_ROUTE,
  asyncWrapper<MarkAsReadRequest>(async (req, res) => {
    const { chatId, username } = req.body

    const chat = await ChatModel.findById(chatId)

    if (!chat) {
      throw new NotFoundError()
    }

    const user = await UserModel.findOne({
      username,
    })

    if (!user) {
      throw new NotFoundError()
    }

    const lastMessage = chat.messages[chat.messages.length - 1]

    chat.lastRead.set(user.id, {
      messageId: lastMessage.id,
      readAt: new Date(),
    })

    await chat.save()

    res.status(200).end()
  })
)
