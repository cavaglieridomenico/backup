import React, { FC, useEffect, useState } from 'react'
import { useQuery } from "react-apollo"
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { ProductImage } from 'vtex.order-details'
import { Link } from 'vtex.render-runtime'
import getproduct from "../../graphql/getProduct.graphql"
import style from '../../styles.css'
import FormattedPrice from '../FormattedPrice'

interface Props {
  product: OrderItem
}

const CSS_HANDLES = [
  'productWrapper',
  'productImageColumn',
  'productImageWrapper',
  'productInfoColumn',
  'productName',
  'productMeasurementUnit',
  'productQuantity',
  'productPrice',
  'freePrice'
]

const Product: FC<Props> = ({ product }) => {
  const {
    detailUrl,
    imageUrl,
    measurementUnit,
    name,
    price,
    quantity,
    unitMultiplier,
    isGift
  } = product

  const [productData, setProductData] = useState<any>({})

  const { data, error } = useQuery(getproduct, {
    variables: { identifier: { field: "id", value: product.productId } },
  });

  useEffect(() =>{
    if(data){
      setProductData(data.product)
    }
  }, [data])

  useEffect(() =>{
    if(error){
      console.log(error)
    }
  }, [error])
  const handles = useCssHandles(CSS_HANDLES)
  const showMeasurementUnit = unitMultiplier !== 1 || measurementUnit !== 'un'
  const productSubtotal = price * quantity * unitMultiplier


  const isOutOfStock = productData.properties ? productData?.properties?.filter((e: any) => e.name == "stockavailability")[0]?.values[0] : ""
  const isLeadTimeValue = productData.properties ? productData?.properties?.filter((e: any) => e.name == "leadtime")[0]?.values[0] : ""
  const stringOutOfStock = "Out of Stock";

  const productDataSheet = productData.properties ? productData?.properties.filter((e: any) => e.name === "nel-data-sheet" || e.name === "product-data-sheet")[0]?.values[0] : ""
  const energyLogoImage = productData.properties ? productData?.properties.filter((e: any) => e.name === "EnergyLogo_image")[0]?.values[0] : ""
  const newEnergyLabel = productData.properties ? productData?.properties.filter((e:any) => e.name === "new-energy-label")[0]?.values[0] : undefined
  const oldEnergyLabel = productData.properties ? productData?.properties.filter((e: any) => e.name === "energy-label")[0]?.values[0] : ""

  return (
    <div className={`${handles.productWrapper} w-100 flex-m tc tl-m`}>
      <div className={`${handles.productImageColumn} w-60 flex-m mb6-s mb0-m`}>
        <div className={`${handles.productImageWrapper} w4 h4`}>
          <ProductImage url={imageUrl} alt={name} />
        </div>
        <div>
          <Link
            to={detailUrl}
            className={`${handles.productName} t-body c-muted-1 no-underline`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
            {showMeasurementUnit && (
              <small
                className={`${handles.productMeasurementUnit} db mt3 t-mini c-on-base`}
              >
                {`${unitMultiplier} ${measurementUnit}`}
              </small>
            )}
          </Link>
          <div className={`${style.instock} flex-wrap`}>
            {
              isOutOfStock !== null && isOutOfStock === stringOutOfStock ?
                  <p className={`${style.leadtime} mr5`}>{isLeadTimeValue}</p>
                :
                  <>
                    <div className={style.tick}></div>
                    <p className={`${style.instockText} mr5`}>In Stock</p>
                  </>
            }
            <div className='flex items-center'>
              <a className='mr3 flex items-center' href={newEnergyLabel ?? oldEnergyLabel} target="_blank">
                <img src={energyLogoImage} alt="" />
              </a>
              {productDataSheet && (
                <a className='f7 t-mini c-on-base' href={productDataSheet} target="_blank">Data sheet</a>
              )}
            </div>
          </div>

        </div>

      </div>
      <div
        className={`${handles.productInfoColumn} w-30 flex-m lh-copy`}
      >
        <small
          className={`${handles.productQuantity} t-mini c-muted-1 mt3 mt0-m`}
        >
          <FormattedMessage
            id="store/products.quantity"
            values={{ quantity }}
          />
        </small>
      </div>
      <div className={`${handles.productPrice} w-10 ml-auto mt3 mt0-m`}>
         {isGift ? <span className={`${handles.freePrice}`}><FormattedMessage id="store/products.isGift" /> </span> : <FormattedPrice value={productSubtotal} />}
      </div>
    </div>
  )
}

export default Product
