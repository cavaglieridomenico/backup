import React, { FC, Fragment } from "react";
import { ProductImage } from "vtex.order-details";
import { Link } from 'vtex.render-runtime'
import FormattedPrice from "../FormattedPrice";
import AttachmentAccordion from "./AttachmentAccordion";
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useQuery } from "react-apollo";

import getproduct from "../../graphql/getProduct.graphql";

interface Props {
  product: OrderItem;
}

let deliveryService = {
  id: "1",
  attachments: [],
  name: "Consegna a domicilio",
  price: 0,
  quantity: 1,
  imageUrl: null,
  measurementUnit: "un",
  unitMultiplier: 1,
  __typename: "BundleItem",
};
let garantieService = {
  id: "2",
  attachments: [],
  name: "2 anni di garanzia",
  price: 0,
  quantity: 1,
  imageUrl: null,
  measurementUnit: "un",
  unitMultiplier: 1,
  __typename: "BundleItem",
};

const CSS_HANDLES = ['sectionTitle', 'fgasContainer', 'fgasLink', 'fgasPdf', 'rightArrow', 'fgasText']

const isAccessoryFromSku = (skuName: any) => {
if (skuName.toLowerCase().charAt(0) == 'c' || skuName.charAt(0) == '4') {
  return true
} else {
  return false
}
}
const removeBundlePrefix = (bundleName: string) => {
  return bundleName.replace("O2P_",'').replace("EPP_",'').replace("VIP_",'').replace("FF_",'')
}
const checkBundleItems = async (product: any) => {
  let { bundleItems, skuName } = product;
  console.log("This is bundleItems: %o", bundleItems)
  let hasDelivery = false;
  let hasGarantie = false;

  bundleItems.forEach((item: any) => {
    console.log("this is item: %o", item.name)
    let bundleName = removeBundlePrefix(item.name)

        if (bundleName === "Consegna a domicilio") hasDelivery = true;
        if (bundleName === "RD VS avec un expert pour la découverte de produit") bundleName = "Service Expert";
        if (
          bundleName === "2 anni di garanzia" ||
          bundleName === "5 ans de garantie sur votre appareil"
        )
          hasGarantie = true;
      });
      if (hasDelivery === false) bundleItems.push(deliveryService);
      if (hasGarantie === false && isAccessoryFromSku(skuName) === false) bundleItems.unshift(garantieService);
};
const BundleItems: FC<Props> = ({ product }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data } = useQuery(getproduct, {
    variables: { identifier: { field: "id", value: product.productId } },
  });
  checkBundleItems(product); //async
const fgas =  data?.product?.properties?.find((spec: any) => spec.name == "fgas")?.values[0];
  return (
    <Fragment>
        <div className={`${handles.sectionTitle}`}> <FormattedMessage
          id="store/product.included-services" /></div>
      {product.bundleItems.map((bundleItem: any) => {
        const isMessage = bundleItem?.attachments?.[0]?.name === "message";
        const content = isMessage
          ? [bundleItem.attachments[0].content.text]
          : ([] as string[]).concat(
              ...bundleItem.attachments.map((attachmentItem: any) => {
                return Object.keys(attachmentItem.content).map(
                  (key) => `${key}: ${attachmentItem.content[key]}`
                );
              })
            );
        return (
          <AttachmentAccordion
            key={bundleItem.id}
            beforeTitleLabel={
              bundleItem.imageUrl && (
                <ProductImage url={bundleItem.imageUrl} alt={removeBundlePrefix(bundleItem.name)} />
              )
            }
            titleLabel={removeBundlePrefix(bundleItem.name)}
            toggleLabel={
              bundleItem.price > 0 ? (
                <FormattedPrice value={bundleItem.price} />
              ) : (
                React.createElement(
                  "span",
                  { style: { color: "#0d436b", fontWeight: "bold" } },
                  "Gratuito"
                )
              )
            }
            content={content}
          />

        );
      })}
      { fgas == 'false' ?
      <div className={`${handles.fgasContainer}`}>
        <p className={`${handles.fgasText}`}>
          <FormattedMessage id="store/product.fgasTextPreLink" />
          <span><a className={`${handles.fgasLink}`} href="mailto:directsalesonline@whirlpool.com"><FormattedMessage id="store/product.fgasLink" /></a></span><FormattedMessage id="store/product.fgasTextAfterLink" /><span className={`${handles.rightArrow}`}>&gt;</span><FormattedMessage id="store/product.fgasFinalText" />
        </p>
        <Link to="https://itccwhirlpool.myvtex.com/api/dataentities/AT/documents/c8edebf5-3a48-11ed-83ab-0ef896f778b5/file/attachments/FGAS%20Clima.pdf" target="_blank">
          <img className={`${handles.fgasPdf}`} src="/arquivos/f-gas-pdf-image.png"/>
        </Link>
      </div> : null
      }
    </Fragment>
  );
};

export default BundleItems;
