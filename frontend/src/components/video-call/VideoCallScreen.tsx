import { useContext, useEffect, useState, useRef } from 'react'
import { VideoContext } from '../../providers/VideoCallProvider'
import '../../components/video-call/styles/Video.css' //"../Video.css";
import { Modal, Input } from 'antd'
import VideoIcon from '../../components/video-call/assests/video.svg'
import VideoOff from '../../components/video-call/assests/video-off.svg'
import Msg_Illus from '../../components/video-call/assests/msg_illus.svg'
import Msg from '../../components/video-call/assests/msg.svg'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import '../../components/video-call/styles/Video.css'
import { socket } from '@/api/socket'
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed'

const { Search } = Input

const VideoCallScreen = () => {
  const {
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    leaveCall,
    sendMsg: sendMsgFunc,
    chat,
    setChat,
    myVdoStatus,
    fullScreen,
    userVdoStatus,
    updateVideo,
    userMicStatus,
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

  useEffect(() => {
    if (callAccepted) {
      setIsScreenVisible(true)
    }
  }, [callAccepted, callEnded, userVideo])

  const modalStyles = {
    body: {
      boxShadow: 'inset 0 0 5px #999',
      borderRadius: 5,
      backgroundColor: '#000000',
    },
    mask: {
      backgroundColor: '#000000',
    },
    header: {
      backgroundColor: '#000000',
    },
    footer: {
      backgroundColor: '#000000',
    },
    content: {
      backgroundColor: '#000000',
    },
  }

  return (
    <>
      <Modal
        title={null}
        open={isScreenVisible}
        onCancel={leaveCall}
        width={700}
        style={{
          backgroundColor: '#000000',
        }}
        styles={modalStyles}
        footer={null}
        getContainer={false}
        closeIcon={false}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
          }}
        >
          <div
            style={{
              width: '80%',
              position: 'absolute',
              bottom: '50px',
              borderRadius: '20px',
              flexDirection: 'row',
              zIndex: 1,
            }}
          >
            <div className="iconsDiv">
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

              <div className="icons" onClick={() => updateVideo()} tabIndex={0}>
                {myVdoStatus ? (
                  <img src={VideoIcon} alt="video on icon" />
                ) : (
                  <img src={VideoOff} alt="video off icon" />
                )}
              </div>
              <div
                className="icons"
                onClick={(e) => {
                  //shop propagation
                  e.stopPropagation()
                  leaveCall()
                  console.log('hang up')
                }}
                tabIndex={0}
                style={{
                  color: 'red',
                  //rgb(255, 255, 255)
                  backgroundColor: '#FD5735',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                }}
              >
                <PhoneMissedIcon style={{ color: '#fff' }} />
              </div>
            </div>
          </div>

          {callAccepted && !callEnded && userVideo && (
            <div
              // className="card2"
              style={{
                textAlign: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
              id="video2"
            >
              <video
                playsInline
                ref={userVideo}
                onClick={fullScreen}
                autoPlay
                className="video-active"
                style={{
                  opacity: `${userVdoStatus ? '1' : '0'}`,
                  width: '100%',
                  height: '100%',
                  borderRadius: '20px',
                  backgroundColor: '#000000',
                  border: '2px solid #fff',
                  // maxHeight: '100%',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '500px',
                  borderRadius: '20px',
                  backgroundColor: '#fff',
                  border: '2px solid #fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: `${userVdoStatus ? '0' : '1'}`,
                  position: 'absolute',
                  justifyItems: 'center',
                }}
              >
                <VideocamOffIcon
                  style={{
                    color: 'grey',
                    fontSize: '5rem',
                  }}
                />
              </div>

              <video
                playsInline
                muted
                onClick={fullScreen}
                ref={myVideo}
                autoPlay
                className="video-active"
                style={{
                  opacity: `${myVdoStatus ? '1' : '0'}`,
                  width: '20%',
                  height: '20%',
                  position: 'absolute',
                  right: '40px',
                  top: '40px',
                  borderRadius: '20%',
                  border: '2px solid #fff',
                }}
              />
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
          )}
        </div>
      </Modal>
    </>
  )
}

export default VideoCallScreen
