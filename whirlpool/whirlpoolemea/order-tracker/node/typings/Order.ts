interface Order {
  orderId: string;
  creationDate: string;
  clientName: string;
  items: null;
  totalValue: number;
  paymentNames: string;
  status: string;
  statusDescription: string;
  marketPlaceOrderId: null;
  sequence: string;
  salesChannel: string;
  affiliateId: string;
  origin: string;
  workflowInErrorState: boolean;
  workflowInRetry: boolean;
  lastMessageUnread: string;
  ShippingEstimatedDate: string;
  ShippingEstimatedDateMax: string;
  ShippingEstimatedDateMin: string;
  orderIsComplete: boolean;
  listId: null;
  listType: null;
  authorizedDate: string;
  callCenterOperatorName: null;
  totalItems: number;
  currencyCode: string;
  hostname: string;
  invoiceOutput: null;
  invoiceInput: null;
  lastChange: string;
  isAllDelivered: boolean;
  isAnyDelivered: boolean;
  giftCardProviders: null;
  orderFormId: string;
  paymentApprovedDate: string;
  readyForHandlingDate: null;
  deliveryDates: null;
}

interface Paging {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

interface Stats {
  totalValue: Stat;
  totalItems: Stat;
}

interface Stat {
  Count: number;
  Max: number;
  Mean: number;
  Min: number;
  Missing: number;
  StdDev: number;
  Sum: number;
  SumOfSquares: number;
  Facets: Record<string, any>;
}

interface OrderListPayload {
  list: Order[];
  facets: any[];
  paging: Paging;
  stats: {
    stats: Stats;
  };
  reportRecordsLimit: number;
}
