export interface GCPPayload {
  event: string // OLD or NEW
  userId: string
  brand?: string
  country?: string
}

export interface GCPSettings {
  gcpProjectId: string
  gcpTargetAudience: string
  gcpClientEmail: string
  gcpPrivateKey: string
  gcpHost: string
  gcpBrand?: string
  gcpCountry?: string
}

export enum NotificationType {
  OLD = "OLD",
  NEW = "NEW",
  GUEST = "GUEST"
}

export enum EPPEventType {
  DELTA_INSERT = "DELTA_INSERT",
  FULL_INSERT = "FULL_INSERT",
  DELTA_DELETE = "DELTA_DELETE",
  DELTA_UPDATE = "DELTA_UPDATE"
}

export interface EPPExportRecord {
  emailAddress?: string | null
  hrNumber?: string | null // => person id
  payrollId?: string | null // => clock number
  surnameInitials?: string | null
  event?: string
}
