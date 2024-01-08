export interface ClientProfileData {
  id?: string
  email?: string
  firstName: string
  lastName: string
  phone: string
  userProfileId: string
}

export interface Address {
  receiverName: string
  addressId: string
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  neighborhood: string
  complement: string
  reference: string
}

export interface CustomApp {
  id: number
  major: string
  fields: string[]
}

export interface ClientPreferencesData {
  optinNewsLetter : boolean  
}

export interface Order {
  salesChannel: string
  clientProfileData: ClientProfileData
  shippingData: {
    address: Address
  }
  customData: {
    customApps: CustomApp[]
  }
  clientPreferencesData : ClientPreferencesData
}

export enum CustomAppIds {
  PROFILE = "profile",
  FISCALDATA = "fiscaldata"
}

export enum ProfileCustomFields {
  accessCode = "accessCode",
  optin = "optin",
  email = "email",
  profilingOptIn = "profilingOptIn"
}
