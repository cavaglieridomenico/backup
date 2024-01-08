export interface OrderInfo {
  totalAmount: number,
  partitions: Partition[]
}

interface Partition {
  orderId: string,
  value: number
}
