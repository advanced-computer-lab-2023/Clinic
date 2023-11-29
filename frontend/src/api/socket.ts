import { io } from 'socket.io-client'

export const socket = io('http://localhost:3000', {
  auth: {
    token: localStorage.getItem('token'),
  },
  autoConnect: false,
})
