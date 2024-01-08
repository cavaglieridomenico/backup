export interface AppSettings {
  authcookie: string,
  servicesPerSC?: ServicePerSC[],
  serviceInfo?: ServiceInfo[],
  locale: string,
  currencySymbol: string,
  isMarketplace?: boolean,
  sellerAccount?: VtexAccount,
}

interface ServicePerSC {
  scid: string,
  services: string,
  installationId?: string
}

interface ServiceInfo {
  id: string,
  name: string,
  description: string,
  position: number
}

interface VtexAccount {
  name: string,
  apiKey: string,
  apiToken: string
}
