export interface Subscription {
  id?: string
  createdIn?: string
  email: string
  emailSent: boolean
  isBackInStock: boolean
  isOutOfStock: boolean
  refId: string
  language: string
  productName: string
  userName: string
  linkText: string
}

export interface SubscriptionPayload {
  email: string
  refId: string
  language: string
  userName: string
  linkText: string
  productName: string
}
