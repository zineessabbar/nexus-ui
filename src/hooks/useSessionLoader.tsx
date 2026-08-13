import { useCallback } from 'react'
import { getAllSessionsAPI } from '@/api/os'
import { useStore } from '../store'
import { toast } from 'sonner'


const useSessionLoader = () => {
  const selectedEndpoint = useStore((state) => state.selectedEndpoint)
  const authToken = useStore((state) => state.authToken)
  const setIsSessionsLoading = useStore((state) => state.setIsSessionsLoading)
  const setSessionsData = useStore((state) => state.setSessionsData)

  const getSessions = useCallback(
    async () => {
      if (!selectedEndpoint) return

      try {
        setIsSessionsLoading(true)
        const sessions = await getAllSessionsAPI(selectedEndpoint, authToken)
        setSessionsData(sessions)
      } catch {
        toast.error('Erreur chargement des sessions')
        setSessionsData([])
      } finally {
        setIsSessionsLoading(false)
      }
    },
    [selectedEndpoint, authToken, setSessionsData, setIsSessionsLoading]
  )

  return { getSessions }
}

export default useSessionLoader
