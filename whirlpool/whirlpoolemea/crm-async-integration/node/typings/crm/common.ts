export enum CRMPayloadPlaceholders {
  NAMESPACE = "$NAMESPACE$",
  NAMESPACEDECL = "$NAMESPACEDECL$",
  DATA = "$DATA$"
}

export const CRMBaseMessage =
  `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <n0:${CRMPayloadPlaceholders.NAMESPACE} xmlns:n0="${CRMPayloadPlaceholders.NAMESPACEDECL}">
        ${CRMPayloadPlaceholders.DATA}
      </n0:$NAMESPACE$>
    </soap:Body>
  </soap:Envelope>`

export interface CRMSettings {
  crmEnvironment: string
  crmPassword: string
  useSapPo: boolean
  isUkProject: boolean
}

export interface CRMServiceDetails {
  endpoint: string
  contentType?: string
  wsdl?: string
  namespace?: string
  namespaceRef?: string
}

export interface CRMEnvDetails {
  host: string
  cert: string
  envPath: string
}

export interface CRMDetails {
  getAccount: CRMServiceDetails
  createAccount: CRMServiceDetails
  productRegistration?: CRMServiceDetails
  production: CRMEnvDetails
  quality: CRMEnvDetails
}

export enum CrmEnvironment {
  PROD = "production",
  QA = "quality"
}

export enum OptinCRMReq {
  CONFIRMED = "1",
  PENDING = "4",
  DENIED = "2",
  YES = "Y",
  NO = "N"
}

export enum OptinCRMQuery {
  YES = "y",
  CONFIRMED = "allowed",
  PENDING = "allowed to be confirmed",
  DENIED = "disallowed"
}

export enum GenderCRM {
  MALE = "0001",
  FEMALE = "0002"
}

export enum CharSize {
  "char1" = 1,
  "char3" = 3,
  "char4" = 4,
  "char6" = 6,
  "char8" = 8,
  "char10" = 10,
  "char12" = 12,
  "char18" = 18,
  "char20" = 20,
  "char30" = 30,
  "char32" = 32,
  "char40" = 40,
  "char50" = 50,
  "char60" = 60,
  "char120" = 120,
  "char150" = 150,
  "char220" = 220,
  "char241" = 241,
  "char999" = 999
}

export enum AttSet {
  EU_CONSUMER_CC = "EU_CONSUMER_CC",
  EU_CONSUMER_BRAND = "EU_CONSUMER_BRAND",
  EU_SOURCE_CAMPAIGN = "EU_SOURCE_CAMPAIGN",
  CONSUMER_PRIVACY = "CONSUMER_PRIVACY",
  CLOSED_COMMUNITY = "CLOSED_COMMUNITY",
  COMUNIC_BRAND = "COMUNIC_BRAND",
  EU_CONSUMER_PRV = "EU_CONSUMER_PRV",
  EU_CU_SEGMENTATION = "EU_CU_SEGMENTATION"

}

export enum AttName {
  EU_CONSUMER_MODEL = "EU_CONSUMER_MODEL",
  EU_CONSUMER_EPP_LINK = "EU_CONSUMER_EPP_LINK",
  EU_CONSUMER_EPP_LINK_KEY = "EU_CONSUMER_EPP_LINK_KEY",
  EU_CONSUMER_FF_LINK = "EU_CONSUMER_FF_LINK",
  EU_CONSUMER_FF_LINK_KEY = "EU_CONSUMER_FF_LINK_KEY",
  EU_CONSUMER_VIP_COMPANY = "EU_CONSUMER_VIP_COMPANY",
  EU_CONSUMER_VIP_COMPANY_CODE = "EU_CONSUMER_VIP_COMPANY_CODE",
  EU_CONSUMER_VIP_ACCESS_CODE = "EU_CONSUMER_VIP_ACCESS_CODE",
  EU_CONSUMER_VIP_LINK = "EU_CONSUMER_VIP_LINK",
  EU_CONSUMER_VIP_LINK_KEY = "EU_CONSUMER_VIP_LINK_KEY",
  SAP_0000010899 = "SAP_0000010899",
  LEGIT_INTEREST = "LEGIT_INTEREST",
  THIRD_PARTY_CONTACT = "THIRD_PARTY_CONTACT",
  EU_CONSUMER_AGE = "EU_CONSUMER_AGE",
  EU_IT_JOBS = "EU_IT_JOBS"
}

export enum PayloadType {
  JSON = "JSON",
  XML = "XML"
}
