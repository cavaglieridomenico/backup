interface Vtex_Auth {
  Credential: string
}

export interface MarketPlace {
  UserName?: string
  Password?: string
  BasicHash?: string
  IsMarketplace: boolean
  MP_PrefixToIgnore?: string
}

export interface Specification {
  Name: string
  Value: string
}

interface Admin_Settings {
  FB_EntityName: string
  InStock_SpId?: string
  GasSpecs: Specification[]
  SideBySide_Specs: Specification[]
  MarketPlace: MarketPlace
  InstallationServiceIds: string
}
interface Vtex_Settings {
  Auth: Vtex_Auth
  Admin: Admin_Settings
}

export interface FarEye_Settings {
  Country: string
  Host: string
  IsAuthEnabled: boolean
  ClientId?: string
  ClientSecret?: string
  Fulfillment_center: string
  BookingDate_Delay: number
  TimeSlotEndDate_Delay: number
  BookingExpire: number
  StaticToken?: string
  GetSlot_Endpoint: string
  ReserveSlot_Endpoint: string
  CancelSlot_Endpoint: string
  TimeSlotBlackList: string
}
export interface AppSettings {
  Vtex_Settings: Vtex_Settings
  FarEye_Settings: FarEye_Settings

}
