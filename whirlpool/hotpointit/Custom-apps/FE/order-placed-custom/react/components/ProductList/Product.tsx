import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { ProductImage } from 'vtex.order-details'
import { Link } from 'vtex.render-runtime'

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
  'freePrice',
  'energyLabel',
  'linkEnergy',
  'linkEnergyHide'
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
    isGift,
    specificationGroups
  } = product
  const handles = useCssHandles(CSS_HANDLES)
  const showMeasurementUnit = unitMultiplier !== 1 || measurementUnit !== 'un'
  const productSubtotal = price * quantity * unitMultiplier

  
  const allSpecifications = specificationGroups.find((item: any) => item.name === "allSpecifications").specifications;
  const energyLogo = allSpecifications.filter((item: any) => item.name === "EnergyLogo_image")?.[0]?.values?.[0]
  const nelDataSheet = allSpecifications.filter((item: any) => item.name === "nel-data-sheet")?.[0]?.values?.[0]
  const productDataSheet = allSpecifications.filter((item: any) => item.name === "product-data-sheet")?.[0]?.values?.[0]
  const energyLabelNew = allSpecifications.filter((item: any) => item.name === "new-energy-label")?.[0]?.values?.[0]
  const energyLabel = allSpecifications.filter((item: any) => item.name === "energy-label")?.[0]?.values?.[0]

  return (
    <div className={`${handles.productWrapper} w-100 flex-m tc tl-m`}>
      <div className={`${handles.productImageColumn} w-60 flex-m mb6-s mb0-m`}>
        <div className={`${handles.productImageWrapper} w4 h4`}>
          <ProductImage url={imageUrl} alt={name} />
        </div>
        <Link
          to={detailUrl}
          className={`${handles.productName} t-body c-muted-1 no-underline flex flex-column`}
          style={{gap: '10px'}}
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
          <div className={`${handles.energyLabel}`}>
            <a target="_blank" href={energyLabelNew ? energyLabelNew : energyLabel}><img src={energyLogo} /></a>
            {/* <a className={`${handles.linkEnergy}`} target="_blank" href={nelDataSheet ? nelDataSheet : productDataSheet}> Scheda Tecnica </a> */}
            {(!nelDataSheet && !productDataSheet) ? <div className={`${handles.linkEnergyHide}`}></div> : <a className={`${handles.linkEnergy}`} target="_blank" href={nelDataSheet ? nelDataSheet : productDataSheet}> Scheda Tecnica </a>} 
          </div>
        </Link>
      </div>
      <div
        className={`${handles.productInfoColumn} w-25 flex-m lh-copy`}
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
      <div className={`${handles.productPrice} w-15 ml-auto mt3 mt0-m`}>
         {isGift ? <span className={`${handles.freePrice}`}><FormattedMessage id="store/products.isGift" /> </span> : <FormattedPrice value={productSubtotal} />}
      </div>
    </div>
  )
}

export default Product
