export interface CreatePaymentRequest {
    orderId: string
    paymentId: string,
    transactionId: string,
    paymentMethod: string,
    value: number,
    miniCart: Minicart,
    sandBoxMode: boolean,
    callbackUrl: string,
    returnUrl: string,
    currency: string,
    card: {
        number: string
    }
    merchantSettings: (merchantSettings)[]
}

export interface merchantSettings {
    name: string,
    value: string
}

export interface Minicart {
    shippingValue: number,
    taxValue: number,
    buyer: Buyer,
    shippingAddress: Address,
    billingAddress: Address,
    items: vtexItem[]
}

export interface Buyer {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string
}

export interface vtexItem {
    name: string,
    price: number,
    quantity: number,
    discount: number
}

export interface Address {
    country: string,
    street: string,
    number: string,
    complement: string,
    neighborhood: string,
    postalCode: string,
    city: string,
    state: string
}