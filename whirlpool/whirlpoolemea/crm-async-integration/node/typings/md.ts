

export interface Pagination {
  page: number
  pageSize: number
}

export enum TradePolicy {
  EPP = "EPP",
  FF = "FF",
  VIP = "VIP",
  O2P = "O2P"
}

export interface EMRecord {
  id?: string
  email?: string | null
  hrNumber?: string | null
  clockNumber?: string | null
  integrityCode?: string | null
  status?: boolean
}

export interface PARecord {
  id?: string
  name?: string
  partnerCode?: string
  accessCode?: string
  status?: string
}

export interface CLRecord {
  notification?: string
  id?: string
  userId?: string | null
  crmBpId?: string | null
  webId?: string | null
  userType?: string | null
  email?: string
  firstName?: string | null
  lastName?: string | null
  gender?: string | null
  birthDate?: string | null
  businessPhone?: string | null
  homePhone?: string | null
  phone?: string | null
  isNewsletterOptIn?: boolean | null
  isProfilingOptIn?: boolean | null
  localeDefault?: string | null
  campaign?: string | null
  partnerCode?: string | null
  doubleOptinStatus?: string | null  
}

export interface ADRecord {
  notification?: string
  id?: string
  addressType?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  lastInteractionIn?: string | null
  backflow?: boolean | null
  userId?: string | null
}

export interface CCRecord {
  id?: string
  crmBpId?: string | null
  webId?: string | null
  vtexUserId?: string
  email?: string
  locale?: string
  country?: string
  optinConsent?: string
  profilingConsent?: string | null
  firstName?: string | null
  lastName?: string | null
  gender?: string | null
  dateOfBirth?: string | null
  mobilePhone?: string | null
  homePhone?: string | null
  campaign?: string | null
  userType?: string | null
  addressId?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  partnerCode?: string | null
  doubleOptinStatus?: string | null
  json?: string
}

export interface DoubleOptin {
  optin: string
  profilingOptin: string | null
  DOIStatus: string | null // PENDING - CONFIRMED
}

export interface OptinProfiling {
  optin: string
  profilingOptin: string
}

export enum DOIStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED"
}

export enum MDNotification {
  USER_CREATED = "user created",
  USER_UPDATED = "user updated",
  ADDRESS_CREATED = "address created",
  ADDRESS_UPDATED = "address updated",
  ADDRESS_DELETED = "address deleted"
}

export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

export enum AddressType {
  RESIDENTIAL = "residential"
}

export interface NLRecord {
  id: string
  firstName: string
  lastName: string
  email: string
  isNewsletterOptIn: boolean | null
  isProfilingOptIn?: boolean | null
  campaign?: string | null
  userType?: string | null
  partnerCode?: string | null
  homePhone?: string | null
  businessPhone?: string | null
  phone?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  city?: string | null
  postalCode?: string | null
  state?: string | null
  country?: string | null
  [key: string]: any // => workaround to mute typescript validation alerts in the mapper (mapCLInfo)
}

export interface RegistrationForm {
  Email: string
  Name: string
  Surname: string
  NewsLetterOptIn: boolean
  Address?: string | null
  PhoneNumber?: string | null
  Campaign?: string | null
  processed?: boolean | null
}
