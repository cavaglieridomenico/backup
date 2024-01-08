// function getFirstAvailableSeller(sellers: any) {
//   if (!sellers || sellers.length === 0) {
//     return;
//   }
//   const availableSeller = sellers.find(
//     (seller: any) => seller.commertialOffer.AvailableQuantity !== 0
//   );
//   return availableSeller;
// }

// function createSeller(
//   sku:any,
//   price:any,
//   listPrice:any,
//   cacheVersionUsedToCallCheckout:any,
//   installmentsValue:any,
//   installmentsInsterestRate:any,
//   installments:any,
//   availablequantity:any,
//   ){
//   return({
//     "sellerId": "1",
//     "sellerName": "Whirlpool Italia",
//     "addToCartLink": cacheVersionUsedToCallCheckout !== null ? "https://portal.vtexcommercestable.com.br/checkout/cart/add?sku="+sku+"&qty=1&seller=1&sc=1&price="+price+"&cv="+cacheVersionUsedToCallCheckout+"_&sc=1" : "",
//     "sellerDefault": true,
//     "commertialOffer": {
//         "Installments": [
//             {
//                 "Value": installmentsValue,
//                 "InterestRate": installmentsInsterestRate,
//                 "TotalValuePlusInterestRate": installmentsValue+installmentsInsterestRate,
//                 "NumberOfInstallments": installments,
//                 "__typename": "Installment"
//             }
//         ],
//         "AvailableQuantity": availablequantity,
//         "CacheVersionUsedToCallCheckout": cacheVersionUsedToCallCheckout,
//         "ListPrice": listPrice !== 0? listPrice/100:listPrice,
//         "Price": price !== 0?price/100:price,
//         "PriceValidUntil": "",
//         "PriceWithoutDiscount": price !== 0?price/100:price,
//         "spotPrice": price !== 0?price/100:price,
//         "Tax": 0,
//         "taxPercentage": 0,
//         "__typename": "Offer"
//     },
//     "__typename": "Seller"
//   })
// }

const defaultSeller = { commertialOffer: { Price: 0, ListPrice: 0 } };
//const defaultReference = { Value: "" };
const defaultImage = { imageUrl: "", imageLabel: "" };

const httpRegex = new RegExp(/http:\/\//);

function toHttps(url: string) {
  return url.replace(httpRegex, "https://");
}

export const DEFAULT_WIDTH = "auto";
export const DEFAULT_HEIGHT = "auto";
export const MAX_WIDTH = 3000;
export const MAX_HEIGHT = 4000;

const baseUrlRegex = new RegExp(/.+ids\/(\d+)/);

function cleanImageUrl(imageUrl: string) {
  const result = baseUrlRegex.exec(imageUrl);

  if (!result || result.length === 0) return;

  return result[0];
}

function replaceLegacyFileManagerUrl(
  imageUrl: string,
  width: string | number,
  height: string | number
) {
  const legacyUrlPattern = "/arquivos/ids/";
  const isLegacyUrl = imageUrl.includes(legacyUrlPattern);

  if (!isLegacyUrl) return imageUrl;

  return `${cleanImageUrl(imageUrl)}-${width}-${height}`;
}

export function changeImageUrlSize(
  imageUrl: string,
  width: string | number = DEFAULT_WIDTH,
  height: string | number = DEFAULT_HEIGHT
) {
  if (!imageUrl) return;
  typeof width === "number" && (width = Math.min(width, MAX_WIDTH));
  typeof height === "number" && (height = Math.min(height, MAX_HEIGHT));

  const normalizedImageUrl = replaceLegacyFileManagerUrl(
    imageUrl,
    width,
    height
  );

  const queryStringSeparator = normalizedImageUrl.includes("?") ? "&" : "?";

  return `${normalizedImageUrl}${queryStringSeparator}width=${width}&height=${height}&aspect=true`;
}

const resizeImage = (url: string, imageSize: string | number) =>
  changeImageUrlSize(toHttps(url), imageSize);
export function mapCatalogProductToProductSummary(
  product: any,
  imageSize: string | number = 500,
) {
  if (!product) return null;
  const normalizedProduct = { ...product };
  const items = normalizedProduct.items || [];
  const sku = items[0];
  
  if (sku) {
    const seller =
      sku !== undefined && sku.sellers.length > 0?
      sku.sellers[0] :
      defaultSeller

    const referenceId = sku?.name+"-WER" ?? [];
    const catalogImages = sku?.images == undefined? [] :sku.images;
    const normalizedImages = catalogImages.map(
      (image: { imageUrl: string }) => ({
        ...image,
        imageUrl: resizeImage(image.imageUrl, imageSize),
      })
    );

    const [image = defaultImage] = normalizedImages;

    normalizedProduct.sku = {
      ...sku,
      seller,
      sellers:[seller],
      itemId:normalizedProduct.itemId,
      referenceId,
      image,
      images: normalizedImages,
      name: sku?.itemId,
      skuId: normalizedProduct.itemId
    };
    //normalizedProduct.productName = normalizedProduct.name,
    //normalizedProduct.linkText = normalizedProduct.cacheId
    //normalizedProduct.items = [normalizedProduct.sku]
  }

  return normalizedProduct;
}
