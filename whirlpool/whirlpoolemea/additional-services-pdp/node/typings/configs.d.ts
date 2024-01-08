export interface AppSettings {
  authcookie: string,
  servicesPerSC?: ServicePerSC[],
  serviceInfo?: ServiceInfo[],
  newsletWithoutAccReg: boolean,
  Test?: SiteInfo,
  O2P?: SiteInfo,
  isCCProject?: boolean,
  sellerAccount?: VtexAccount,
  EPP?: SiteInfo,
  FF?: SiteInfo,
  VIP?: SiteInfo
  serviceForm: ServiceForm
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

interface SiteInfo {
  hostname: string,
  tradePolicyId: string,
  bindingId?: string,
  ordersLimit?: number,
  FGLimit?: number
}

interface VtexAccount {
  name: string,
  apiKey: string,
  apiToken: string
}


export interface ServiceForm {
  sheetId: string
  gServiceAccount: string
  gServiceKey: string
  types: Type[]
}

interface Type {
  typeName: string
  tab: string
  mdEntity: string
}
