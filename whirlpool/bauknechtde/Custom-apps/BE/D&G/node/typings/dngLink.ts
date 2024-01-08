export interface DnGLink {
  id: string,
  productId: string,
  uniqueId: string,
  dngLinkStandardWarr: string,
  dngLinkExtendedWarr: string
}

export interface DnGLinks {
  orderId: string,
  items: DnGLink[]
}
