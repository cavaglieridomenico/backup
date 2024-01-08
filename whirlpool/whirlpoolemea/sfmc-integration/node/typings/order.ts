export interface Order {
  orderId: string
  salesChannel: string
  sequence: string
  orderGroup: string
  value: number
  totals: Total[]
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
  customData: any
  sellers: any[]
}

interface Total {
  id: string
  name: string
  value: number
}

interface Transaction {
  transactionId: string
  payments: Payment[]
}

interface Payment {
  value: number
  tid: string
  paymentSystemName: string
  lastDigits: any
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
  preSaleDate: string | null
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

export interface Address {
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
  corporateName: string
}

export enum TotalIds {
  ITEMS = "items",
  DISCOUNTS = "discounts",
  SHIPPING = "shipping",
  TAX = "tax"
}
