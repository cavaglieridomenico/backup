export interface VtexSettings {
  mdName: string,
  legalWarrantyId: string,
  extendedWarrantyId: string,
  defaultCountry: string,
  commCodeSpecName: string,
  enabledAPICredentials: string,
  checkoutAsGuest: boolean
}

export interface DnGSettings {
  hostname: string,
  username: string,
  password: string,
  client: string,
  clientChannel: string,
  clientReference: string,
  promoCode: string,
  redirectUrl: string
}

export interface AppSettings {
  vtex: VtexSettings,
  dng: DnGSettings
}
