import React, { useEffect } from "react";
import { useProduct } from "vtex.product-context";

export default function ProductReview() {
  useEffect(() => {
    getProductReviewFromReevoo();
  }, []);

  function getProductReviewFromReevoo() {
    const script = document.createElement("script");

    script.defer = "defer";
    script.src = "https://widgets.reevoo.com/loader/IN4.js";
    script.id = "reevoo-loader";
    script.type = "text/javascript";

    document.body.appendChild(script);
  }

  const { product } = useProduct();

  const productFcode = product.items[0].name;

  const timeout = setInterval(() => {
    const paginator = document.querySelector("reevoo-embeddable");

    if (paginator) {
      if (paginator.shadowRoot) {
        if (paginator.shadowRoot.querySelector("#r-review-filter-bar")) {
          paginator.shadowRoot.querySelector(
            "#r-review-filter-bar"
          ).style.display = "none";
          // paginator.shadowRoot.querySelector(".t_e").style.display = "none";
          // paginator.shadowRoot.querySelector(".x_a").style.display = "none";
          var listItems = paginator.shadowRoot.querySelectorAll(".ag_gp");

          listItems.forEach(
            (element) =>
              (element.parentNode.querySelector(".ag_gp").style.display =
                "none")
          );
          var listItems = paginator.shadowRoot.querySelectorAll(".ag_ge");

          if (listItems.length > 0) {
            const last = listItems[listItems.length - 1];

            last.parentNode.querySelector(".ag_ge").style.display = "none";
          }

          clearInterval(timeout);
        }
      }
    }
  }, 100);

  return (
    <reevoo-embeddable
      type="product"
      product-id={productFcode}
      locale="en-GB"
      per-page={3}
    />
  );
}
