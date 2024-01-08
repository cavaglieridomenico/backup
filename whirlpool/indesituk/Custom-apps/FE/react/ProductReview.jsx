import React, { useEffect, useLayoutEffect } from "react";
import { useProduct } from "vtex.product-context";

export default function ProductReview() {
  useEffect(() => {
    getProductReviewFromReevoo();
  }, []);

  function getProductReviewFromReevoo() {
    const script = document.createElement("script");

    script.defer = "defer";
    script.src = "https://mark.reevoo.com/assets/reevoo_mark.js";
    script.id = "reevoomark-loader";
    script.type = "text/javascript";

    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("type", "text/css");
    linkElement.setAttribute(
      "href",
      "https://mark.reevoo.com/assets/embedded_reviews.css"
    ); 

    document.head.appendChild(script);
    document.head.appendChild(linkElement);
  }

  const { product } = useProduct();

  const productFcode = product.items[0].name;
  useLayoutEffect(() => {
    removePartsFromEmbeddable();
  }, [removePartsFromEmbeddable()]);
  function removePartsFromEmbeddable() {
    const paginator = document.querySelector("reevoo-embedded-product-reviews");
    if (paginator) {
      if (paginator.querySelector("#embedded_product_reviews_gtw")) {
        paginator.querySelector("#embedded_product_reviews_gtw").style.display =
          "none";
        paginator.querySelector(".pagination").style.display = "none"; 
      }
    }
  }

  return (
    <>
      <reevoo-embedded-product-reviews
        trkref="IN4"
        sku={productFcode}
        locale="en-GB"
        per-page={3}
      ></reevoo-embedded-product-reviews>
    </>
  );
}
