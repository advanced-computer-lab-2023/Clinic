import {
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
} from 'agora-rtc-react'

export const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
}

export const useClient = createClient(config)

export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()

export const channelName = 'mainn'

export const appId: string = '85be5c081f3442eaba36713fc30c7855' //ENTER APP ID HEREe

export const token: string =
  '006902b2e809ca54994ba1af501720d3c0fIACMQnjd3Mmto7F08fdn+kIOkO1sh1WR8GxyXXqdOV7yzWTNKL8AAAAAEAA8g5F5sImxYAEAAQCwibFg'
