export interface AnalyticsEcommerceProduct {
  productCategories: Record<string, string> | null
  additionalInfo: CartItemAdditionalInfo | null
  id: string
  name: string
  category: string
  brand: string
  variant: string
  price: number
  quantity: number
  skuName: string
  sellingPrice: number
}
