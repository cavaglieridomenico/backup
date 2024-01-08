import React from 'react'
import { useQuery } from 'react-apollo'
import productGift from './graphql/productGift.graphql'
import { useProduct } from "vtex.product-context";

interface WrapperProductGiftProps {
  children: React.Component
}

const WrapperProductGift: StorefrontFunctionComponent<WrapperProductGiftProps> = ({children}:WrapperProductGiftProps) => {
  const productContext = useProduct();


  const { data, error } = useQuery(productGift, {
    variables: {identifier: {field: "id", value: parseInt(productContext.product.productId)}},
  })
  const getGift = () => {
    if (!error && data && data.product.items[0].sellers[0].commertialOffer.gifts.length > 0) {
      return (<React.Fragment>{children}</React.Fragment>)
    } else {
      return <></>;
    }
  };
  return getGift() 
}

WrapperProductGift.schema = {
  title: 'editor.wrapperProductGift.title',
  description: 'editor.wrapperProductGift.description',
  type: 'object',
  properties: {},
}

export default WrapperProductGift
