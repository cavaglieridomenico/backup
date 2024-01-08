import React from "react";
import { useCssHandles } from "vtex.css-handles";
import { useProduct } from "vtex.product-context";

export default function CommercialCodeLabel() {
  const CSS_HANDLES = [
    "CommercialCodeLabel_container",
    "CommercialCodeLabel_label",
  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const product = useProduct();

  const commercialCode = product?.product?.properties?.filter((obj) => {
    return obj.name === "CommercialCode_field";
  });

  return (
    <>
      <div className={handles.CommercialCodeLabel_container}>
        <div className={handles.CommercialCodeLabel_label}>
          {commercialCode[0].values}
        </div>
      </div>
    </>
  );
}
