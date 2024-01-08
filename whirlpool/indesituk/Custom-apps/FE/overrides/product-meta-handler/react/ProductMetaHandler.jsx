import products from './graphql/productsQuery.gql'
// @ts-ignore
import { Helmet, useRuntime } from 'vtex.render-runtime'
// @ts-ignore
import { useProduct } from 'vtex.product-context'
// @ts-ignore
import { useQuery } from 'react-apollo'
function ProductMetaHandler() {
  const { route } = useRuntime()
  // @ts-ignore
  const { slug } = route.queryString
  // @ts-ignore
  const prodValue = useProduct()
  const { data } = useQuery(products, {
    variables: {
      slug: slug,
    },
  })
  console.log('sono data ', data)
  console.log('sono product ', prodValue)
  const prodSell = prodValue?.product?.titleTag? prodValue.product.titleTag : null
  const prodDesc = prodValue?.product?.metaTagDescription ? prodValue.product.metaTagDescription: null
  console.log('sono prod sell ', prodSell)
  console.log('sono prod desc ', prodDesc)
    return (
      <Helmet data-react-helmet="true">
        <title>{prodSell}</title>
        <meta
          data-react-helmet="true"
          name="description" content={prodDesc}
        />
      </Helmet>
    )
  
}
export default ProductMetaHandler
