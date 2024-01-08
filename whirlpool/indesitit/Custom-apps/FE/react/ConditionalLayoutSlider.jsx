import React, { useEffect, useState } from "react";

import ProductCarouselNew from "./ProductCarouselNew";

export default function ConditionLayoutSlider({ conditions, collectionID }) {
  const [result, setResult] = useState(false);

  useEffect(() => {
    checkPath();
  }, []);

  function checkPath() {
    if (
      window.location.href &&
      window.location.href !== undefined &&
      window.location.href !== null
    ) {
      const reg = new RegExp(`/${conditions}`);
      const result = !!reg.exec(window.location.href);

      setResult(result);
    }
  }

  if (result) {
    return <ProductCarouselNew collectionID={collectionID} />;
  }
}
