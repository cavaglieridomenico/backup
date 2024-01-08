export interface Subscription {
  id?: string
  createdIn?: string
  email: string
  emailSent: boolean
  isDropPriceAlert: boolean
  isDropPriceExpire: boolean
  refId: string
  subscriptionPrice: number
}

export interface SubscriptionPayload {
  email: string
  refId: string
}
