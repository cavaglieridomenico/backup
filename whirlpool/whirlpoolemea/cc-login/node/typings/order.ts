export interface Order {
  orderId: string
  salesChannel: string
  sequence: string
  orderGroup: string
  value: number
  creationDate: string
  items: Item[]
  invoiceData?: {
    address?: Address
  }
  shippingData: {
    address: Address
    logisticsInfo: LogisticsInfo[]
  }
  clientProfileData: ClientProfileData
  paymentData: {
    transactions: Transaction[]
  }
  customData: CustomData
}

interface CustomData {
  customApps: CustomApps[]
}

interface CustomApps {
  id: "profile" | "tradeplace" | "fiscaldata"
  major: number
  fields: ProfileCustomFields | FiscalDataCustomFields | TradePlaceCustomFields
}

export interface ProfileCustomFields {
  email: string
  accessCode: string
  optin: string
}

export interface TradePlaceCustomFields {
  connectedGas: string
  shipTogether: string
  tpError: string
}

export interface FiscalDataCustomFields {
  sendInvoiceTo: string
  invoiceFiscalCode: string
  SDIPEC: string
  invoiceSocialReason: string
  typeOfDocument: string
  requestInvoice: string
  acceptTerms: string
  useShippingAddress: string
}

interface Transaction {
  transactionId: string
  payments: Payment[]
}

interface Payment {
  value: number
  tid: string
}

interface LogisticsInfo {
  itemIndex: number
  selectedSla: string
  deliveryIds: Delivery[]
}

interface Delivery {
  courierId: string // shipping policy id
  courierName: string // shipping policy name
  dockId: string
  quantity: number
  warehouseId: string
}

interface ItemAddInfo {
  brandName: string
}

interface Item {
  uniqueId: string
  id: string
  productId: string
  ean: string
  name: string
  refId: string
  quantity: number
  listPrice: number
  sellingPrice: number
  bundleItems: BundleItem[]
  additionalInfo: ItemAddInfo
}

interface BundleItem {
  uniqueId: string
  id: string
  quantity: number
  sellingPrice: number
  additionalInfo: BundleItemAddInfo
}

interface BundleItemAddInfo {
  offeringType: string
  offeringTypeId: string
}

interface Address {
  receiverName?: string
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  neighborhood: string
  complement: string
}

interface ClientProfileData {
  firstName: string
  lastName: string
  phone: string
  userProfileId: string
}
