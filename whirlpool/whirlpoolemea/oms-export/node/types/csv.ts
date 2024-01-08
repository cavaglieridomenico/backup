export interface CsvHeader {
  id: string
  title: string
}

export enum CsvColumnId {
  orderId = "orderId",
  creationDate = "creationDate",
  store = "store",
  accessCode = "accessCode",
  companyName = "companyName",
  paymentMethod = "paymentMethod",
  transactionId = "transactionId",
  itemModel = "itemModel",
  itemQty = "itemQty",
  itemSalePrice = "itemSalePrice",
  itemDiscountedPrice = "itemDiscountedPrice",
  deliveryDate = "deliveryDate"
}

export enum CsvColumnTitle {
  orderId = "Order ID",
  creationDate = "Creation Date",
  store = "Store",
  accessCode = "Customer Ref",
  companyName = "Company Name",
  paymentMethod = "Payment Method",
  transactionId = "Transaction ID",
  itemModel = "Item Model",
  itemQty = "Item Quantity",
  itemSalePrice = "Item Sale Price",
  itemDiscountedPrice = "Item Discounted Price",
  deliveryDate = "Delivery Date"
}

export interface CSVRow {
  orderId: string
  creationDate: string
  store: string
  accessCode: string
  companyName: string
  paymentMethod: string
  transactionId: string
  itemModel: string
  itemQty: number
  itemSalePrice: number
  itemDiscountedPrice: number
  deliveryDate: string
  [key: string]: any
}

export enum BinaryValue {
  YES = "Y",
  NO = "N"
}
