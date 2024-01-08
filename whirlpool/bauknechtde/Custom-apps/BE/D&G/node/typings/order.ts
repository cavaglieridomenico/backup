export interface Order {
  orderId: string,
  value: number,
  creationDate: string,
  items: Item[],
  invoiceData?: {
      address?: Address
  },
  shippingData: {
      address: Address
  },
  clientProfileData: ClientProfileData,
  customData: {
    customApps: CustomApp[]
  }
}

interface CustomApp {
  id: string,
  major: number,
  fields: Object
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
