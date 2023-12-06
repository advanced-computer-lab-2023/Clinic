import { useState, useContext, useRef, useEffect } from 'react'
import { Button, Modal } from 'antd'
import { VideoContext } from '@/providers/VideoCallProvider'
import DuoIcon from '@mui/icons-material/Duo'
import RingingSound from '../../components/video-call/assests/phone-ringing-101221.mp3'
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled'
import { ButtonBase } from '@mui/material'
import PhoneCall from '../../components/video-call/assests/phone-calling.gif'

export function VideoCallButton({ otherUsername }: { otherUsername: string }) {
  const [isCalling, setIsCalling] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const Audio = useRef<any>()
  const { callUser, setOtherUser, leaveCall1, callAccepted, callEnded } =
    useContext(VideoContext)
  useEffect(() => {
    if (openModal) {
      Audio?.current?.play()
    } else Audio?.current?.pause()

    console.log('the other username is = ' + otherUsername)
    setOtherUser(otherUsername)
  }, [otherUsername])

  useEffect(() => {
    if (isCalling && !(callAccepted && !callEnded)) setOpenModal(true)
    else setOpenModal(false)
  }, [callAccepted, callEnded, isCalling])

  const endCall = () => {
    setIsCalling(false)
    leaveCall1()
  }

  return (
    <>
      <Button
        style={{
          padding: '0px',
          width: '50px',
          height: '30px',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
        size="small"
        color="primary"
        onClick={() => {
          setIsCalling(true)
          callUser(otherUsername)
          console.log('the other username is = ' + otherUsername)
        }}
      >
        <DuoIcon />
      </Button>
      <Modal
        title="Calling"
        footer={null}
        open={openModal}
        onCancel={endCall}
        style={{
          height: '100px',
          width: '100px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <audio src={RingingSound} loop ref={Audio} />

          <img
            //resize
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'cover',
              justifySelf: 'center',
            }}
            src={PhoneCall}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <ButtonBase onClick={endCall}>
            <PhoneDisabledIcon
              style={{
                color: 'red',
              }}
            />
          </ButtonBase>
        </div>
      </Modal>
    </>
  )
}
