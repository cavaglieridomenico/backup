export interface WPCreatePaymentRequest {
  paymentService: {
    $: {
      version: string,
      merchantCode: string
    },
    submit: Order
  }
}

export interface Order {
  order:
  {
    $: {
      orderCode: string,
      installationId: string,
      captureDelay: string
    },
    description?: string,
    amount:
    {
      $: {
        currencyCode: string,
        exponent: string,
        value: string
      }
    },
    orderContent?: string,
    paymentMethodMask: (Include | Exclude)[],
    shopper:
    {
      shopperEmailAddress: string
    }
    shippingAddress?: Address,
    billingAddress?: Address,
    createToken?: {
      $: {
        tokenScope: string
      },
      tokenEventReference: string,
      tokenReason: string
    }
  }
}

export interface Include {
  include:
  {
    $: {
      code: string
    }
  }
}

export interface Exclude {
  exclude:
  {
    $: {
      code: string
    }
  }
}

export interface Address {
  address:
  {
    address1: string,
    address2: string,
    address3?: string,
    postalCode: string,
    city: string,
    state?: string,
    countryCode: string
  }
}
