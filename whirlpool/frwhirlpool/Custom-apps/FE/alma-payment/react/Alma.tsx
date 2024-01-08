import React, { useEffect } from "react";
import { useProduct } from "vtex.product-context";

const alma = (window as any)?.Alma;

const Alma: StorefrontFunctionComponent<{}> = () => {
  const productContext = useProduct();
  useEffect(() => {
    if(!productContext?.product){
      return
    }
    const price =
      productContext?.product?.priceRange?.sellingPrice?.highPrice * 100;
    if (!alma) return;
    const widgets = alma?.Widgets.initialize(
      "11teKc253alzslgpko6K4OsEouyoC4GyRd", // ID marchand
      alma.ApiMode.LIVE // mode de l'API (LIVE ou TEST)
    );
    widgets?.add(alma.Widgets.PaymentPlans, {
      container: "#payment-plans",
      purchaseAmount: price,
      locale: "fr",
      hideIfNotEligible: false,
      transitionDelay: 5500,
      monochrome: false,
      hideBorder: true,
      plans: [
        {
          installmentsCount: 3,
          minAmount: 10000,
          maxAmount: 300000,
        },
        {
          installmentsCount: 4,
          minAmount: 10000,
          maxAmount: 300000,
        },
      ],
    });
  }, [alma,productContext]);
  return <div id="payment-plans"></div>;
};

export default Alma;
