import discontinedProducts from "./graphql/discontinued-products.graphql";
import { Helmet, useRuntime } from 'vtex.render-runtime'
// @ts-ignore
/* import { useProduct } from 'vtex.product-context' */
// @ts-ignore
import { useQuery } from "react-apollo";
  function TitleSource() {

    const { route } = useRuntime();
    // @ts-ignore
    const { slug,metaTagDescription } = route.queryString
  /* const prodValue:any = useProduct()  */
  const {data} = useQuery(discontinedProducts, {
    variables: {
      slug: slug,
    },
  });
  
/*prodValue.product.metaTagDescription='o' 
  console.log("123456789", prodValue?.product?.metaTagDescription)  
  const name=prodValue?.product?.productName
  const brand=data?.product?.brand
  const productCode = data?.product?.properties?.filter((e: any) => e.name == "CommercialCode_field")[0]?.values[0] 
  const productCategory = data ? data?.product?.categoryTree?.[2]?.name :  prodValue?.product?.categories?.[0].split(/[//]/)[3]
  const title= data ? (brand)+' '+(productCode)+' '+(productCategory) : name */
  return (
    <Helmet>
      {/* <title>{ title }</title> */}
      <meta name="description" content={data?.product?.metaTagDescription}/>
     {/*  {data &&<meta data-react-helmet="true" property="description"  name="description"  content={'Discover '+(brand)+' '+(productCode)+' '+(productCategory)+' designed to meet your needs and stand the test of time. Learn more about our home appliances product range'}/>} */}   
    </Helmet>
  )
}

export default TitleSource
