import React from "react";
import { useProduct } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";
import { isViewportMaxWidth } from "./utils/media-query-utils";
import { getResizeImageUrl } from "./utils/image-url-utils";

interface ProductImageProps {
  isConditionalFetch?: boolean;
  conditionalBreakpoint?: string | number;
  width?: string | number;
  height?: string | number;
  loading?: any;
  fetchpriority?: any;
}

const CSS_HANDLES = ["container", "image"] as const;

const ProductImage: StorefrontFunctionComponent<ProductImageProps> = (
  props: ProductImageProps
) => {
  const {
    isConditionalFetch = false,
    conditionalBreakpoint = 1100,
    width = 800,
    height = "auto",
    loading = "eager",
    fetchpriority = "auto",
  } = props;
  if (isViewportMaxWidth(conditionalBreakpoint) && isConditionalFetch) {
    return null;
  }
  const productContext = useProduct();
  const { handles } = useCssHandles(CSS_HANDLES);

  const url = productContext?.product?.items[0]?.images[0]?.imageUrl;
  const altText = productContext?.product?.metaTagDescription;
  return (
    <img
      className={handles.image}
      src={getResizeImageUrl(url, width, height)}
      alt={altText}
      loading={loading}
      fetchpriority={fetchpriority}
    />
  );
};

ProductImage.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};

export default ProductImage;
