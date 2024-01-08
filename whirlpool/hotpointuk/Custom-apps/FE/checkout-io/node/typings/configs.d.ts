export interface AppSettings {
  auth: Auth
  delivery: Delivery
}

interface Auth {
  appKey: string
  appToken: string
}

interface Delivery {
  paidDeliveryConfig: PaidDeliveryConfig
}

interface PaidDeliveryConfig {
  deliveryType: string
}
