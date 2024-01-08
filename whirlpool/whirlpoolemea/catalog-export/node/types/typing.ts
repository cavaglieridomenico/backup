
export interface VtexSettings {
  hostname?: string,
  accountName?: string,
  apiKey: string,
  apiToken: string,
  salesChannelsIds?: string,
  servicesIds?: string
}

export interface AppSettings {
  mp: VtexSettings,
  isCCProject: boolean,
  seller?: VtexSettings
}
