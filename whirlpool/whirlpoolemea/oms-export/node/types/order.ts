export interface OrderList {
  list: OrderListElement[]
  paging: Paging
}

export interface Paging {
  total: number
  pages: number
  currentPage: number
  perPage: number
}

export interface OrderListElement {
  orderId: string
  creationDate: string
  clientName: string
  totalValue: number
  paymentNames: string
  status: string
  sequence: string
  salesChannel: string
  totalItems: number
  currencyCode: string
}

export interface Order {
  orderId: string
  orderFormId: string
  salesChannel: string
  openTextField: any
  value: number
  creationDate: string
  items: Item[]
  invoiceData?: {
    address?: Address
  }
  shippingData: {
    address: Address
    logisticsInfo: LogisticInfo[]
  }
  clientProfileData: ClientProfileData
  customData: {
    customApps: CustomApp[]
  }
  storePreferencesData: any
  paymentData: {
    transactions: Transaction[]
  }
}

export interface DeliveryWindow {
  startDateUtc: string
  endDateUtc: string
  price: number
}

interface SLA {
  id: string
  name: string
  deliveryWindow: DeliveryWindow
  price: number

}

interface DeliveryIds {
  courierId: string
  courierName: string
  dockId: string
  warehouseId: string
}

interface LogisticInfo {
  itemIndex: number
  selectedSla: string
  price: number
  listPrice: number
  sellingPrice: number
  deliveryWindow?: DeliveryWindow
  shippingEstimateDate: string
  slas: SLA[]
  deliveryIds: DeliveryIds[]
}

interface CustomApp {
  id: string
  major: number
  fields: any
}

interface ItemAddInfo {
  brandName: string
}

export interface Item {
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
  ignore: boolean
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
  reference: string
}

interface ClientProfileData {
  email: string
  firstName: string
  lastName: string
  phone: string
  userProfileId: string
}


export enum CustomAppIds {
  PROFILE = "profile"
}

export enum ProfileCustomFields {
  accessCode = "accessCode",
  optin = "optin",
  email = "email"
}

interface Transaction {
  transactionId: string
  payments: Payment[]
}

interface Payment {
  id: string
  paymentSystem: string
  paymentSystemName: string
  value: number
  tid: string
  connectorResponses: {
    tid: string
  }
}
