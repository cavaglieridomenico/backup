import React, { useCallback, useEffect, useMemo, useState }  from 'react'
import { useQuery } from 'react-apollo'
import type { ComponentType, PropsWithChildren } from 'react'
import { usePixel } from 'vtex.pixel-manager'
import { ProductListContext } from 'vtex.product-list-context'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { ExtensionPoint, useTreePath } from 'vtex.render-runtime'
import { mapCatalogProductToProductSummary }  from './Utils'
import relatedProducts from './relatedProd'
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

const getProduct = (refId:string) =>{
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json', 
      Accept: 'application/json',
      'X-VTEX-API-AppKey': 'vtexappkey-itwhirlpool-YKHNOZ',
      'X-VTEX-API-AppToken': 'SSUBFODAEAHOAJGTKHQCDKSPEGFFIOESKDESZSVSATMETJPLFSNZQFDHAEXYIYSQVPEWFNUSLXCKYOVUQUZPAFCEAWSUUXJBBVIEESFSYVOSDSJMICIOYCQQNAWIVAXO'
    }
  };
  
  return fetch('/api/catalog_system/pvt/products/productgetbyrefid/'+refId, options)
    .then(response => response.json())
    .catch(err => console.error(err));
}


const getPromise = (products:any[]) =>{
  let allPromise : any[] = []
  products.forEach((p:any)=>{
    allPromise.push(getProduct(p.sku_id+"-WER"))
  })
  return Promise.all(allPromise).then(products => products)
}

// const getActualProduct = (productID:any) =>{
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json', 
//       Accept: 'application/json',
//       'X-VTEX-API-AppKey': 'vtexappkey-itwhirlpool-YKHNOZ',
//       'X-VTEX-API-AppToken': 'SSUBFODAEAHOAJGTKHQCDKSPEGFFIOESKDESZSVSATMETJPLFSNZQFDHAEXYIYSQVPEWFNUSLXCKYOVUQUZPAFCEAWSUUXJBBVIEESFSYVOSDSJMICIOYCQQNAWIVAXO'
//     }
//   };
  
//   return fetch('/api/catalog_system/pub/products/variations/'+productID, options)
//     .then(response => response.json())
//     .catch(err => console.error(err));
// }

// const getSpecProduct = (productID:any) =>{
//   const options = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json', 
//       Accept: 'application/json',
//       'X-VTEX-API-AppKey': 'vtexappkey-itwhirlpool-YKHNOZ',
//       'X-VTEX-API-AppToken': 'SSUBFODAEAHOAJGTKHQCDKSPEGFFIOESKDESZSVSATMETJPLFSNZQFDHAEXYIYSQVPEWFNUSLXCKYOVUQUZPAFCEAWSUUXJBBVIEESFSYVOSDSJMICIOYCQQNAWIVAXO'
//     }
//   };
  
//   return fetch('/api/catalog_system/pvt/products/'+productID+'/specification', options)
//     .then(response => response.json())
//     .catch(err => console.error(err));
// }

// const getAllSpecProduct = (product:any[]) =>{
//   let objs : any[] = []
//   product.forEach((p:any)=>{
//     objs.push(getSpecProduct(p.productId))
//   })
//   return Promise.all(objs).then(res => res)
// }


// const removeProductNotFound = (xs :any[]) =>{
//   return xs.filter((x:any) => x !== null && typeof x !== "string")
// }

// const getActualPromise = (products:any[]) =>{
//   let allPromise : any[] = []
//   products.forEach((p:any)=>{
//     if(p !== null){
//       allPromise.push(getActualProduct(p.Id))
//     }
//   })
//   return Promise.all(allPromise).then(products => products)
// }

// const getCacheId = (xs:any[],xxs:any[]) =>{
//   xs.forEach((x:any) => {
//     x.cacheId = xxs.filter((s:any) => s !== null && s.Id == x.productId)[0].LinkId.toLowerCase()
//   })
//   return xs
// }

// const unifySpec = (items:any[],specs:any[]) => {
//   for(let i=0;i<items.length;i++){
//     items[i].properties = specs[i]
//   }
//   return items
// }
// const putCategoryId = (items:any[],prodTemp:any[]) =>{
//   for(let i=0;i<items.length;i++){
//     items[i].categoryId = prodTemp.filter((e:any) => e !== null && e.Id == items[i].productId)[0].CategoryId
//   }
//   return items
// }
type Props = PropsWithChildren<{
  ProductSummary: ComponentType<{ product: any }>
  listName?: string
}>
function CarouselWhirlpool({
  children,
  listName,
  ProductSummary
}: Props) {
  const { push } = usePixel()
  const { ProductListProvider } = ProductListContext
  //const [render,setRender] = useState(<></>)
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
  const createIdList = (listProds:any[]) =>{
    let ids : any[] = []
    listProds.forEach((prod:any) =>{
      ids.push(prod.Id)
    })
    return ids
  }
  useEffect(()=>{
    getPromise(relatedProducts.items).then(itemsIDRes =>{
      console.log(itemsIDRes)
      setList(createIdList(itemsIDRes))
      // getActualPromise(itemsIDRes)
      // .then((actualItems:any[]) =>{
      //   let foundItems = removeProductNotFound(actualItems)
      //   getAllSpecProduct(foundItems)
      //   .then(specs =>{
      //     setRender((
      //       <ProductListProvider listName={listName ?? ''}>
      //         <List
      //           products={unifySpec(putCategoryId(getCacheId(foundItems,itemsIDRes),itemsIDRes),specs)}
      //           ProductSummary={ProductSummary}
      //           actionOnProductClick={productClick}
      //         >
      //           {children}
      //         </List>
      //       </ProductListProvider>
      //     ))
      //   })
      // })
    })
  },[])

  return productList(list)
}

CarouselWhirlpool.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default CarouselWhirlpool