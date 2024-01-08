import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { ProductImage } from 'vtex.order-details'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import FormattedPrice from '../FormattedPrice'

type PropertiesObject = {
  name: string,
  values: string | Array<string>
}
type Props = {
  product: OrderItem
  properties: {
    [index: number]: PropertiesObject
  }
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
  'productEnergyImage',
  'productEnergyLabel'
]

const Product: FC<Props> = ({ product, properties }) => {
  const {
    detailUrl,
    imageUrl,
    measurementUnit,
    name,
    price,
    quantity,
    unitMultiplier,
    isGift,
  } = product
  const handles = useCssHandles(CSS_HANDLES)
  const showMeasurementUnit = unitMultiplier !== 1 || measurementUnit !== 'un'
  const productSubtotal = price * quantity * unitMultiplier
  let energyLabel = null;
  let energyLabelLink = null
  let dataSheet = null;
  for (const key in properties) {
    if (properties[key].name === "EnergyLogo_image") energyLabel = properties[key].values[0]
    if (properties[key].name === "new-energy-label") energyLabelLink = properties[key].values[0]
    if (properties[key].name === "nel-data-sheet") dataSheet = properties[key].values[0]
  }
  return (
    <div className={`${handles.productWrapper} w-100 flex-m tc tl-m`}>
      <div className={`${handles.productImageColumn} mr6-m mb6-s mb0-m`}>
        <div className={`${handles.productImageWrapper} w4 h4 center`}>
          <ProductImage url={imageUrl} alt={name} />
        </div>
      </div>
      <div
        className={`${handles.productInfoColumn} flex-m flex-column justify-between lh-copy`}
      >
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
        <div className='flex items-center'>
          { energyLabel && <Link className="mr2" to={energyLabelLink} target="_blank"><img className={handles.productEnergyImage} src={energyLabel}></img></Link> }
          { dataSheet && <Link className={handles.productEnergyLabel} to={dataSheet} target="_blank"><FormattedMessage id="store/products.energyLabel" /></Link> }
        </div>
        <small
          className={`${handles.productQuantity} t-mini c-muted-1 mt3 mt0-m`}
        >
          <FormattedMessage
            id="store/products.quantity"
            values={{ quantity }}
          />
        </small>
      </div>
      <div className={`${handles.productPrice} ml-auto mt3 mt0-m`}>
        {isGift ? (
          <FormattedMessage id="store/products.isGift" />
        ) : (
          <FormattedPrice value={productSubtotal} />
        )}
      </div>
    </div>
  )
}

export default Product
