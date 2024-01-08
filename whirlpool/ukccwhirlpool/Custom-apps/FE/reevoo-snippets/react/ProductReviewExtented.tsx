import React, { useState, useEffect } from "react";
import { useProduct } from "vtex.product-context";

const ProductReview: StorefrontFunctionComponent = () => {
  const { product } = useProduct();
  const [isProduct, setIsProduct] = useState(false);

  useEffect(() => {
    if (product) setIsProduct(true);
  }, [product]);

  return (
    <>
      {isProduct && (
        //@ts-ignore
        <reevoo-embeddable
          type="product"
          product-id={product.items?.[0]?.name}
          per-page="3"
          locale="en-GB"
          className="reevoo-badge"
        />
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
