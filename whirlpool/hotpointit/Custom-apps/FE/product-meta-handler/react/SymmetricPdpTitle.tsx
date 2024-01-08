import getProduct from "./graphql/product.graphql";
import { Helmet, useRuntime } from "vtex.render-runtime";
import { useProduct } from "vtex.product-context";
import { useQuery } from "react-apollo";
import React from "react";

export default function SymmetricPdpTitle() {
  const rt = useRuntime();
  const prodData = useProduct();

  if (prodData?.product?.titleTag && prodData?.product?.metaTagDescription) {
    return null;
  }

  const getSlug = () => rt?.route?.params?.slug || rt?.route?.queryString?.slug;

  const productDataQuery = useQuery(getProduct, {
    variables: {
      slug: getSlug(),
    },
  });

  const metaTitle = productDataQuery?.data?.product?.titleTag;
  const metaDescription = productDataQuery?.data?.product.metaTagDescription;

  return (
    <Helmet>
      <meta name="description" content={metaDescription} />
      <title>{metaTitle}</title>
    </Helmet>
  );
}
