import React, { FC } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'
import BundleInfo from './BundleItems'
import Attachment from './Attachments'
import Product from './Product'
import GET_PROD_SPECIFICATIONS from "../../graphql/getProductsSpecifications.graphql"

interface Props {
  products: OrderItem[]
}

const CSS_HANDLES = ['productList', 'productListItem']

const ProductList: FC<Props> = ({ products }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const productsIds = products.map(el => el.productId);
  const { data, loading } = useQuery(GET_PROD_SPECIFICATIONS, {
    variables: {
      field: "id",
      values: productsIds
    }
  });
  return !loading ? (
    <ul className={`${handles.productList} w-60-l w-100 list pl0`}>
      {products.map((product, index) => (
        <li
          key={product.id}
          className={`${handles.productListItem} db bb b--muted-4 mb7 pb7`}
        >
          <Product product={product} properties={{...data.productsByIdentifier[index].properties}} />
          <BundleInfo product={product} />
          <Attachment product={product} />
        </li>
      ))}
    </ul>
  ) : (<></>)
}

export default ProductList
