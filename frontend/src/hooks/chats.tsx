import { useContext } from 'react'
import { ChatsContext } from '../providers/ChatsProvider'

export function useChats() {
  return useContext(ChatsContext)
}
