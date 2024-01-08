export interface PaymentMD {
  id: string,
  callbackUrl?: string,
  paymentUrl: string,
  value: number,
  transactionid: string,
  status: string,
  paymentMethod: string,
  orderid: string,
  authorizationId: string,
  lastModified: number,
  debitCreditIndicator: string
}
