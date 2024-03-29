//@ts-nocheck

export interface AuthCredentials {
  grant_type: string,
  client_id: string,
  client_secret: string
}

export enum TradePolicy {
  O2P = "O2P",
  EPP = "EPP",
  FF = "FF",
  VIP = "VIP"
}

export interface UserInfo {
  email: string,
  tradePolicy: string
}

export interface OrderItem {
  keys: {
    orderId: string,
    orderItemId: string
  },
  values: {
    coupon: string,
    commercialCode: string,
    code12NC: string,
    orderItemQuantity: string,
    crossedprice?: string,
    price: string,
    productUrl: string,
    imageUrl: string,
    brand: string,
    isSuccessfullyPurchased: string,
    serviceName: string,
    serviceQuantity: string,
    servicePrice: string,
    EnergyLogo_image: string,
    "product-information-sheet": string,
    warrantyUrl10Y?: string,
    warrantyUrlWF?: string
  }
}

export type OrderDetails = OrderItem[];

export interface OrderConfCancTemplate {
  To: {
    Address: string,
    SubscriberKey: string,
    ContactAttributes: {
      SubscriberAttributes: {
        orderId: string,
        orderNumberSAP: string,
        purchaseDate: string,
        paymentMethod: string,
        creditCardNumber: string,
        klarnaReferenceCode: string,
        fiscalCode: string,
        orderProductPrice: string,
        orderTotal: string,
        ecofee: string,
        servicePrice: string,
        orderTotalAdjustment: string,
        orderShippingPrice: string,
        orderSubtotal: string,
        serviceQuantity: string,
        shippingFirstName: string,
        shippingLastName: string,
        shippingAddress: string,
        shippingZipCode: string,
        shippingCity: string,
        shippingState: string,
        shippingCountry: string,
        shippingEmail: string,
        shippingPhone: string,
        billingFirstName: string,
        billingLastName: string,
        billingAddress: string,
        billingZipCode: string,
        billingCity: string,
        billingState:  string,
        billingCountry: string,
        billingEmail: string,
        billingPhone: string,
        billingOfficeAddress: string,
        shipInstructions: string,
        redeemedPoints: string,
        gainedPoints: string,
        delivery: string,
        estematedDeliveryDate: string
      }
    }
  }
}

export interface RefundTemplate {
  To: {
    Address: string,
    SubscriberKey: string,
    ContactAttributes: {
      SubscriberAttributes: {
        FirstName: string,
        Surname: string,
        City: string,
        Address: string,
        ClientEmail: string,
        PhoneNumber: string,
        PickupAddress: string,
        OrderNumber: string,
        ProductCode: string,
        //DeliveredDate: string,
        DocumentTransportNumber: string,
        ReturnReason:  string, // since the email templates have been swapped, also the related reasons need to be swapped //
        Note:  string,
        Country:  string,
        Zip:  string,
        itemType:  string,
        WithdrawType: string
      }
    }
  }
}

export interface ReturnTemplate {
  To: {
    Address: string,
    SubscriberKey: string,
    ContactAttributes: {
      SubscriberAttributes: {
        FirstName:  string,
        Surname:  string,
        City: string,
        Address: string,
        ClientEmail: string,
        PhoneNumber: string,
        OrderNumber: string,
        ProductCode: string,
        PickupAddress: string,
        //DeliveredDate: string,
        DocumentTransportNumber: string, // since the email templates have been swapped, also the related reasons need to be swapped //
        RefundReason: string,
        Note: string,
        Country: string,
        Zip: string,
        itemType: string,
        WithdrawType: string
      }
    }
  }
}

export interface FFInvitation {
  ContactKey: string,
  EventDefinitionKey: string,
  Data: {
    SubscriberKey: string,
    EmailAddress: string,
    ActivationLink?: string,
    HomePageLink: string,
    ExpirationDate: string
    ActivationDate?: string
  }
}

export interface DGRecord {
  id: string,
  orderId: string,
  itemId: string,
  itemToken: string,
  typeOfWarranty?: string
}

export enum CustomApps {
  PROFILE = "profile"
}

export enum ProfileCustomFields {
  email = "email"
}

export interface Pagination {
  page: number,
  pageSize: number
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

//SFMC types

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

export interface BroadcasterNotificationEvent {
  IdSku: string
  An: string
  DataModified: string
  IsActive: boolean
  StockModified: boolean
  PriceModified: boolean
  HasStockKeepingUnitModified : boolean
  HasStockKeepingUnitRemovedFromAffiliate: boolean
}



