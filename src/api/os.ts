import { APIRoutes } from './routes'

import { SessionEntry } from '@/types/os'

// Helper function to create headers with optional auth token
const createHeaders = (authToken?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  return headers
}

export const getStatusAPI = async (
  base: string,
  authToken?: string
): Promise<number> => {
  const response = await fetch(APIRoutes.Status(base), {
    method: 'GET',
    headers: createHeaders(authToken)
  })
  return response.status
}

export const getAllSessionsAPI = async (
  base: string,
  authToken?: string
): Promise<SessionEntry[]> => {
  const response = await fetch(APIRoutes.History(base), {
    method: 'GET',
    headers: createHeaders(authToken)
  })

  if (!response.ok) {
    throw new Error(`Erreur chargement sessions: ${response.statusText}`)
  }

  // The backend returns SessionEntry[] directly
  const data: SessionEntry[] = await response.json()
  return data
}

export const getSessionAPI = async (
  ..._args: [string, 'agent' | 'team', string, string?, string?]
): Promise<null> => {
  // Individual session loading not yet implemented
  void _args
  return null
}

export const deleteSessionAPI = async (
  ..._args: [string, string, string, string?]
) => {
  // Session deletion not yet implemented
  void _args
  return new Response(null, { status: 200 })
}
