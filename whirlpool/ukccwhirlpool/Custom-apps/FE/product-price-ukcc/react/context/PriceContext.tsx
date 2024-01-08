import React, { createContext, useContext, useMemo } from "react";
import { useRuntime } from "vtex.render-runtime";
import { useProduct } from "vtex.product-context";

interface PriceContextProviderProps {
  sellerID: string;
}

interface Context {
  sellingPrice: string;
  listPrice: string;
  showListPrice: boolean;
  showSellingPrice: boolean;
  percentageDiscount: number;
}
interface ScMapping {
  [index: string]: string;
}

const PriceContext = createContext<Context>({} as Context);

export const PriceContextProvider: React.FC<PriceContextProviderProps> = ({
  children,
  sellerID,
}) => {
  const { culture } = useRuntime();
  const product = useProduct();

  const scMapping: ScMapping = {
    "1": "EPP",
    "2": "FF",
    "3": "VIP",
    "4": "O2P",
  };

  /*--- CONTS ---*/
  const salesChannel: string = window
    ? JSON.parse(
        Buffer.from(
          (window as any).__RUNTIME__.segmentToken,
          "base64"
        ).toString()
      ).channel
    : "4";

  const tradePolicy = scMapping[salesChannel];

  const isSellable =
    product?.product?.properties?.find(
      (spec: any) => spec.name == `sellable${tradePolicy}`
    )?.values[0] == "true";

  const showPrice =
    product?.product?.properties?.find(
      (spec: any) => spec.name == `showPrice${tradePolicy}`
    )?.values[0] == "true";

  const formatPrice = (price: number) =>
    `${culture?.customCurrencySymbol || "£"}${price
      ?.toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  /*--- SELLING PRICE ---*/
  const seller = product?.selectedItem?.sellers.find(
    (seller: { sellerId: string }) => seller.sellerId == sellerID
  );

  const sellingPriceNumber =
    product?.product?.priceRange?.sellingPrice?.highPrice ||
    seller?.commertialOffer?.Price;

  const listPriceNumber =
    product?.product?.priceRange?.listPrice?.highPrice ||
    seller?.commertialOffer?.ListPrice;

  const sellingPrice = formatPrice(sellingPriceNumber);

  const showSellingPrice = isSellable && showPrice && sellingPriceNumber > 0;

  /*--- LIST PRICE ---*/
  const listPrice = formatPrice(listPriceNumber);

  const showListPrice =
    listPriceNumber != sellingPriceNumber && showSellingPrice;

  /*--- DISCOUNT PERCENTAGE ---*/
  const discountCalc = (fullPrice: number, discountedPrice: number) => {
    return Math.round(((fullPrice - discountedPrice) * 100) / fullPrice);
  };

  const percentageDiscount: number = showListPrice
    ? discountCalc(listPriceNumber, sellingPriceNumber)
    : 0;

  const context = useMemo(
    () => ({
      product,
      sellingPrice,
      listPrice,
      showListPrice,
      showSellingPrice,
      percentageDiscount,
    }),
    [product, sellingPrice, listPrice, showListPrice, percentageDiscount]
  );

  return (
    <PriceContext.Provider value={context}>{children}</PriceContext.Provider>
  );
};

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const usePrice = () => {
  const context = useContext(PriceContext);

  if (context === undefined) {
    throw new Error("useLogin must be used within PriceContextProvider");
  }

  return context;
};

export default { PriceContextProvider, usePrice };
