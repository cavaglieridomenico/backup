export type PageViewData = {
  pageType: string,
  contentGrouping?: string,
  contentGroupingSecond?: ContentGroupingSecond,
  userType: UserType,
  isNewsletterOptIn: boolean,
  productName?: string,
  productCode?: string,
  category?: string,
  isAuthenticated: boolean
}

export type UserType = 'guest' | 'prospect' | 'cold-customer' | 'hot-customer'
export type ContentGroupingSecond = 'Laundry' | 'Cooling' | 'Cooking' | 'Dishwashing' | 'Air Conditioning' | "Spare Parts" | "Bundle" | "Accessories" | "Other Products"
