import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useProduct } from "vtex.product-context";

export default function HelmetSharing() {
  const [sitePosition, setSitePosition] = useState("");

  useEffect(() => {
    setSitePositionCheck();
  }, []);

  function setSitePositionCheck() {
    if (window.location.href) {
      setSitePosition(window.location.href);
    }
  }

  const { product } = useProduct();
  const { productName, productDescription } = product;
  const imageUrl = product.items[0].images[0].imageUrl;

  return (
    <Helmet>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@indesititqa" />
      <meta name="twitter:creator" content="@indesititqa" />
      <meta name="twitter:title" content={productName} />
      <meta name="twitter:description" content={productDescription} />
      <meta
        name="twitter:image"
        // content="https://media.magic.wizards.com/image_legacy_migration/images/magic/tcg/products/nph/cigsplash_d5nfti6meq_it.jpg"
        content={imageUrl}
      />
    </Helmet>
  );
}

{
  /* <meta name="twitter:url" content="https://sorcioindesituno--indesititqaqa.myvtex.com/built-in-microwave-oven-stainless-steel-colour-f159150/p" /> */
}
