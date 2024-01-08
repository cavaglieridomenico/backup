export type Settings = {
  accessoriesCategoryId: number,
  reviewSource: "none" | "bazaarvoice"
  pageTypes: pageType[]
}

export type pageType = {
  regex: string,
  value: string,
  contentGrouping: string
}
