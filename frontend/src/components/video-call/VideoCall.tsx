import { useState, useEffect } from 'react'
import {
  appId,
  token,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from './settings.tsx'
import { Grid } from '@mui/material'
import Video from './Video'
import Controls from './Controls'

export default function VideoCall(props: any) {
  const { setInCall } = props
  const [users, setUsers] = useState([])
  const [start, setStart] = useState(false)
  const client = useClient()
  const { ready, tracks } = useMicrophoneAndCameraTracks()

  useEffect(() => {
    const init = async (name: any) => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)

        function fun(prevUsers: any[]): any {
          return [...prevUsers, user]
        }

        if (mediaType === 'video') {
          setUsers(fun)
        }

        if (mediaType === 'audio') {
          user.audioTrack?.play()
        }
      })

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'audio') {
          if (user.audioTrack) user.audioTrack.stop()
        }

        if (mediaType === 'video') {
          setUsers((prevUsers) => {
            return prevUsers.filter(
              (User: { uid: string }) => User.uid !== user.uid
            )
          })
        }
      })

      client.on('user-left', (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter(
            (User: { uid: string }) => User.uid !== user.uid
          )
        })
      })

      try {
        await client.join(appId, name, token + Math.random() * 1000, null)
      } catch (error) {
        console.log('error')
      }

      try {
        if (tracks) await client.publish([tracks[0], tracks[1]])
        setStart(true)
      } catch (error) {
        console.log(error)
      }
    }

    if (ready && tracks) {
      try {
        console.log('begin initializing')
        init(channelName)
      } catch (error) {
        console.log(error)
      }
    }
  }, [client, ready, tracks])

  return (
    <Grid container direction="column" style={{ height: '100%' }}>
      <Grid item style={{ height: '5%' }}>
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </Grid>
      <Grid item style={{ height: '95%' }}>
        {start && tracks && <Video tracks={tracks} users={users} />}
      </Grid>
    </Grid>
  )
}
