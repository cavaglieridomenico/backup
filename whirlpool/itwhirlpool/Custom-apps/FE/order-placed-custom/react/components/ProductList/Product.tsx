import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { ProductImage } from 'vtex.order-details'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'
import { useQuery } from "react-apollo";
import getproduct from "../../graphql/getProduct.graphql";
import FormattedPrice from '../FormattedPrice'

interface Props {
  product: OrderItem
}

const CSS_HANDLES = [
  'productWrapper',
  'productImageColumn',
  'productImageWrapper',
  "linksContainer",
  'productInfoColumn',
  'productName',
  'productMeasurementUnit',
  'productQuantity',
  'productPrice',
  'freePrice',
  "energyLabelSrc",
  "productInformationSheet"
]

const Product: FC<Props> = ({ product }) => {
  const { data } = useQuery(getproduct, {
    variables: { identifier: { field: "id", value: product.productId } },
  });
  //useEffect(() => {}, [data]);
  const energyLabelSrc = data?.product?.specificationGroups
    ?.find((spec: any) => spec.name == "EnergyLogo")
    ?.specifications?.find((spec: any) => spec.name == "EnergyLogo_image")
    .values[0];
  const energyLabelPdf = data?.product?.specificationGroups
    ?.find((spec: any) => spec.name == "Document")
    ?.specifications?.find((spec: any) => spec.name == "new-energy-label")
    ?.values[0];
  const oldEnergyLabelPdf = data?.product?.specificationGroups
    ?.find((spec: any) => spec.name == "Document")
    ?.specifications?.find((spec: any) => spec.name == "energy-label")
    ?.values[0];
  const productSheet = data?.product?.specificationGroups
  ?.find((spec: any) => spec.name == "Document")
    ?.specifications?.find(
      (spec: any) => spec.name == "product-information-sheet"
    )?.values[0];
  const oldProductSheet = data?.product?.specificationGroups
    ?.find((spec: any) => spec.name == "Document")
    ?.specifications?.find((spec: any) => spec.name == "product-fiche")
    ?.values[0];
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

  return (
    <div className={`${handles.productWrapper} w-100 flex-m tc tl-m`}>
      <div className={`${handles.productImageColumn} mr6-m mb6-s mb0-m`}>
        <div className={`${handles.productImageWrapper} w4 h4 center`}>
          <ProductImage url={imageUrl} alt={name} />
        </div>
      </div>
      <div
        className={`${handles.productInfoColumn} flex-m flex-column justify-between lh-copy items-center`}
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
           <div className={`${handles.linksContainer} flex flex-row items-center`}>
          <Link
            to={energyLabelPdf || oldEnergyLabelPdf}
            target="_blank"
            className={handles.imageContainer}
          >
            {energyLabelSrc ? (
              <img
                src={energyLabelSrc}
                alt="energyLabel"
                className={handles.energyLabelSrc}
              />
            ) : null}
          </Link>
          {productSheet || oldProductSheet ? (
            <Link
              to={productSheet || oldProductSheet}
              target="_blank"
              className={handles.productInformationSheet}
            >
              <FormattedMessage
            id="store/pickup.productsheet"
          />
            </Link>
          ) : null}
        </div>
        </Link>
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
          <div>
            <FormattedPrice value={productSubtotal} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Product
