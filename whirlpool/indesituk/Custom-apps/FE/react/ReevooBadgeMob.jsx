import React, { useEffect } from "react";
// @ts-ignore
import { useProduct } from "vtex.product-context";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

export default function ReevooBadgeMob() {
  const { product } = useProduct();

  const productFcode = product.items[0].name;

  /*  useEffect(() => {
    getReevooData();
  }, []);

  function getReevooData() {
    const script = document.createElement("script");

    script.defer = "defer";
    script.src = "https://mark.reevoo.com/assets/reevoo_mark.js";
    script.id = "reevoo-loader";
    script.type = "text/javascript";

    document.body.appendChild(script);
  } */

  const CSS_HANDLES = [
    "reevooMob__container",
    "readsReviewsMob__container",
    "askAnOwnerMob__container",
  ];

  const { handles } = useCssHandles(CSS_HANDLES);

  return (
    <>
      <style>
        {
          "\
            .reevoo__ask-an-owner-badge--desktop{\
            padding: 4px 4px !important; \
            }\
          \
          "
        }
      </style>
      <div className={handles.reevooMob__container}>
        {/* <h3> badge_2 (mobile)</h3>*/}
        <div className={handles.readsReviewsMob__container}>
          <reevoo-reviewable-badge
            type="product"
            variant="badge_2"
            trkref="IN4"
            sku={productFcode}
          ></reevoo-reviewable-badge>
        </div>

        {/* <h3> badge_3 (mobile)</h3> */}
        <div className={handles.askAnOwnerMob__container}>
          <reevoo-conversations-badge
            type="aao"
            variant="badge_3"
            trkref="IN4"
            sku={productFcode}
          ></reevoo-conversations-badge>
        </div>
      </div>
    </>
  );
}
