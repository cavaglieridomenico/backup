export interface Settings {
  tradePolicyToStore: MapElement[]
  vipEntity: string
  addServices: AdditionalService[]
}

export interface MapElement {
  tp: string
  storeRef: string
}

export interface AdditionalService {
  ids: string,
  name: string
}
