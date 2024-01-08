export interface ClusterInfo {
  mdEntityName: string
  whiteList?: string[]
  keyFields?: string
  tradePolicyId: string
  loginUrl: string
  attrOptinCC: string
}

export interface Taxonomy {
  id: string
  productFamily: string
  magCode: string
}

export interface ProductRegistration {
  fields?: {
    Contactallowance?: string
    Dataorigintype?: string
    OtherInfo?: string
    Zz0010?: string
    Zz0018?: string
    Zz0020?: string
  }
  taxonomy?: Taxonomy[]
}

export interface AppSettings {
  crmEnvironment: string
  useSapPo: boolean
  doubleOptin: boolean
  profilingOptin: boolean
  checkoutAsGuest: boolean
  newsletterAsGuest: boolean
  newsletterMDEntity: string
  isUkProject: boolean
  crmPassword: string
  attrOptin?: string
  attrChannel?: string
  attrProfiling?: string
  attrSourceCampaign?: string
  allowedStates?: string
  newsletterAsGuestThroughGCP: boolean
  gcpHost: string
  gcpProjectId: string
  gcpClientEmail: string
  gcpPrivateKey: string
  gcpTargetAudience: string
  gcpBrand?: string
  gcpCountry?: string
  enabledAPICredentials: string
  MDKey: string
  enabledMDKeyHash: string
  defaultLocale: string
  defaultSource: string
  defaultCountry: string
  localTimeLocale: string
  localTimeZone: string
  webIdPrefix: string
  maxNumOfCharForWebId: number
  maxNumOfDigitsForPhone: number
  authCookie: string
  pixelCrmBackflow: boolean
  crmEntityName: string
  isCCProject: boolean
  epp?: ClusterInfo
  ff?: ClusterInfo
  vip?: ClusterInfo
  crmRecoverPlan: boolean
  crmRecoverPlanStartDate: string
  productRegistration?: ProductRegistration
}

export enum KeyFields {
  EMAIL = "email",
  CLOCK_NUM_OR_HR_NUM = "clockNumber, hrNumber"
}

export enum CRMAppEvents {
  NLSubscription = "crm-newsletter-subscription"
}
