export const APIRoutes = {
  Analyse: (baseUrl: string) => `${baseUrl}/audit/analyse`,
  AnalyseStream: (baseUrl: string) => `${baseUrl}/audit/analyse/stream`,
  History: (baseUrl: string) => `${baseUrl}/audit/history`,
  Status: (baseUrl: string) => `${baseUrl}/system/health`,
}
