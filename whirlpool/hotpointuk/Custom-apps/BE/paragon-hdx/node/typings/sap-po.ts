export interface SAPPOEnvDetails {
  host: string
  cert: string
  envPath: string
}

export interface SAPPO {
  quality: SAPPOEnvDetails
  production: SAPPOEnvDetails
}

export enum POInterfaces {
  HEALTH_CHECK = "HealthCheck01", // server status
  RETRIEVE_SLOTS = "RetrieveHDSResource01", // slot retrieval
  CONFIRM_RESERVE_SLOT = "CreateHDSVisit01", // slot confirmation / reservation
  CONFIRM_RESERVED_SLOT = "UpdateReleaseForHDSVisit01", // confirmation of a slot previously reserved
  RELEASE_SLOT = "CancelHDSVisit01", // slot cancellation
  GET_CONFIRMED_SLOT = "GetHDSVisit01", // unknown
  UPDATE_CONFIRMED_SLOT = "UpdateHDSVisit01" // unknown
}

// possible configurations:
// 1) RetrieveHDSResource01 --> CreateHDSVisit01 / CancelHDSVisit01 (flow without reservation)
// 2) RetrieveHDSResource01 --> CreateHDSVisit01 -->  UpdateReleaseForHDSVisit01 / CancelHDSVisit01 (flow with reservation)
