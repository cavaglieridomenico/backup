import { Address } from "./CreatePayment/createPaymentRequest";

export interface Order {
  invoiceData: {
    address: Address
  },
  paymentData: {
    transactions: Transaction[]
  }
}

export interface Transaction {
  payments: Payment[]
}

export interface Payment {
  connectorResponses: ConnectorResponse
}

export interface ConnectorResponse {
  acquirer: string

}