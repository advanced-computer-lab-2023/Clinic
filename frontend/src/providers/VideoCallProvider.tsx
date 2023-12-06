import React, { useState, useEffect, useRef, ReactNode } from 'react'
// import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import { message } from 'antd'
import Ringing from '@/components/video-call/Ringing'
import VideoCallScreen from '@/components/video-call/VideoCallScreen'
// import { useAuth } from '@/hooks/auth'
import { socket } from '@/api/socket'
interface VideoContextType {
  call: any
  callAccepted: boolean
  myVideo: React.MutableRefObject<any>
  userVideo: React.MutableRefObject<any>
  stream: MediaStream | undefined
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  callEnded: boolean
  me: string
  callUser: (id: string) => void
  leaveCall: () => void
  answerCall: () => void
  sendMsg: (value: string) => void
  msgRcv: string
  chat: any[]
  setChat: React.Dispatch<React.SetStateAction<any[]>>
  setMsgRcv: React.Dispatch<React.SetStateAction<string>>
  setOtherUser: React.Dispatch<React.SetStateAction<string>>
  leaveCall1: () => void
  userName: string
  myVdoStatus: boolean
  setMyVdoStatus: React.Dispatch<React.SetStateAction<boolean>>
  userVdoStatus: boolean | undefined
  setUserVdoStatus: React.Dispatch<React.SetStateAction<boolean | undefined>>
  updateVideo: () => void
  myMicStatus: boolean
  userMicStatus: boolean | undefined
  updateMic: () => void
  screenShare: boolean
  handleScreenSharing: () => void
  fullScreen: (e: any) => void
}

export const VideoContext = React.createContext<VideoContextType>(
  {} as VideoContextType
)

interface VideoCallProviderProps {
  children: ReactNode
}

