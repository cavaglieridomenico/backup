import React from 'react'
import { useProduct } from "vtex.product-context";
interface BreadcrumbPdpProps {
  BreadcrumbPdpDefault: string
}

const BreadcrumbPdp: StorefrontFunctionComponent<BreadcrumbPdpProps> = ({BreadcrumbPdpDefault}) => {
  const productContext = useProduct();
  const productComCode = productContext?.product?.properties?.filter((e: any) => e.name == "CommercialCode_field")[0]?.values[0]

  let myData = productContext?.product?.properties


  console.log('MYDATA', myData)

  return (
    <>
    { productComCode ?
      <div>{productComCode}</div>
      :
      <div>{BreadcrumbPdpDefault}</div>
    }
    </>
  );
};

export default BreadcrumbPdp

BreadcrumbPdp.schema = {
  title: 'BreadcrumbPdp default value',
  description: 'editor.breadcrumbPdp.description',
  type: 'object',
  properties: {
    BreadcrumbPdpDefault: {
       title: 'BreadcrumbPdpDefault',
       description: 'BreadcrumbPdp Default label',
       type: 'string',
       default: '',
    },
  },
}
