import { Order } from "./order";

export interface OrderInfo {
  totalAmount: number,
  partitions: Order[]
}
