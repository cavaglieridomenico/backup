import discontinedProducts from './graphql/discontinued-products.graphql'
import { Helmet, useRuntime } from 'vtex.render-runtime'
// @ts-ignore
import { useProduct } from 'vtex.product-context'
// @ts-ignore
import { useQuery } from 'react-apollo'
function SymmetricPdpTitle() {
  const { route } = useRuntime()
  // @ts-ignore
  const { slug } = route.queryString
  // @ts-ignore
  const prodValue = useProduct()
  const { data } = useQuery(discontinedProducts, {
    variables: {
      slug: slug,
    },
  })
  console.log('sono data ', data)
  console.log('sono product ', prodValue)
  const prodSell = prodValue?.product?.titleTag
  const prodDesc = prodValue?.product?.metaTagDescription
  if (data) {
    const titleUnse = data
      ? data.product
        ? data.product.titleTag
          ? data.product.titleTag
          : data.product.productName
        : data.product.productName
      : data.product.productName

    const titleDesc = data
      ? data.product
        ? data.product.metaTagDescription
          ? data.product.metaTagDescription
          : data.product.description
        : data.product.description
      : data.product.description

    console.log('sono title desc ', titleDesc)
    console.log('sono title Unse ', titleUnse)

    return (
      <Helmet data-react-helmet="true">
        <title>{titleUnse}</title>
        <meta data-react-helmet="true" name="description" content={titleDesc} />
      </Helmet>
    )
  } else {
    console.log('sono prod sell ', prodSell)
    console.log('sono prod desc ', prodDesc)
    return (
      <Helmet data-react-helmet="true">
        <title>{prodSell}</title>
        <meta
          data-react-helmet="true"
          name="description" /* content={titleDesc}  */
        />
      </Helmet>
    )
  }
}
export default SymmetricPdpTitle
