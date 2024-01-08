export interface AppSettings {
  sfmcEnabled: boolean
  auth: Auth
  sellerAccount: string
}


interface Auth {
  appkey: string
  apptoken: string
}
