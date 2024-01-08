export interface UpdateCartPayload {
  orderItems: UpdateCart[]
}

export interface UpdateCart {
  quantity: number,
  index: number
}

export interface CartItems {
  cartItemNumber: number,
  itemsRemoved: number
}

export interface MessageSimulation {
  arrayMessages: Message[]
}

export interface Message {
  code: string,
  text: string,
  status: string,
  fields: {
    skuName: string
  }
}
