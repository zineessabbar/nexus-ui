import { useCallback, useState } from 'react'

import { useStore } from '../store'

import { type ChatMessage } from '@/types/os'

const useChatActions = () => {
  const { chatInputRef } = useStore()
  const setMessages = useStore((state) => state.setMessages)
  const setIsEndpointActive = useStore((state) => state.setIsEndpointActive)
  const setIsEndpointLoading = useStore((state) => state.setIsEndpointLoading)
  const setAgents = useStore((state) => state.setAgents)
  const setTeams = useStore((state) => state.setTeams)
  const setSelectedModel = useStore((state) => state.setSelectedModel)
  const setMode = useStore((state) => state.setMode)
  const setAgentId = useStore((state) => state.setAgentId)

  const clearChat = useCallback(() => {
    setMessages([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const focusChatInput = useCallback(() => {
    setTimeout(() => {
      requestAnimationFrame(() => chatInputRef?.current?.focus())
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message])
    },
    [setMessages]
  )

  const initialize = useCallback(async () => {
    setIsEndpointLoading(true)
    try {
      // 1. On valide instantanément la connexion à FastAPI
      setIsEndpointActive(true)

      // 2. On crée un faux "Agent" pour que l'UI puisse afficher un titre
      const ragAgent = [{
        id: 'rag-engine',
        name: 'Moteur de Conformité',
        db_id: 'postgres-local',
        model: { name: 'RAG Auditor', model: 'qwen2.5:7b', provider: 'RAG' }
      }]

      // 3. On injecte ces données dans le store Zustand
      setAgents(ragAgent)
      setTeams([])
      setMode('agent')
      setAgentId('rag-engine')
      setSelectedModel('qwen2.5:7b')

      return { agents: ragAgent, teams: [] }
    } catch (error) {
      console.error('Erreur initialisation :', error)
      setIsEndpointActive(false)
    } finally {
      setIsEndpointLoading(false)
    }
  }, [
    setIsEndpointActive,
    setIsEndpointLoading,
    setAgents,
    setTeams,
    setAgentId,
    setSelectedModel,
    setMode,
  ])

  return {
    clearChat,
    addMessage,
    focusChatInput,
    initialize
  }
}

export default useChatActions
