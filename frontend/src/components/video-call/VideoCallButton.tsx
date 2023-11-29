import { LoadingButton } from '@mui/lab'
import { Dialog } from '@mui/material'
import { useState } from 'react'
import { VideoCall } from '../video-call/VideoCall'
import VideocamIcon from '@mui/icons-material/Videocam'

const VideoCallButton = ({ otherUsername }: { otherUsername: string }) => {
  const [videoMeetId, setVideoMeetId] = useState<string | null>(otherUsername)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <LoadingButton
        variant="contained"
        color="primary"
        size="small"
        style={{
          marginLeft: 10,

          backgroundColor: '#fff',
          // borderRadius: "50%",
        }}
        onClick={() => {
          setIsOpen(true)
          setVideoMeetId('123')
        }}
      >
        <VideocamIcon
          style={{
            color: 'green',
            fontSize: '1.5rem',
            // marginLeft: "10px",
            // marginRight: "10px",
          }}
        />
      </LoadingButton>

      <Dialog
        fullWidth
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="lg"
      >
        {videoMeetId && <VideoCall meetId={videoMeetId} />}
      </Dialog>
    </>
  )
}

export { VideoCallButton }
