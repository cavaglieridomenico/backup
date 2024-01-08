export interface ReserveSlot_Request {
  date: string
  slotNumber: number
  start: string
  end: string
  preference: string
  routeCode: string
  version: number
  orderSequence: number
}

export interface SetBookingStatus_Request {
  orderId: string
  status: string
}
