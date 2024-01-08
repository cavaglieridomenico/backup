// GraphQL Types

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