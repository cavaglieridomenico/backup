export interface AppSettings {
  crmEnvironment: string,
  crmPassword: string,
  gcpAuthType: string,
  gcpHost: string,
  gcpProjectId: string,
  gcpClientEmail: string,
  gcpPrivateKey: string,
  gcpTargetAudience: string,
  gcpBrand: string,
  gcpCountry: string,
  authCookie: string
}

export enum GCPAuthType {
  BEARER = "Bearer",
  BASIC = "Basic"
}
