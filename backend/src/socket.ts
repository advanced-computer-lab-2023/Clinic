import {
  JwtPayload,
  getSocketIdForUser,
  updateSocketIdForUser,
  verifyJWTToken,
} from './app/services/auth.service'
import { Server } from 'http'
import { Server as SocketIOServer } from 'socket.io'

export function initializeSocket(expressServer: Server) {
  const socketIOServer = new SocketIOServer<any, any, any, JwtPayload>(
    expressServer,
    // To allow requests from the frontend
    {
      cors: {
        origin: '*',
      },
    }
  )

  // Authenticate to get the user's username
  socketIOServer.use(async (socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication error'))
    }

    // Verify jwt token
    try {
      const decodedToken = await verifyJWTToken(token)
      socket.data = decodedToken
      next()
    } catch (err) {
      return next(new Error('Authentication error'))
    }
  })

  // Each user joins a room with their username, it will be used
  // later to send messages to specific users.
  socketIOServer.on('connection', async (socket) => {
    console.log('Socket.io client connected')
    // console.log('User: ' + socket.data.username)

    socket.join(socket.data.username)
    console.log('Socket.io client connected')
    console.log('socket.id    ', socket.id)
    if (!socket.id) throw new Error('Socket id not found')

    updateSocketIdForUser(socket.data.username, socket.id)
    console.log(
      'before  id for user= ',
      socket.data.username,
      ' is id=',
      socket.id
    )

    socket.emit('me', socket.id)

    socket.on(
      'callUser',
      ({
        userToCall,
        signalData,
        name,
      }: {
        userToCall: string
        signalData: any
        name: string
      }) => {
        console.log('signal in back is ', signalData)
        console.log('callUser', userToCall)
        getSocketIdForUser(userToCall)
          .then((id) => {
            console.log(
              'after    id for user= ',
              socket.data.username,
              ' is id=',
              id
            )
            if (!id) throw new Error('Socket id not found')
            socketIOServer.to(id).emit('callUser', {
              signal: signalData,
              from: socket.id,
              name,
            })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    )

    socket.on(
      'updateMyMedia',
      ({
        type,
        currentMediaStatus,
      }: {
        type: any
        currentMediaStatus: any
      }) => {
        console.log('updateMyMedia')
        socket.broadcast.emit('updateUserMedia', { type, currentMediaStatus })
      }
    )

    socket.on<any>(
      'msgUser',
      ({
        name,
        to,
        msg,
        sender,
      }: {
        name: string
        to: string
        msg: string
        sender: string
      }) => {
        socketIOServer.to(to).emit('msgRcv', { name, msg, sender })
      }
    )

    socket.on<any>('answerCall', (data: any) => {
      socket.broadcast.emit('updateUserMedia', {
        type: data.type,
        currentMediaStatus: data.myMediaStatus,
      })
      console.log('answerCall', data.to)
      console.log(' data signal is ', data.signal)
      socketIOServer.to(data.to).emit('callAccepted', data)
    })
    socket.on<any>('endCall', ({ id }: { id: string }) => {
      socketIOServer.to(id).emit('endCall')
    })
  })

  return socketIOServer
}
