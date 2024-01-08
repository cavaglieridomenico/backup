import { Subscription } from "./DropPriceSubscription"

export interface AuthCredentials {
  grant_type: string
  client_id: string
  client_secret: string
}

export enum TradePolicy {
  O2P = "O2P",
  EPP = "EPP",
  FF = "FF",
  VIP = "VIP"
}

export interface UserInfo {
  email: string
  tradePolicy: string
}

export interface OrderItem {
  keys: {
    orderId: string
    orderItemId: string
  }
  values: {
    coupon: string
    commercialCode: string
    code12NC: string
    orderItemQuantity: string
    crossedprice?: string
    price: string
    productUrl: string
    ProductName: string
    imageUrl: string
    brand: string
    isSuccessfullyPurchased: string
    serviceName: string
    serviceQuantity: string
    servicePrice: string
    EnergyLogo_image: string
    "product-information-sheet": string
    LeadTime: string
    estimatedDeliveryDate: string
    IsGas: string | boolean
    FGAS: string | boolean
    warrantyUrl10Y?: string
    warrantyUrlWF?: string
  }
}

export type OrderDetails = OrderItem[];

export interface OrderConfCancTemplate {
  To: {
    Address: string
    SubscriberKey: string
    ContactAttributes: {
      SubscriberAttributes: {
        orderId: string
        orderNumberSAP: string
        purchaseDate: string
        paymentMethod: string
        creditCardNumber: string
        klarnaReferenceCode: string
        fiscalCode: string
        orderProductPrice: string
        orderTotal: string
        ecofee: string
        servicePrice: string
        serviceName?: string
        orderTotalAdjustment: string
        orderShippingPrice: string
        orderSubtotal: string
        serviceQuantity: string
        shippingFirstName: string
        shippingLastName: string
        shippingAddress: string
        shippingZipCode: string
        shippingCity: string
        shippingState: string
        shippingCountry: string
        shippingEmail: string
        shippingPhone: string
        billingFirstName: string
        billingLastName: string
        billingAddress: string
        billingZipCode: string
        billingCity: string
        billingState: string
        billingCountry: string
        billingEmail: string
        billingPhone: string
        billingOfficeAddress: string
        shipInstructions: string
        redeemedPoints: string
        gainedPoints: string
        delivery: string
        estematedDeliveryDate: string
        deliveryDateSP: string
        deliveryType: number | string
        SDA: boolean | string
        shipTogether: boolean | string
        IsGas: boolean | string
      }
    }
  }
}

export interface RefundTemplate {
  To: {
    Address: string
    SubscriberKey: string
    ContactAttributes: {
      SubscriberAttributes: {
        FirstName: string
        Surname: string
        City: string
        Address: string
        ClientEmail: string
        PhoneNumber: string
        PickupAddress: string
        OrderNumber: string
        ProductCode: string
        DeliveredDate: string
        DocumentTransportNumber: string
        ReturnReason: string // since the email templates have been swapped also the related reasons need to be swapped //
        Note: string
        Country: string
        Zip: string
        itemType: string
        WithdrawType: string
      }
    }
  }
}

export interface ReturnTemplate {
  To: {
    Address: string
    SubscriberKey: string
    ContactAttributes: {
      SubscriberAttributes: {
        FirstName: string
        Surname: string
        City: string
        Address: string
        ClientEmail: string
        PhoneNumber: string
        OrderNumber: string
        ProductCode: string
        PickupAddress: string
        DeliveredDate: string
        DocumentTransportNumber: string // since the email templates have been swapped also the related reasons need to be swapped //
        RefundReason: string
        Note: string
        Country: string
        Zip: string
        itemType: string
        WithdrawType: string
      }
    }
  }
}

export interface FFInvitation {
  ContactKey: string
  EventDefinitionKey: string
  Data: {
    SubscriberKey: string
    EmailAddress: string
    ActivationLink?: string
    HomePageLink: string
    ExpirationDate: string
    ActivationDate?: string
  }
}

export interface DGRecord {
  id: string
  orderId: string
  itemId: string
  itemToken: string
  typeOfWarranty?: string
}

export enum CustomApps {
  PROFILE = "profile"
}

export enum ProfileCustomFields {
  email = "email"
}

export interface Pagination {
  page: number
  pageSize: number
}

export enum Apps {
  TRADEPLACE = "tradeplace",
  HDX = "hdx"
}

export enum ModalType {
  WHITE_GOODS = "WHITE_GOODS",
  FURNITURE = "FURNITURE",
  ELECTRONICS = "ELECTRONICS"
}

export enum DeliveryType {
  INSTOCK_FG = 1,
  OUTOFSTOCK_FG = 2,
  MIXED_FG = 3,
  INSTOCK_SPACC = 4,
  OUTOFSTOCK_SPACC = 5,
  MIXED_SPACC = 6,
  ONLY_SPACC = 7
}

export enum AddressPattern {
  ITALIAN = "street, number, additional info",
  FRANCE = "number, street, additional info",
  ENGLISH = "additional info, number, street"
}

export interface Address {
  city: string
  complement: string | null
  country: string
  neighborhood: string | null
  number: string | null
  postalCode: string
  receiverName: string
  reference: string | null
  state: string | null
  street: string
}

export interface Recommendation {
  sku_id: string,
  image_link: string
}

//category advice
export interface CategoryAdvice {
  ContactKey: string,
  EventDefinitionKey: string,
  Data: {
    Email: string,
    Name: string,
    Surname: string,
    Category: string,
    DateAdded: string
  }
}

// products comparison
export interface PdfMapperBody {
  urlImgs: string[]
  energyLogoImgs: string[]
  productsName: string[]
  prices: string[]
  refIds: string[]
  specifications: [SpecificationGroup?]
}

export interface SpecificationGroup {
  specificationGroupName: string
  specificationGroupItems: [SpecificationGroupItem?]
}

export interface SpecificationGroupItem {
  fieldLabel: string
  values: string[]
}


export interface ProductSearchGQL {
  items: Item[];
  linkText: string;
  productName: string;
  properties: Specification[];
  productReference: string;
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

interface Image {
  imageId: string;
  imageLabel: string;
  imageUrl: string;
  imageText: string;
}

interface Seller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  commertialOffer: CommertialOffer;
  commertialOfferA2?: CommertialOffer;
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

export interface MessageResponseBody {
  requestId: string
  responses: MessageResponse[]
}

export interface MessageResponse {
  recipientSendId: string
  hasErrors: boolean,
  messages: string[]
}

export interface ProductDetailsResponse {
  product: ProductSearchGQL;
}

export interface ProductIdentifier {
  field: "sku" | "id" | "slug" | "ean" | "reference",
  value: string
}
export interface SpAccDetails {
  spAccIndex: any[],
  containSpareAcc: boolean,
  estematedDeliveryDate_SpAcc: string
}


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

export interface DropPriceReq {
  product?: Product;
  requestId?: string;
  notificationToSend?: Subscription[];
  skuId?: string;
  expireEmail?: string;
}

export interface BroadcasterNotificationEvent {
  IdSku: string
  An: string
  DataModified: string
  IsActive: boolean
  StockModified: boolean
  PriceModified: boolean
  HasStockKeepingUnitModified: boolean
  HasStockKeepingUnitRemovedFromAffiliate: boolean
}

export interface ProductDetailsResponse {
  product: Product;
}

export interface ProductIdentifier {
  field: "sku" | "id" | "slug" | "ean" | "reference",
  value: string
}
