export interface AppSettings {
  sfmcEnabled: boolean
  auth: Auth
}


interface Auth {
  appkey: string
  apptoken: string
}
