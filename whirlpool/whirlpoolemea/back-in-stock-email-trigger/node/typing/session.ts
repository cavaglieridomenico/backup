export interface SessionResponse {
  id?: string
  namespaces?: {
    public?: {
      accessCode?: {
        value?: string
      }
    }
    profile?: {
      isAuthenticated?: {
        value?: string
      }
      email?: {
        value?: string
      }
    }
  }
}
