import { APIRoutes } from './routes'

import { Sessions } from '@/types/os'

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
  ..._args: [string, 'agent' | 'team', string, string, string?]
): Promise<Sessions | { data: [] }> => {
  // Sessions are not supported by the custom backend yet.
  // Return empty data to keep the UI functional without errors.
  void _args
  return { data: [] }
}

export const getSessionAPI = async (
  ..._args: [string, 'agent' | 'team', string, string?, string?]
): Promise<null> => {
  // Sessions are not supported by the custom backend yet.
  void _args
  return null
}

export const deleteSessionAPI = async (
  ..._args: [string, string, string, string?]
) => {
  // Sessions are not supported by the custom backend yet.
  void _args
  return new Response(null, { status: 200 })
}
