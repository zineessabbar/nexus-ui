import { SessionEntry } from '@/types/os'
import { Button } from '../../../ui/button'
import { deleteSessionAPI } from '@/api/os'
import { useStore } from '@/store'
import { toast } from 'sonner'
import Icon from '@/components/ui/icon'
import { useState } from 'react'
import DeleteSessionModal from './DeleteSessionModal'
import useChatActions from '@/hooks/useChatActions'
import { truncateText, cn } from '@/lib/utils'

type SessionItemProps = SessionEntry & {
  isSelected: boolean
  currentSessionId: string | null
  onSessionClick: () => void
}
const SessionItem = ({
  session_name: title,
  session_id,
  isSelected,
  currentSessionId,
  onSessionClick
}: SessionItemProps) => {
  const {
    setSessionId,
    authToken,
    selectedEndpoint,
    sessionsData,
    setSessionsData
  } = useStore()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { clearChat } = useChatActions()

  const handleGetSession = () => {
    onSessionClick()
    setSessionId(session_id)
    // TODO: load messages for this session from backend when endpoint is ready
  }

  const handleDeleteSession = async () => {
    setIsDeleting(true)
    try {
      const response = await deleteSessionAPI(
        selectedEndpoint,
        '',
        session_id,
        authToken
      )

      if (response?.ok && sessionsData) {
        setSessionsData(sessionsData.filter((s) => s.session_id !== session_id))
        if (currentSessionId === session_id) {
          setSessionId(null)
          clearChat()
        }
        toast.success('Session supprimée')
      } else {
        const errorMsg = await response?.text()
        toast.error(
          `Erreur suppression: ${response?.statusText || 'Erreur inconnue'} ${errorMsg || ''}`
        )
      }
    } catch (error) {
      toast.error(
        `Erreur suppression: ${error instanceof Error ? error.message : String(error)}`
      )
    } finally {
      setIsDeleteModalOpen(false)
      setIsDeleting(false)
    }
  }
  return (
    <>
      <div
        className={cn(
          'group flex h-11 w-full items-center justify-between rounded-lg px-3 py-2 transition-colors duration-200 border border-transparent',
          isSelected
            ? 'cursor-default bg-gray-200 shadow-sm'
            : 'cursor-pointer bg-white hover:bg-gray-100 border-gray-200 shadow-sm'
        )}
        onClick={handleGetSession}
      >
        <div className="flex flex-col gap-1">
          <h4
            className={cn('text-sm font-medium', isSelected ? 'text-white font-semibold' : 'text-slate-700')}
          >
            {truncateText(title, 20)}
          </h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="transform opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100 hover:bg-gray-200 text-slate-600"
          onClick={(e) => {
            e.stopPropagation()
            setIsDeleteModalOpen(true)
          }}
        >
          <Icon type="trash" size="xs" />
        </Button>
      </div>
      <DeleteSessionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteSession}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default SessionItem
