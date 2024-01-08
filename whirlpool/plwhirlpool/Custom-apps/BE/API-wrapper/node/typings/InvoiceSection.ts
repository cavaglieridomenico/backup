export interface Invoice {
  id: string,
  path: string,
  name: string
}

export interface Order {
  id: string,
  path: string,
  creationDate: string,
  total: string,
  invoices: Invoice[]
}

export interface InvoiceSection {
  orders: Order[],
  totalOrders: number,
  currentPage: number,
  ordersPerPage: number,
  totalPages: number
}
