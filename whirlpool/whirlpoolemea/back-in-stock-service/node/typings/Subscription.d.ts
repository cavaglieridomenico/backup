export interface Subscription {
  id?: string
  createdIn?: string
  email: string
  emailSent: boolean
  isBackInStock: boolean
  isOutOfStock: boolean
  refId: number
}

export interface SubscriptionPayload {
  email: string
  refId: number
}
