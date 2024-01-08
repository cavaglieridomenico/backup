import { RenderContext } from 'vtex.render-runtime'

declare global {
  // eslint-disable-next-line no-redeclare
  const __RUNTIME__: RenderContext

  interface CardFormData {
    encryptedCardNumber: string
    encryptedCardHolder: string
    encryptedExpiryDate: string
    encryptedCsc: string
    lastDigits: string
    paymentSystem: string
    installment?: number
  }

  interface Order {
    allowCancellation: boolean
    orderId: string
    deliveryParcels: Parcel[]
    pickUpParcels: Parcel[]
    takeAwayParcels: Parcel[]
    items: OrderItem[]
    sellers: OrderItemSeller[]
    totals: OrderItemTotal[]
    giftRegistryData?: GiftRegistry | null
    clientProfileData: ClientProfile
    paymentData: PaymentData
    storePreferencesData: StorePreferencesData
    creationDate: string
    value: number
  }

  interface PaymentInput {
    paymentSystem?: string
    paymentSystemName?: string
    group?: string
    tokenId?: string
    installments?: number
    installmentsInterestRate?: number
    referenceValue?: number
    value?: number
  }

  interface PaymentDataInput {
    payments: PaymentInput[]
  }

  type CardType = 'new' | 'saved'

  interface CheckoutStep {
    route: string
    order: number
  }
}
