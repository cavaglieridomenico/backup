import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import style from "./style.css";
import { getRetailers } from "./utils/wtbIntegration";
// import {
//   sendIntentionToBuyEvent,
//   sendIntentionToBuyEventOnBuyNow,
// } from "./utils/wtbAnalytics";
import xss from "xss";
import { usePixel } from "vtex.pixel-manager";

interface WhereToBuyProps {
  storeLocatorLink: string;
}

const WhereToBuy: StorefrontFunctionComponent<WhereToBuyProps> = ({
  storeLocatorLink,
}) => {
  const productContext = useProduct();
  const { name } = productContext.selectedItem;
  const [retailers, setRetailers] = useState([]);
  const { push } = usePixel();

  useEffect(() => {
    //GA4FUNREQ36
    push({
      event: "store_locator_from_product",
      slug: productContext?.product?.linkText,
    });
    /*------------------*/
    //GA4FUNREQ38
    push({ event: "intentionToBuy", slug: productContext?.product?.linkText });
    /*------------------*/
    getRetailers(name)
      .then((response) => response.json())
      .then((data) => setRetailers(data.d));
  }, []);

  return (
    <>
      <div className={style.wtbTitleContainer}>
        <div className={style.wtbTitleUnderline}>HÄN</div>
        <div className={style.wtbTitle}>DLER FINDER</div>
      </div>
      <div className={style.retailerWrapper}>
        {retailers.map((element: any) => (
          <div
            className={style.retailerItemContainer}
            key={element.MerchantName}
          >
            <img
              className={style.wtbImage}
              src={xss(element.MerchantLogoUrl)}
            />
            <button
              onClick={() => {
                push({
                  event: "ga4_retailer_click",
                  name: element.MerchantName,
                });
                window.open(element.NavigateUrl, "_blank");
              }}
              className={[style.buyNowButton, style.fromLeft].join(" ")}
            >
              <span className={style.buyNowContent}>Zum Shop</span>
            </button>
          </div>
        ))}
        <div className={style.storeLocatorLinkContainer}>
          <a
            className={style.storeLocatorLink}
            href={storeLocatorLink}
            target="_blank"
          >
            Kaufen Sie online bei den aufgeführten Händlern oder klicken Sie
            hier, um einen Fächhandler In Ihrer Nähe zu finden.
          </a>
        </div>
      </div>
    </>
  );
};

WhereToBuy.schema = {
  title: "Where To Buy Label",
  description: "editor.wheretobuy.description",
  type: "object",
  properties: {
    storeLocatorLink: {
      title: "Store Locator link",
      description: "This is the Store Locator link",
      type: "string",
      default: "/store-locator",
    },
  },
};

export default WhereToBuy;
