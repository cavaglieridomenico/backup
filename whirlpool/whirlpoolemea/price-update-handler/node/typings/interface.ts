export interface GCPPayload {
  skuid: string,
  price: number,
  country: string,
  cluster: string
}

export interface GcpClient {
  gcpHost: string,
  gcpPrivateKey: string,
  target: string
}

export interface AppSettings {
  gcpProjectId: string,
  gcpClientEmail: string,
  gcpPrivateKey: string,
  gcpHost: string,
  target: string,
  country: string,
  clusterMapping: ClusterMapping[]
}

interface ClusterMapping {
  salesChannel: string,
  cluster: string
}


export interface PriceCallInterface {
  tradePolicyId: string
  value: number,
  listPrice: null,
  minQuantity: number
}

