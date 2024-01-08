import React, { useCallback, useEffect, useMemo, useState }  from 'react'
import { useQuery } from 'react-apollo'
import type { ComponentType, PropsWithChildren } from 'react'
import { usePixel } from 'vtex.pixel-manager'
import { ProductListContext } from 'vtex.product-list-context'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { ExtensionPoint, useTreePath } from 'vtex.render-runtime'
import { mapCatalogProductToProductSummary }  from './Utils'
// import relatedProducts from './relatedProd'
import style from './style.css'
import products from '../graphql/products.graphql'

type PropsList = PropsWithChildren<{
  /** Array of products. */
  products?: any[]
  /** Slot of product summary. */
  ProductSummary: ComponentType<{ product: any }>
  /** Name of the list property on Google Analytics events. */
  listName?: string
  /** Callback on product click. */
  actionOnProductClick?: (product: any) => void
}>

function List({
  children,
  products,
  ProductSummary,
  actionOnProductClick,
}: PropsList) {
  const { list } = useListContext()
  const { treePath } = useTreePath()
  const newListContextValue = useMemo(() => {
    const componentList = products?.map((product:any) => {
      const normalizedProduct = mapCatalogProductToProductSummary(product)
      if (typeof ProductSummary === 'function') {
        return (
          <ProductSummary
            key={normalizedProduct.cacheId}
            product={normalizedProduct}
          />
        )
      }

      const handleOnClick = () => {
        if (typeof actionOnProductClick === 'function') {
          actionOnProductClick(normalizedProduct)
        }
      }
      return (
        <ExtensionPoint
          id="product-summary"
          key={normalizedProduct.cacheId}
          treePath={treePath}
          product={normalizedProduct}
          actionOnClick={handleOnClick}
        />
      )
    })

    return list.concat(componentList ?? [])
  }, [products, list, ProductSummary, treePath, actionOnProductClick])

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

type Props = PropsWithChildren<{
  ProductSummary: ComponentType<{ product: any }>
  listName?: string
}>
function CarouselWhirlpool({
  children,
  listName,
  ProductSummary
}: Props) {

// Fetch
  const [response, setResponse] = useState([])
const getProducts = async() =>{
  const options = {
    method: 'GET'
  };
  return await fetch('/app/sfmc/recommendations', options)
    .then(response => response.json())
    .then(result => setResponse(result))
    .catch(err => console.error(err));
}

  const { push } = usePixel()
  const { ProductListProvider } = ProductListContext
  let initialize : any[] = []
  const [list,setList] = useState(initialize)
  const productClick = useCallback(
    (product: any) => {
      push({
        event: 'productClick',
        list: listName ? listName : 'List of products',
        product,
      })
    },
    [push, listName]
  )
  const productList = (ids: any) => {
    const { loading, error, data } = useQuery(products, {
      variables:{
        "field":"id",
        "values":ids
      }
    });
    
    if (loading) return (<div className={style.container}><div className={style.loaderSalesForce}></div></div>);
    if (error) return (<div>Error! ${error.message}`</div>);
    return (
      <ProductListProvider listName={listName ?? ''}>
        <List
          products={createProperties(data.productsByIdentifier)}
          ProductSummary={ProductSummary}
          actionOnProductClick={productClick}
        >
          {children}
        </List>
      </ProductListProvider>  
    )
  }
  const createProperties = (data:any[]) =>{
    let newData :any[] = []
    data.forEach((datum:any) =>{
      let allSpec = datum.specificationGroups.filter((spec:any) => spec.name == 'allSpecifications')[0].specifications
      newData.push({
        ...datum,
        "properties":allSpec
      })
    })
    return newData
  }

  useEffect(()=>{
      getProducts()
      setList(response)
  },[])

  if(list.length > 0)
    return productList(list)
  else return null
}

CarouselWhirlpool.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default CarouselWhirlpool