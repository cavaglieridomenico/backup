export interface Order {
  orderId: string,
  value: number,
  creationDate: string,
  items: Item[],
  invoiceData?: {
      address?: Address
  },
  shippingData: {
      address: Address,
      logisticsInfo: LogisticsInfo[]
  },
  clientProfileData: ClientProfileData
}

export interface LogisticsInfo {
  itemIndex: number,
  selectedSla: string,
  deliveryIds: Delivery[]
}

interface Delivery {
  courierId: string, // shipping policy id
  courierName: string, // shipping policy name
  dockId: string,
  quantity: number,
  warehouseId: string
}

interface ItemAddInfo {
  brandName: string
}

interface Item {
  uniqueId: string,
  id: string,
  productId: string,
  ean: string,
  name: string,
  refId: string,
  quantity: number,
  listPrice: number,
  sellingPrice: number,
  bundleItems: BundleItem[],
  additionalInfo: ItemAddInfo
}

interface BundleItem {
  uniqueId: string,
  id: string,
  quantity: number,
  sellingPrice: number,
  additionalInfo: BundleItemAddInfo
}

interface BundleItemAddInfo{
  offeringType: string,
  offeringTypeId: string
}

interface Address {
  receiverName?: string,
  postalCode: string,
  city: string,
  state: string,
  country: string,
  street: string,
  number: string,
  neighborhood: string,
  complement: string
}

interface ClientProfileData {
  firstName: string,
  lastName: string,
  phone: string,
  userProfileId: string
}
