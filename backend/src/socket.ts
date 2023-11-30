import { JwtPayload, verifyJWTToken } from './app/services/auth.service'
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
    console.log('User: ' + socket.data.username)

    socket.join(socket.data.username)
  })

  return socketIOServer
}
