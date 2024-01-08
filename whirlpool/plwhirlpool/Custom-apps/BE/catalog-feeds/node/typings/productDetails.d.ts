interface CategoryTree {
  href: string;
  slug: string;
  id: number;
  name: string;
  titleTag: string;
  hasChildren: boolean;
  metaTagDescription: string;
}

interface ClusterHighlight {
  id: string;
  name: string;
}

interface ProductCluster {
  id: string;
  name: string;
}

interface ReferenceId {
  Key: string;
  Value: string;
}

interface Image {
  imageId: string;
  imageLabel: string;
  imageUrl: string;
  imageText: string;
}

interface Video {
  videoUrl: string;
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
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: ReferenceId[];
  kitItems: any[];
  images: Image[];
  videos: Video[];
  sellers: Seller[];
}

interface Specification {
  name: string;
  originalName: string;
  values: string[];
}

interface SpecificationGroup {
  name: string;
  originalName: string;
  specifications: Specification[];
}

export interface Product {
  brand: string;
  brandId: number;
  categoryId: string;
  categoryTree: CategoryTree[];
  clusterHighlights: ClusterHighlight[];
  productClusters: ProductCluster[];
  description: string;
  items: Item[];
  skuSpecifications?: any;
  linkText: string;
  productId: string;
  productName: string;
  specificationGroups: SpecificationGroup[];
  properties: Specification[];
  productReference: string;
  titleTag: string;
  metaTagDescription: string;
  benefits: any[];
  releaseDate: Date;
  cacheTimeStamp?: number;
}
export interface ProductDetailsResponse {
  product: Product;
}

export interface ProductIdentifier {
  field: "sku" | "id" | "slug" | "ean" | "reference",
  value: string
}

export interface CachedProducts {
  products: Product[],
  timestamp: number
}


// export interface CeneoXMLFeed {
//   o: {
//     $: {
//       skuId: string,
//       url?: string,
//       price: string | number,
//       availability?: string | number,
//       weight?: string,
//       stock: number | string,
//       basket?: number | string
//     }
//   },
//   cat: [
//     _?: string
//   ],
//   name:{
//     _?:string,
//   },
//   imgs:{
//     main:{
//       $:{
//         url:string
//       }
//     }
//   }

// }
export interface CeneoXMLFeed {
  name?: string, //ob -
  skuId?: string, //Ob -
  url?: string, //pdp link obb -
  price?: string | number, //obb -
  availability?: string | number, //obbs -
  cat?: string, //obb -
  img?: string, //obb -
  desc?: string // obb -
  attr: {
    EAN?: string | number,
    seller?: string
  },
  addittionalImages?: any[]
}
