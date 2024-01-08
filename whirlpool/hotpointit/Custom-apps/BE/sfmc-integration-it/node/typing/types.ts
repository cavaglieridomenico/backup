export interface ASrecord{
    id?: string
    createdAt?: string,
    email?: string,
    name?: string,
    notificationSend: string,
    productImageUrl: string,
    productUrl: string,
    sendAt: string,
    skuId?: string,
    skuRefId: string
  }

//Settings type
export interface AppSettings {
    granttype: string
    clientid: string
    clientsecret: string
    keyBackInStock: string
    keyOutOfStock: string
    endpointAUTH: string
    endpointHUB: string
    endpointMESSAGE: string
    APIevent: string
    sellerAccount: SellerAccount
}

export interface SellerAccount {
    name: string
}


//SFMC types
export interface TokenCredentials {
  grant_type: string
  client_id: string
  client_secret: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  soap_instance_url: string
  rest_instance_url: string
}

export interface MessageResponseBody {
  requestId: string
  responses: MessageResponse[]
}

export interface MessageResponse {
  recipientSendId: string
  hasErrors: boolean,
  messages: string[]
}


// GraphQL Types

interface Image {
  imageId: string;
  imageLabel: string;
  imageUrl: string;
  imageText: string;
}


interface CommertialOffer {
  Price: number;
  ListPrice: number;
  spotPrice: number;
  PriceWithoutDiscount: number;
  RewardValue: number;
  PriceValidUntil: Date;
  AvailableQuantity: number;
  Tax: number;
  taxPercentage: number;
  discountHighlights: any[];
  giftSkuIds: any[];
  gifts: any[];
}

interface Seller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  commertialOffer: CommertialOffer;
  commertialOfferA2?: CommertialOffer;
}

interface Item {
  images: Image[];
  sellers: Seller[];
}

interface Specification {
  name: string;
  originalName: string;
  values: string[];
}


export interface Product {
  items: Item[];
  linkText: string;
  productName: string;
  properties: Specification[];
  productReference: string;
}

export interface ProductDetailsResponse {
  product: Product;
}

export interface ProductIdentifier {
  field: "sku" | "id" | "slug" | "ean" | "reference",
  value: string
}

//Events types
export interface OrderStatusEvent {
  domain: string
  orderId: string
  host: string
}

export interface BackInStockEvent {
  refId: string
  isOutOfStock: boolean
  emails: string[]
}


