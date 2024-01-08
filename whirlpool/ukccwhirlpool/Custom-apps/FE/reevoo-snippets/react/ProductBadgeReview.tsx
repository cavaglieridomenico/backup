//@ts-nocheck
import React, { useEffect, useState } from "react";
import style from "./style.css";
import { useProduct, SpecificationGroup } from "vtex.product-context";

const ProductReview: StorefrontFunctionComponent = () => {
  const { product } = useProduct();
  const [myProduct, setMyProduct] = React.useState(null);
  React.useEffect(() => {
    if (!myProduct) {
      setMyProduct(product);
    }
  }, [product]);
  return (
    <>
      {myProduct && (
        <reevoo-badge
          type="product"
          sku={product.items?.[0].name}
          name="b_product_score_rect_2"
          class="reevoo-badge"
          id={`product-${product.items?.[0].name}`}
        ></reevoo-badge>
      )}
    </>
  );
};

ProductReview.schema = {
  title: "editor.basicblock.title",
  description: "editor.basicblock.description",
  type: "object",
};

export default ProductReview;
