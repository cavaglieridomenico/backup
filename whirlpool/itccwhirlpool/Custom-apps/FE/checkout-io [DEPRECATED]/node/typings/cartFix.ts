export interface simulationBody {
  items: itemObject[],
  country: string,
  postalCode: string,
  geoCoordinates: [number, number]
}

export interface itemObject {
  id: string,
  quantity: number,
  seller: string
}

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

export interface IndexArray {
  id: string,
  index: number,
  skuName: string
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
