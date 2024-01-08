interface ItemAddInfo {
  brandName: string
  brandId: string
}

interface BundleItemAddInfo {
  offeringType: string
  offeringTypeId: string
}

interface BundleItem {
  uniqueId: string
  id: string
  name: string
  price: number
  listPrice: number
  sellingPrice: number
  additionalInfo: BundleItemAddInfo
  quantity: number
}

export interface Item {
  uniqueId: string
  id: string // sku id
  productId: string
  productRefId: string
  refId: string // sku ref id
  ean: string
  name: string
  modalType: string
  price: number
  listPrice: number
  sellingPrice: number
  additionalInfo: ItemAddInfo
  productCategoryIds: string
  productCategories: any // categoryId --> categoryName
  quantity: number
  seller: string
  imageUrl: string
  detailUrl: string
  bundleItems: BundleItem[]
  availability: string
  ignore?: boolean
}

interface Address {
  addressType: string
  receiverName: string
  addressId: string
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

interface DeliveryID {
  courierId: string
  warehouseId: string
  dockId: string
  courierName: string
  quantity: number
}

interface DeliveryWindow {
  startDateUtc: string
  endDateUtc: string
  price: number
  lisPrice: number
}

interface SLA {
  id: string
  name: string
  deliveryIds: DeliveryID[]
  shippingEstimate: string // e.g. 0d
  shippingEstimateDate: string
  availableDeliveryWindows: DeliveryWindow[]
  deliveryWindow: DeliveryWindow // selected delivery window
  price: number
  listPrice: number
}

interface LogisticsInfo {
  itemIndex: number
  selectedSla: string // Shipping Policy Name, e.g. "Scheduled",
  slas: SLA[]
  itemId: string
}

interface ShippingData {
  address: Address
  logisticsInfo: LogisticsInfo[]
}

interface ClientProfileData {
  email: string
  firstName: string
  lastName: string
  phone: string // e.g. +44122334456
}

export interface ClientProfileDataCustom extends ClientProfileData {
  canBuyMDAs: boolean
  underMDAQtyThreshold: boolean
  canPlaceOrders: boolean
}

interface StorePreferencesData {
  countryCode: string //e.g. GBR
  currencyCode: string // e.g. GBP
  currencySymbol: string // e.g. £
}

interface CustomApp {
  fields: any
  id: string
  major: number
}

interface Totalizer {
  id: string // e.g. Items or Shipping
  name: string
  value: number // e.g. 100000
}

export interface OrderForm {
  orderFormId: string
  salesChannel: string
  userProfileId?: string
  value: number
  items: Item[]
  totalizers: Totalizer[]
  shippingData: ShippingData
  clientProfileData: ClientProfileData | ClientProfileDataCustom
  clientPreferencesData: {
    locale: string // e.g. en-GB
    optinNewsLetter: boolean
  }
  storePreferencesData: StorePreferencesData
  openTextField?: {
    value: string // order notes
  }
  customData: {
    customApps: CustomApp[]
  }
}
