import React, { FC } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Button } from 'vtex.styleguide'
import Attachment from './Attachments'
import BundleInfo from './BundleItems'
import Product from './Product'


interface Props {
  products: OrderItem[]
}

const takeAllData = async (id:any) =>{
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
};

  try {
    const response = await fetch('/_v/wrapper/api/catalog_system/products/productgetbyrefid/' + id, options)
    return await response.json()
  } catch (err) {
    return console.error(err)
  }
}

const getAllData = async (products:any[]) =>{
  let newProducts :any[] = []
  products.forEach((p:any) =>{
    newProducts.push(takeAllData(p.skuName))
  })
  const res = await Promise.all(newProducts)
  return res
}


const CSS_HANDLES = ['productList', 'productListItem', 'garanziaContainer']

const verify = (products:any[],product:any,index:any) =>{
  let dep = products[index] ? products[index].DepartmentId :null
  return !product.isGift && dep == 1
}

const ProductList: FC<Props> = ({ products }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [render,setRender] = useState(<></>)

  useEffect(() =>{
    getAllData(products)
    .then(newProducts => {
      setRender((
        <ul className={`${handles.productList} w-60-l w-100 list pl0`}>
          {products.map((product,index) => (
            <li
              key={product.id}
              className={`${handles.productListItem} db bb b--muted-4 mb7 pb7`}
              onClick={() => console.log(product)}
            >
              <Product product={product} />
              <BundleInfo product={product} />
              <Attachment product={product} />
              { verify(newProducts,product,index) && <div className={`${handles.garanziaContainer}`} >
                <a
                  target="_blank"
                  href="https://hotpoint.registermyguarantee.com/gb#/">
                  <Button>Activate 10 year warrany on spare parts</Button>
                </a>
              </div>}
            </li>
          ))}
        </ul>
      ))
    })
  },[])

  return render
}

export default ProductList