const VideoCallProvider: React.FC<VideoCallProviderProps> = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState<any>(false)
  const [callEnded, setCallEnded] = useState<any>(false)
  const [stream, setStream] = useState<any>()
  const [chat, setChat] = useState<any>([])
  const [name, setName] = useState<any>('')
  const [call, setCall] = useState<any>({})
  const [me, setMe] = useState<any>('')
  const [userName, setUserName] = useState<any>('')
  const [otherUser, setOtherUser] = useState<any>('')
  const [myVdoStatus, setMyVdoStatus] = useState<any>(true)
  const [userVdoStatus, setUserVdoStatus] = useState<any>()
  const [myMicStatus, setMyMicStatus] = useState<any>(true)
  const [userMicStatus, setUserMicStatus] = useState<any>()
  const [msgRcv, setMsgRcv] = useState<any>()
  const [screenShare, setScreenShare] = useState<any>(false)

  const myVideo = useRef<any>()
  const userVideo = useRef<any>()
  const connectionRef = useRef<any>()
  const screenTrackRef = useRef<any>()
  // const { /user } = useAuth()

  // useEffect(() => {
  //   socket.auth = {
  //     token: localStorage.getItem('token'),
  //   }

  //   socket.connect()

  //   return () => {
  //     socket.disconnect()
  //   }
  // }, [user])

  useEffect(() => {
    if (!navigator.mediaDevices)
      return alert('Your browser does not support media devices.')

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream)

        // console.log('heeeerrreeee currentStreem=', currentStream)
        myVideo.current.srcObject = currentStream
      })
      .catch((error) => {
        console.log('heeeerrreee currentStreem=  error  ', error)
      })
  }, [navigator.mediaDevices, callAccepted])

  useEffect(() => {
    if (localStorage.getItem('name')) {
      setName(localStorage.getItem('name'))
    }

    console.log('socket id', socket.id)
    socket.on('me', (id) => setMe(id))
    socket.on('endCall', () => {
      window.location.reload()
    })

    socket.on('updateUserMedia', ({ type, currentMediaStatus }) => {
      // if (currentMediaStatus !== null || currentMediaStatus !== []) {
      switch (type) {
        case 'video':
          setUserVdoStatus(currentMediaStatus)
          break
        case 'mic':
          setUserMicStatus(currentMediaStatus)
          break
        default:
          setUserMicStatus(currentMediaStatus[0])
          setUserVdoStatus(currentMediaStatus[1])
          break
      }
      // }
    })

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      console.log('that call coming from ', from)
      console.log('the signal received is = ', signal)
      setCall({ isReceivingCall: true, from, name: callerName, signal })
    })

    socket.on('msgRcv', ({ msg: value, sender }) => {
      setMsgRcv({ value, sender })
      setTimeout(() => {
        setMsgRcv({})
      }, 2000)
    })
  }, [])

  useEffect(() => {
    console.log('call', call)
  }, [call])
  useEffect(() => {
    console.log('callAccepted', callAccepted)
  }, [callAccepted])
  useEffect(() => {
    console.log('callEnded', callEnded)
  }, [callEnded])
  useEffect(() => {
    console.log('socket.id', socket.id)
  }, [])

  useEffect(() => {
    console.log('call.isReceivingCall', call.isReceivingCall)
  }, [call])

  const answerCall = () => {
    setCallAccepted(true)
    console.log('this call from ', call.from)
    console.log()
    setOtherUser(call.from)
    const peer = new Peer({ initiator: false, trickle: false, stream })

    peer.on('signal', (data) => {
      socket.emit('answerCall', {
        signal: data,
        to: call.from,
        userName: name,
        type: 'both',
        myMediaStatus: [myMicStatus, myVdoStatus],
      })
    })

    peer.on('stream', (currentStream) => {
      console.log('here current stream of the other user  ' + currentStream)
      userVideo.current.srcObject = currentStream
    })

    console.log('the signal to send is = ', call.signal)
    peer.signal(call.signal)

    connectionRef.current = peer
    console.log('your connectionRef is ', connectionRef.current)
  }

  const callUser = (id: string) => {
    console.log('we will call', id, ' and me is ', me)
    console.log('stream is= ', stream)

    const peer = new Peer({ initiator: true, trickle: false, stream })
    setOtherUser(id)
    peer.on('signal', (data) => {
      console.log('the data to send ')
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        // from:
        name,
      })
    })

    socket.on('callAccepted', ({ signal, userName }) => {
      console.log('the signal is equal to = ', signal)
      setCallAccepted(true)
      setUserName(userName)
      peer.signal(signal)
      socket.emit('updateMyMedia', {
        type: 'both',
        currentMediaStatus: [myMicStatus, myVdoStatus],
      })
    })
    console.log('the other user is = ', otherUser)
    peer.on('stream', (currentStream) => {
      console.log('here current stream of the other user  ' + currentStream)
      //wait second
      setTimeout(() => {
        userVideo.current.srcObject = currentStream
      }, 1000)
    })

    connectionRef.current = peer
    console.log(connectionRef.current)
  }

  const updateVideo = () => {
    setMyVdoStatus((currentStatus: any) => {
      socket.emit('updateMyMedia', {
        type: 'video',
        currentMediaStatus: !currentStatus,
      })
      stream.getVideoTracks()[0].enabled = !currentStatus

      return !currentStatus
    })
  }

  const updateMic = () => {
    setMyMicStatus((currentStatus: any) => {
      socket.emit('updateMyMedia', {
        type: 'mic',
        currentMediaStatus: !currentStatus,
      })
      if (stream) stream.getAudioTracks()[0].enabled = !currentStatus

      return !currentStatus
    })
  }

  //SCREEN SHARING
  const handleScreenSharing = () => {
    if (!myVdoStatus) {
      message.error('Turn on your video to share the content', 2)

      return
    }

    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true } as any)
        .then((currentStream) => {
          const screenTrack = currentStream.getTracks()[0]

          // replaceTrack (oldTrack, newTrack, oldStream);
          if (connectionRef.current)
            connectionRef.current.replaceTrack(
              connectionRef.current.streams[0]
                .getTracks()
                .find((track: any) => track.kind === 'video'),
              screenTrack,
              stream
            )

          // Listen click end
          screenTrack.onended = () => {
            connectionRef.current.replaceTrack(
              screenTrack,
              connectionRef.current.streams[0]
                .getTracks()
                .find((track: any) => track.kind === 'video'),
              stream
            )

            myVideo.current.srcObject = stream
            setScreenShare(false)
          }

          myVideo.current.srcObject = currentStream
          screenTrackRef.current = screenTrack
          setScreenShare(true)
        })
        .catch((error: any) => {
          console.log('No stream for sharing ', error)
        })
    } else {
      screenTrackRef.current?.onended()
    }
  }

  //full screen
  const fullScreen = (e: any) => {
    const elem = e.target

    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen()
    }
  }

  const leaveCall = () => {
    setCallEnded(true)

    if (connectionRef && connectionRef.current) connectionRef.current.destroy()
    socket.emit('endCall', { id: otherUser })
    window.location.reload()
  }

  const leaveCall1 = () => {
    socket.emit('endCall', { id: otherUser })
  }

  const sendMsg = (value: any) => {
    socket.emit('msgUser', { name, to: otherUser, msg: value, sender: name })
    const msg = {
      msg: value,
      type: 'sent',
      timestamp: Date.now(),
      sender: name,
    }
    setChat([...chat, msg])
  }

  useEffect(() => {
    console.log('videos')
    // console.log(myVideo.current?.srcObject)
    console.log(userVideo)
  }, [myVideo, userVideo])

  return (
    <VideoContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        sendMsg,
        msgRcv,
        chat,
        setChat,
        setMsgRcv,
        setOtherUser,
        leaveCall1,
        userName,
        myVdoStatus,
        setMyVdoStatus,
        userVdoStatus,
        setUserVdoStatus,
        updateVideo,
        myMicStatus,
        userMicStatus,
        updateMic,
        screenShare,
        handleScreenSharing,
        fullScreen,
      }}
    >
      <Ringing />
      <VideoCallScreen />
      {children}
    </VideoContext.Provider>
  )
}

export { VideoCallProvider }
