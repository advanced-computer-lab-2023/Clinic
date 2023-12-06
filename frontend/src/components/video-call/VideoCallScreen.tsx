import { useContext, useEffect, useState, useRef } from 'react'
import { VideoContext } from '../../providers/VideoCallProvider'
import '../../components/video-call/styles/Video.css' //"../Video.css";
import { Modal, Avatar, Input, Button } from 'antd'
import VideoIcon from '../../components/video-call/assests/video.svg'
import VideoOff from '../../components/video-call/assests/video-off.svg'
import Msg_Illus from '../../components/video-call/assests/msg_illus.svg'
import Msg from '../../components/video-call/assests/msg.svg'
import ScreenShare from '../../components/video-call/assests/share_screen.svg'
import { UserOutlined } from '@ant-design/icons'
import { Dialog } from '@mui/material'
import Hang from '../../components/video-call/assests/hang.svg'
import '../../components/video-call/styles/Options.module.css'
import { socket } from '@/api/socket'

const { Search } = Input

const VideoCallScreen = () => {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    name,
    callEnded,
    leaveCall,
    sendMsg: sendMsgFunc,
    chat,
    setChat,
    userName,
    myVdoStatus,
    fullScreen,
    handleScreenSharing,
    userVdoStatus,
    updateVideo,
    myMicStatus,
    userMicStatus,
    updateMic,
  } = useContext(VideoContext)

  const [isScreenVisible, setIsScreenVisible] = useState(false)
  const [sendMsg, setSendMsg] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  socket.on('msgRcv', ({ msg: value, sender }) => {
    const msg = { msg: value, type: 'rcv', sender, timestamp: Date.now() }
    setChat([...chat, msg])
  })
  console.log('socket.id', socket.id)
  const dummy = useRef<any>()

  useEffect(() => {
    if (dummy?.current) dummy.current.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

  const showModal = (showVal: any) => {
    setIsModalVisible(showVal)
  }

  const onSearch = (value: any) => {
    if (value && value.length) sendMsgFunc(value)
    setSendMsg('')
  }

  // useEffect(() => {
  //   if (msgRcv?.value && !isModalVisible) {
  //     notification.open({
  //       message: '',
  //       description: `${msgRcv.sender}: ${msgRcv.value}`,
  //       icon: <MessageOutlined style={{ color: '#108ee9' }} />,
  //     })
  //   }
  // }, [msgRcv])

  useEffect(() => {
    if (callAccepted) {
      setIsScreenVisible(true)
    }
  }, [callAccepted, callEnded, userVideo])

  return (
    <>
      <Dialog
        title="Basic Modal"
        open={isScreenVisible}
        onClose={() => setIsScreenVisible(false)}
        maxWidth="xl"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gap: '5rem',
            padding: '1rem',
          }}
        >
          <div
            style={{ textAlign: 'center' }}
            className="card"
            id={callAccepted && !callEnded ? 'video1' : 'video3'}
          >
            <div style={{ height: '2rem' }}>
              <h3>{myVdoStatus && name}</h3>
            </div>
            <div className="video-avatar-container">
              <video
                playsInline
                muted
                onClick={fullScreen}
                ref={myVideo}
                autoPlay
                className="video-active"
                style={{
                  opacity: `${myVdoStatus ? '1' : '0'}`,
                }}
              />

              <Avatar
                style={{
                  backgroundColor: '#116',
                  position: 'absolute',
                  opacity: `${myVdoStatus ? '-1' : '2'}`,
                }}
                size={98}
                icon={!name && <UserOutlined />}
              >
                {name}
              </Avatar>
            </div>

            <div className="iconsDiv">
              <div
                className="icons"
                onClick={() => {
                  updateMic()
                }}
                tabIndex={0}
              >
                <i
                  className={`fa fa-microphone${myMicStatus ? '' : '-slash'}`}
                  style={{ transform: 'scaleX(-1)' }}
                  aria-label={`${myMicStatus ? 'mic on' : 'mic off'}`}
                  aria-hidden="true"
                ></i>
              </div>

              {callAccepted && !callEnded && (
                <div
                  className="icons"
                  onClick={() => {
                    setIsModalVisible(!isModalVisible)
                  }}
                  tabIndex={0}
                >
                  <img src={Msg} alt="chat icon" />
                </div>
              )}
              <Modal
                title="Chat"
                footer={null}
                visible={isModalVisible}
                onOk={() => showModal(false)}
                onCancel={() => showModal(false)}
                style={{ maxHeight: '100px' }}
              >
                {chat.length ? (
                  <div className="msg_flex">
                    {chat.map((msg) => (
                      <div
                        className={msg.type === 'sent' ? 'msg_sent' : 'msg_rcv'}
                      >
                        {msg.msg}
                      </div>
                    ))}
                    <div ref={dummy} id="no_border"></div>
                  </div>
                ) : (
                  <div className="chat_img_div">
                    <img
                      src={Msg_Illus}
                      alt="msg_illus"
                      className="img_illus"
                    />
                  </div>
                )}
                <Search
                  placeholder="your message"
                  allowClear
                  className="input_msg"
                  enterButton="Send 🚀"
                  onChange={(e) => setSendMsg(e.target.value)}
                  value={sendMsg}
                  size="large"
                  onSearch={onSearch}
                />
              </Modal>
              {callAccepted && !callEnded && (
                <div
                  className="icons"
                  onClick={() => handleScreenSharing()}
                  tabIndex={0}
                >
                  <img src={ScreenShare} alt="share screen" />
                </div>
              )}

              <div className="icons" onClick={() => updateVideo()} tabIndex={0}>
                {myVdoStatus ? (
                  <img src={VideoIcon} alt="video on icon" />
                ) : (
                  <img src={VideoOff} alt="video off icon" />
                )}
              </div>
            </div>
          </div>

          {callAccepted && !callEnded && userVideo && (
            <div className="card2" style={{ textAlign: 'center' }} id="video2">
              <div style={{ height: '2rem' }}>
                <h3>{userVdoStatus && (call.name || userName)}</h3>
              </div>

              <div className="video-avatar-container">
                <video
                  playsInline
                  ref={userVideo}
                  onClick={fullScreen}
                  autoPlay
                  className="video-active"
                  style={{
                    opacity: `${userVdoStatus ? '1' : '0'}`,
                  }}
                />

                <Avatar
                  style={{
                    backgroundColor: '#116',
                    position: 'absolute',
                    opacity: `${userVdoStatus ? '-1' : '2'}`,
                  }}
                  size={98}
                  icon={!(userName || call.name) && <UserOutlined />}
                >
                  {userName || call.name}
                </Avatar>
                {!userMicStatus && (
                  <i
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      padding: '0.3rem',
                      backgroundColor: '#fefefebf',
                    }}
                    className="fad fa-volume-mute fa-2x"
                    aria-hidden="true"
                    aria-label="microphone muted"
                  ></i>
                )}
              </div>
            </div>
          )}
        </div>
        <Button
          // variant={"contained" }
          onClick={leaveCall}
          style={{
            alignSelf: 'center',
            margin: '1rem',
          }}
          className={'hang'}
          tabIndex={0}
        >
          <img src={Hang} alt="hang up" style={{ height: '15px' }} />
          &nbsp; Hang up
        </Button>
      </Dialog>
    </>
  )
}

export default VideoCallScreen
