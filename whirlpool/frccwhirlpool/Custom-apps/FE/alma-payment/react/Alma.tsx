import React, { useEffect } from "react";
import { useProduct } from "vtex.product-context";
import { useQuery } from "react-apollo";
import getAppSettings from "./graphql/settings.graphql";
import { appInfos } from "./utils/appInfos";

type MerchantIds = {
  [key: string]: string;
};
const alma = (window as any)?.Alma;

const Alma: StorefrontFunctionComponent<{}> = () => {
  const productContext = useProduct();
  const { data } = useQuery(getAppSettings, {
    ssr: false,
    variables: {
      app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version,
    },
  });

  function getClosedCommunity() {
    const urlParams = new URLSearchParams(window.location.search).get(
      "__bindingAddress"
    );
    let cc = "";
    /*
    FOR TEST ENVIRONMENT BOTH QA AND PROD  WE HAVE THE BINDING ADDRESS AS POINT
    OF REFERENCE SO WE TRY TO TAKE THE FIRST PART OF THE BINDING AND EXTRAPOLATE THE CC
    */
    if (urlParams) {
      const endString = urlParams.toString().indexOf(".");
      cc = urlParams.toString().substring(0, endString);
      if (cc.includes("test")) {
        cc = cc.replace("test", "");
        cc = cc.replace("123", "");
      }
    } else {
      /*
      FOR LIVE ENVIRONMENT THERE IS NO BINDING ADDRESS BUT THE CC CAN BE FOUND
      AT THE BEGINNING OF THE URL SO WE TRY TO TAKE IT FROM THERE
      */
      const url = window.location.href;
      const endString = url.indexOf(".");
      cc = url.substring(0, endString);
      cc = cc.replace("https://", "");
    }
    return cc;
  }

  function getMerchantId(settings: MerchantIds, closedCommunity: string) {
    let merchantId = "";
    for (const key in settings) {
      if (key.toLowerCase().includes(closedCommunity)) {
        merchantId = settings[key];
      }
    }
    return merchantId;
  }

  useEffect(() => {
    if(!productContext?.product){
      return
    }
    let merchantId = "";
    if (data) {
      const settings = data && JSON.parse(data?.appSettings?.message);
      const closedCommunity = getClosedCommunity();
      merchantId = getMerchantId(settings, closedCommunity);
    }
    const price =
      productContext?.product?.priceRange?.sellingPrice?.highPrice * 100;
    if (!alma) return;
    const widgets = alma?.Widgets.initialize(
      merchantId,
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
  }, [alma, data,productContext]);
  return <div id="payment-plans"></div>;
};

export default Alma;
