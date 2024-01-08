import React, { createContext, useContext, useMemo } from "react";
import { useRuntime } from "vtex.render-runtime";
import { useProduct } from "vtex.product-context";

interface Context {
  sellingPrice: string;
  listPrice: string;
  showListPrice: boolean;
  showSellingPrice: boolean;
  ecofeeValue: string;
  ecofee: number;
}

const PriceContext = createContext<Context>({} as Context);

export const PriceContextProvider: React.FC = ({ children }) => {
  const { production, binding, culture } = useRuntime();
  const product = useProduct();
  /*--- CONTS ---*/
  const tradePolicy =
    binding?.id == "d2ef55bf-ed56-4961-82bc-6bb753a25e90"
      ? "EPP"
      : binding?.id == "df038a38-b21d-4a04-adbe-592af410dae3"
      ? "FF"
      : binding?.id == "53e2c7bb-0de5-4ffe-9008-0e3f0d31a545"
      ? "VIP"
      : "O2P";

  const isSellable =
    product?.product?.properties?.find(
      (spec: any) => spec.name == `sellable${tradePolicy}`
    )?.values[0] == "true";

  const showPrice =
    product?.product?.properties?.find(
      (spec: any) => spec.name == `showPrice${tradePolicy}`
    )?.values[0] == "true";

  // const hasStock =
  //   product?.product?.items[0]?.sellers[0]?.commertialOffer?.AvailableQuantity >
  //   0;

  const formatPrice = (price: number) =>
    `${price?.toFixed(2).replace(".", ",")} ${
      culture?.customCurrencySymbol || "€"
    }`;

  const ecofee = +product?.product?.properties?.find(
    (prop: any) => prop.name == "ecofee"
  )?.values[0];

  const ecofeeValue = formatPrice(ecofee);

  /*--- SELLING PRICE ---*/
  const sellers = product?.selectedItem?.sellers;
  const SellingPriceWithDiscounts =
    product?.product?.priceRange?.sellingPrice?.highPrice;
  const ListPriceWithDiscounts =
    product?.product?.priceRange?.listPrice?.highPrice;

  const sellingPrice =
    SellingPriceWithDiscounts == 0
      ? formatPrice(sellers?.[sellers?.length - 1]?.commertialOffer?.Price)
      : formatPrice(SellingPriceWithDiscounts);

  const showSellingPrice =
    (isSellable &&
      showPrice &&
      +sellers?.[sellers?.length - 1]?.commertialOffer?.Price > 0) ||
    SellingPriceWithDiscounts > 0;

  /*--- LIST PRICE ---*/
  const listPrice =
    ListPriceWithDiscounts == 0
      ? formatPrice(sellers?.[sellers.length - 1]?.commertialOffer?.ListPrice)
      : formatPrice(ListPriceWithDiscounts);

  const showListPrice = listPrice != sellingPrice && showSellingPrice;

  /*--- LOGS ---*/
  if (!production) {
    console.log(
      "%c TRADE ",
      "background: #3cff00; color: #000000",
      tradePolicy
    );
    console.log("%c PRODUCT ", "background: #0051ff; color: #000000", product);
    console.log(
      "%c SELLING PRICE ",
      "background: #ff5100; color: #000000",
      sellingPrice
    );
    console.log(
      "%c LIST PRICE ",
      "background: #b3ff00; color: #000000",
      listPrice
    );
    console.log(
      "%c SHOW SELLING PRICE? ",
      "background: #ff0015; color: #ffffff",
      showSellingPrice
    );
    console.log(
      "%c SHOW LIST PRICE? ",
      "background: #ae00ff; color: #ffffff",
      showListPrice
    );
    console.log(
      "%c ECOFEE VALUE ",
      "background: #ff008c; color: #000000",
      ecofeeValue
    );
    console.log("%c ECOFEE ", "background: #ff008c; color: #000000", ecofee);
  }

  const context = useMemo(
    () => ({
      product,
      sellingPrice,
      listPrice,
      showListPrice,
      showSellingPrice,
      ecofeeValue,
      ecofee,
    }),
    [product, sellingPrice, listPrice, showListPrice, ecofeeValue, ecofee]
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
