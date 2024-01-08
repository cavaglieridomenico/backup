export interface AppSettings {
  vtexSettings: VtexSettings
  feedsSettings: FeedSettings[]
}

export interface VtexSettings {
  categoryIds: string
}

export interface FeedSettings {
  feedName: string
  salesPolicy: string
  removeOutOfStock: boolean
  xmlFeedTitle: string
  xmlFeedLink: string
  xmlFeedDescription: string
  deliveryServiceName: string
}