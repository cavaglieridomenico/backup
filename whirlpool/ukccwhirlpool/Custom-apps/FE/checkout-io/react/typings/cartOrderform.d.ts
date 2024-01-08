type CartOrderForm = {
  id: string
  items: CartItem[]
  totalizers: Totalizer[]
  value: number
  loggedIn: boolean
  storePreferencesData: storePreferenceData
  clientProfileData: ClientProfile
}

type CartItem = {
  leadtime: any
  productId: any
  id: string
  name: string
  detailUrl: string
  imageUrls: imageUrl
  skuName: string
  productRefId: string
  quantity: number
  price: number
  listPrice: number
  sellingPrice: number
  offerings: Offering[]
  bundleItems: bundleItem[]
}
type imageUrl = {
  at1x: string
}

type bundleItem = {
  id: string
  name: string
  imageUrls: imageUrl
}

type Offering = {
  id: string
  name: string
  price: number
}

type Totalizer = {
  id: string
  name: string
  value: number
}

type storePreferenceData = {
  currencySymbol: string
}
