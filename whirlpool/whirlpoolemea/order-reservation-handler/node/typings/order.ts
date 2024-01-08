export interface ListOrder {
  list: Order[],
  facets: any[],
  paging: {
    total: number,
    pages: number,
    currentPage: number,
    perPage: number
  },
  stats: {
    stats: {}
  },
  reportRecordsLimit: number
}


export interface Order {
  orderId: string,
  creationDate: string,
  clientName: string,
  items: any,
  totalValue: number,
  paymentNames: string,
  status: string,
  statusDescription: string,
  marketPlaceOrderId: string,
  sequence: number,
  salesChannel: number,
  affiliateId: string,
  origin: string,
  workflowInErrorState: boolean,
  workflowInRetry: boolean,
  lastMessageUnread: string,
  ShippingEstimatedDate: string,
  ShippingEstimatedDateMax: string,
  ShippingEstimatedDateMin: string,
  orderIsComplete: boolean,
  listId: string,
  listType: string,
  authorizedDate: string,
  callCenterOperatorName: string,
  totalItems: number,
  currencyCode: string,
  hostname: string,
  invoiceOutput: string,
  invoiceInput: string,
  lastChange: string,
  isAllDelivered: boolean,
  isAnyDelivered: boolean,
  giftCardProviders: string,
  orderFormId: string,
  paymentApprovedDate: string,
  readyForHandlingDate: string,
  deliveryDates: string
}
