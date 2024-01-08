export interface AppSettings {
  crmEnvironment: string,
  useSapPo: boolean,
  doubleOptin: boolean,
  checkoutAsGuest: boolean,
  crmPassword: string,
  attrOptin?: string,
  attrSourceCampaign?: string,
  allowedStates?: string
  gcpHost: string,
  gcpProjectId: string,
  gcpClientEmail: string,
  gcpPrivateKey: string,
  gcpTargetAudience: string,
  gcpBrand: string,
  gcpCountry: string,
  enabledAPICredentials: string,
  MDKey: string,
  enabledMDKeyHash: string,
  defaultLocale: string,
  localTimeLocale: string,
  localTimeZone: string,
  webIdPrefix: string,
  maxNumOfDigitsForPhone: number,
  authCookie: string,
  eppLoginUrl?: string,
  ffLoginUrl?: string,
  vipLoginUrl?: string,
  crmRecoverPlan: boolean,
  crmRecoverPlanStartDate: string
}

export interface Pagination {
  page: number,
  pageSize: number
}

export enum EPPEventType{
  DELTA_INSERT = "DELTA_INSERT",
  FULL_INSERT = "FULL_INSERT",
  DELTA_DELETE = "DELTA_DELETE"
}

export interface EPPExportRecord {
  emailAddress: string,
  event: string
}

export interface EMRecord {
  id?: string,
  email: string,
  status: boolean
}

export interface PARecord {
  id: string,
  name: string,
  partnerCode: string,
  accessCode: string,
  status: string
}

export interface CLRecord {
  notification?: string,
  id?: string,
  userId?: string|null,
  crmBpId?: string|null,
  webId?: string|null,
  userType?: string|null,
  email?: string,
  firstName?: string|null,
  lastName?: string|null,
  gender?: string|null,
  birthDate?: string|null,
  businessPhone?: string|null,
  homePhone?: string|null,
  phone?: string|null,
  isNewsletterOptIn?: boolean|null,
  localeDefault?: string|null,
  campaign?: string|null,
  partnerCode?: string|null,
  doubleOptinStatus?: string|null
}

export interface ADRecord {
  notification?: string,
  id?: string,
  addressType?: string,
  street?: string,
  number?: string|null,
  complement?: string|null,
  city?: string,
  state?: string|null,
  postalCode?: string,
  country?: string,
  lastInteractionIn?: string|null,
  backflow?: boolean|null
}

export interface CCRecord {
  id?: string,
  crmBpId?: string|null,
  webId?: string,
  vtexUserId?: string,
  email?: string,
  locale?: string,
  country?: string,
  optinConsent?: string,
  firstName?: string|null,
  lastName?: string|null,
  gender?: string|null,
  dateOfBirth?: string|null,
  mobilePhone?: string|null,
  homePhone?: string|null,
  campaign?: string|null,
  userType?: string|null,
  addressId?:string|null,
  street?: string|null,
  number?: string|null,
  complement?: string|null,
  city?: string|null,
  state?: string|null,
  postalCode?: string|null,
  partnerCode?: string|null,
  doubleOptinStatus?: string|null
}

export interface CRMEnvDetails {
  host: string,
  cert: string,
  getAccountEndpoint: string,
  createUpdateAccountEndpoint: string
}

export interface CRMDetails {
  production: CRMEnvDetails,
  quality: CRMEnvDetails
}

export interface DoubleOptin {
  optin: string,
  DOIStatus: string|null // PENDING - CONFIRMED
}

export enum DOIStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED"
}

export interface NewsletterSubscriptionData {
  firstName: string,
  lastName: string,
  email: string,
  isNewsletterOptIn: string,
  campaign: string,
  eventId: string
}


export enum CustomApp {
  PROFILE = "profile"
}

export enum ProfileCustomFields {
  optin = "optin",
  email = "email"
}
