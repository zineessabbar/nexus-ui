// src/hooks/useAIStreamHandler.tsx
import { useCallback } from 'react'
import { APIRoutes } from '@/api/routes'
import useChatActions from '@/hooks/useChatActions'
import { useStore } from '../store'
import { toast } from 'sonner'

const useAIChatStreamHandler = () => {
  const { addMessage, focusChatInput } = useChatActions()
  const setIsStreaming = useStore((state) => state.setIsStreaming)
  const updateLastAgentMessage = useStore((state) => state.updateLastAgentMessage)
  const selectedEndpoint = useStore((state) => state.selectedEndpoint)
  const selectedModel = useStore((state) => state.selectedModel)

  const handleStreamResponse = useCallback(
    async (input: string | FormData) => {
      // 1. Extraction du texte saisi par l'utilisateur
      const messageText = input instanceof FormData ? input.get('message') as string : input

      // 2. Affichage du message de l'utilisateur dans l'UI
      addMessage({
        role: 'user',
        content: messageText,
        created_at: Math.floor(Date.now() / 1000)
      })

      // 3. Affichage d'un message "Agent" vide (loading spinner)
      addMessage({
        role: 'agent',
        content: '',
        tool_calls: [],
        streamingError: false,
        created_at: Math.floor(Date.now() / 1000) + 1
      })

      setIsStreaming(true)

      try {
        // 4. Connexion SSE au endpoint de streaming
        const response = await fetch(
          APIRoutes.AnalyseStream(selectedEndpoint),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: messageText, model: selectedModel || 'qwen2.5:7b' })
          }
        )

        if (!response.ok) {
          throw new Error("Erreur lors de l'audit de conformité.")
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let accumulatedContent = ''
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Traitement des lignes SSE complètes
          const lines = buffer.split('\n')
          // Garder la dernière ligne incomplète dans le buffer
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue

            try {
              const jsonStr = trimmed.replace(/^data:\s*/, '')
              const data = JSON.parse(jsonStr)

              if (data.type === 'token') {
                accumulatedContent += data.data
                updateLastAgentMessage(accumulatedContent)
              } else if (data.type === 'domaines') {
                // Optionnel : afficher les domaines identifiés
                console.log('Domaines identifiés:', data.data)
              } else if (data.type === 'done') {
                // Streaming terminé
                break
              } else if (data.type === 'error') {
                toast.error("Le moteur RAG n'a pas répondu.")
                updateLastAgentMessage("Erreur de connexion au serveur d'audit.")
                break
              }
            } catch {
              // Ligne SSE mal formée, on ignore
            }
          }
        }
      } catch (error) {
        console.error(error)
        toast.error("Le moteur RAG n'a pas répondu.")
        updateLastAgentMessage("Erreur de connexion au serveur d'audit.")
      } finally {
        setIsStreaming(false)
        focusChatInput()
      }
    },
    [addMessage, setIsStreaming, updateLastAgentMessage, selectedEndpoint, selectedModel, focusChatInput]
  )

  return { handleStreamResponse }
}

export default useAIChatStreamHandler