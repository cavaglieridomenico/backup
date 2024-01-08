import React, { useEffect, useState } from "react";
//import style from "./style.css";
import { useQuery } from "react-apollo";
import { usePixel } from "vtex.pixel-manager";
import { useRuntime } from "vtex.render-runtime";
import discontinedProducts from "./graphql/discontinued-products.graphql";
import ProductWrapperDiscontinued from "./ProductWrapperDiscontinued";

interface PropsDiscontinuedProduct {
  children: React.Component;
}

const UnsellableProducts: StorefrontFunctionComponent<PropsDiscontinuedProduct> = ({
  children,
}) => {
  const { route } = useRuntime();
  const { push } = usePixel();
  const { id, slug } = route.queryString;

  const [render, setRender] = useState(<></>);
  const { data, loading } = useQuery(discontinedProducts, {
    variables: {
      slug: slug,
    },
  });
  //console.log("data Product",data.product);

  useEffect(() => {
    window.localStorage &&
      data &&
      setRender(
        <ProductWrapperDiscontinued
          productContext={data.product}
          params={{ slug, listName: "" }}
          query={{
            skuId: data.product.items[0].itemId,
            idsku: data.product.items[0].itemId,
          }}
          productId={id}
        >
          {children}
        </ProductWrapperDiscontinued>
      );

      push({ event: 'unsellableProductView', product: data?.product })

  }, [window.localStorage, data]);

  if (loading) return <>loading</>;

  return render;
};

UnsellableProducts.schema = {
  title: "editor.unsellableProducts.title",
  description: "editor.unsellableProducts.description",
  type: "object",
};

export default UnsellableProducts;
