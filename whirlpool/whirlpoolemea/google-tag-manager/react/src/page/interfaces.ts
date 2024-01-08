export interface WindowRuntime extends Window {
  __RUNTIME__: any
}

export interface PageViewQuery {
  isAuthenticated: boolean
  isNewsletterOptIn: boolean
  pageType: string
  userType: string
  productCode: string
  productName: string
  category: string
  contentGrouping: string
  contentGroupingSecond: string
}
