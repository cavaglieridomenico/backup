import React from "react";
import { useCssHandles } from "vtex.css-handles";
import { useProduct } from "vtex.product-context";
import { useEffect } from "react";
import { usePixel } from "vtex.pixel-manager";

export default function ButtonBuyNow() {
  const CSS_HANDLES = ["BuyNow__wrapper", "BuyNow__cswidget"];
  const { handles } = useCssHandles(CSS_HANDLES);
  const product = useProduct();
  const skuIdentifier = product.selectedItem.name;

  const { push } = usePixel();

  useEffect(() => {
    AppendBuyNow();
  }, []);

  function AppendBuyNow() {
    const script = document.createElement("script");

    script.defer = "defer";
    script.src =
      "https://cdn.channelsight.com/widget/scripts/cswidget.loader.js";
    script.async = true;
    document.head.appendChild(script);
  }

  const handleClick = () => {
    //GA4FUNREQ36
    push({ event: "store_locator_from_product" });
    //GA4FUNREQ38
    push({ event: "intentionToBuy" });
  };

  return (
    <>
      <style>
        {
          "\
        .cswidget {\
          width: 100%;\
          height: 56px;\
          background: #0090d0;\
          border-radius: 16px;\
          color: #ffffff;\
          font-family: 'Roboto-Medium';\
          text-transform: uppercase;\
          border: 1px solid transparent;\
          cursor: pointer;\
        }\
        .cswidget:hover {\
          background: #005c92;\
        }\
        \
        "
        }
      </style>
      <div className={handles.BuyNow__wrapper}>
        <button
          className="cswidget"
          data-asset-id="1335"
          data-product-sku={skuIdentifier}
          onClick={handleClick}
        >
          Achetez en ligne
        </button>
      </div>
    </>
  );
}
