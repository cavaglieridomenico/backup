export interface GoogleCredentials {
  access_token: string
  token_type: string
  expiry_date: number
  id_token?: string
  refresh_token: string
}
