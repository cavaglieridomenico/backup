import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
//@ts-ignore
import { useRuntime } from 'vtex.render-runtime'
import { usePixel } from "vtex.pixel-manager";
import discontinedProducts from './graphql/discontinued-products.graphql'
import ProductWrapperDiscontinued from './ProductWrapperDiscontinued'

interface PropsDiscontinuedProduct {
  children: React.Component
}

const UnsellableProducts: StorefrontFunctionComponent<PropsDiscontinuedProduct> = ({
  children,
}) => {
  const { route } = useRuntime()
  const { push } = usePixel(); 

  const { id, slug } = route.queryString

  const [render, setRender] = useState(<></>)
  const { loading } = useQuery(discontinedProducts, {
    variables: {
      slug: slug,
    },
    onCompleted: (data: any) => {

      push({ event: 'unsellableProductView', product: data?.product })

      setRender(
        <ProductWrapperDiscontinued
          productContext={data?.product}
          params={{ slug, listName: '' }}
          query={{
            skuId: data?.product?.items[0]?.itemId,
            idsku: data?.product?.items[0]?.itemId,
          }}
          productId={id}
        >
          {children}
        </ProductWrapperDiscontinued>
      )
    },
  })

  if (loading) return <>loading</>

  // OLD WAY
  // useEffect(() => {
  //   window.localStorage &&
  //     data &&
  //     setRender(
  //       <ProductWrapperDiscontinued
  //         productContext={data.product}
  //         params={{ slug, listName: "" }}
  //         query={{
  //           skuId: data.product.items[0].itemId,
  //           idsku: data.product.items[0].itemId,
  //         }}
  //         productId={id}
  //       >
  //         {children}
  //       </ProductWrapperDiscontinued>
  //     );
  // }, [window.localStorage, data]);

  return render
}

UnsellableProducts.schema = {
  title: 'store/discontinued-products.unsellable-title',
  description: 'store/discontinued-products.unsellable-description',
  type: 'object',
}

export default UnsellableProducts
