import { useContext, useEffect, useRef, useState } from 'react'
import { VideoContext } from '../../providers/VideoCallProvider'
import { Modal } from 'antd'
import { Button } from 'antd'
import Phone from '../video-call/assests/phone.gif'
import Teams from '../video-call/assests/teams.mp3' //"../../assests/teams.mp3";
import '../../components/video-call/styles/Options.module.css'
import { PhoneOutlined } from '@ant-design/icons'

const Ringing = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { call, callAccepted, answerCall, setOtherUser, leaveCall1 } =
    useContext(VideoContext)

  const Audio = useRef<any>()
  useEffect(() => {
    if (isModalVisible) {
      Audio?.current?.play()
    } else Audio?.current?.pause()
  }, [isModalVisible])

  useEffect(() => {
    if (call.isReceivingCall) {
      setIsModalVisible(true)
      setOtherUser(call.from)
    } else setIsModalVisible(false)
  }, [call, callAccepted, setOtherUser])

  const showModal = (showVal: any) => {
    setIsModalVisible(showVal)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    leaveCall1()
    window.location.reload()
  }

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <>
          <audio src={Teams} loop ref={Audio} />
          <Modal
            title="Incoming Call"
            visible={isModalVisible}
            onOk={() => showModal(false)}
            onCancel={handleCancel}
            footer={null}
          >
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <h1>
                {call.name} is calling you:{' '}
                <img
                  src={Phone}
                  alt="phone ringing"
                  className={'phone'}
                  style={{ display: 'inline-block' }}
                />
              </h1>
            </div>
            <div className={'btnDiv'}>
              <Button
                // variant="contained"
                className={'answer'}
                color="#29bb89"
                icon={<PhoneOutlined />}
                onClick={() => {
                  answerCall()
                  Audio.current.pause()
                }}
                tabIndex={0}
              >
                Answer
              </Button>
              <Button
                // variant="contained"
                className={'decline'}
                icon={<PhoneOutlined />}
                onClick={() => {
                  setIsModalVisible(false)
                  Audio.current.pause()
                }}
                tabIndex={0}
              >
                Decline
              </Button>
            </div>
          </Modal>
        </>
      )}
    </>
  )
}

export default Ringing
