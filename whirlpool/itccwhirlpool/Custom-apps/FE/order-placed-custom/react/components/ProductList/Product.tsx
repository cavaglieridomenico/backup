import React, { FC, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { ProductImage } from "vtex.order-details";
import { useCssHandles } from "vtex.css-handles";
import { Link } from "vtex.render-runtime";
import { useQuery } from "react-apollo";

import FormattedPrice from "../FormattedPrice";
import getproduct from "../../graphql/getProduct.graphql";

interface Props {
  product: OrderItem;
}

const CSS_HANDLES = [
  "productWrapper",
  "productImageColumn",
  "productImageWrapper",
  "productInfoColumn",
  "productName",
  "productMeasurementUnit",
  "productQuantity",
  "productPrice",
  "energyLabelSrc",
  "imageContainer",
  "productInformationSheet",
  "linksContainer",
  "nameAndEnergy"
];

const Product: FC<Props> = ({ product }) => {
  const { data } = useQuery(getproduct, {
    variables: { identifier: { field: "id", value: product.productId } },
  });
  useEffect(() => {}, [data]);
  const energyLabelSrc = data?.product?.specificationGroups
    ?.find((spec: any) => spec.name == "EnergyLogo")
    ?.specifications?.find((spec: any) => spec.name == "EnergyLogo_image")?.values[0];
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
    // listPrice,
    price,
    quantity,
    unitMultiplier,
    isGift,
  } = product;
  const handles = useCssHandles(CSS_HANDLES);
  const showMeasurementUnit = unitMultiplier !== 1 || measurementUnit !== "un";
  const productSubtotal = price * quantity * unitMultiplier;
  return (
    <div className={`${handles.productWrapper} w-100 flex-m tc tl-m`}>
      <div className={`${handles.productImageColumn} w-60 flex-m mb6-s mb0-m`}>
        <div className={`${handles.productImageWrapper} w4 h4`}>
          <ProductImage url={imageUrl} alt={name} />
        </div>
        <div className={`${handles.nameAndEnergy}`}>

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
      <div className={handles.linksContainer}>
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
            id="store/products.pds"
          />
          </Link>
        ) : null}
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
  );
};

export default Product;
