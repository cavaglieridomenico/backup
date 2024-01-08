import React, { FC, Fragment } from "react";
import { ProductImage } from "vtex.order-details";

import FormattedPrice from "../FormattedPrice";
import AttachmentAccordion from "./AttachmentAccordion";

interface Props {
  product: OrderItem;
}

let deliveryService = {
  id: "1",
  attachments: [],
  name: "Livraison à domicile",
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
  name: "2 ans de garantie",
  price: 0,
  quantity: 1,
  imageUrl: null,
  measurementUnit: "un",
  unitMultiplier: 1,
  __typename: "BundleItem",
};


const isAccessoryFromSku = (skuName: any) => {
if (skuName.toLowerCase().charAt(0) == 'c' || skuName.charAt(0) == '4') {
  return true
} else {
  return false
}
}

const checkBundleItems = async (product: any) => {
  let { bundleItems, skuName } = product;
      let hasDelivery = false;
      let hasGarantie = false;

      bundleItems.forEach((item: any) => {
        if (item.name === "Livraison à domicile") hasDelivery = true;
        if (item.name === "RD VS avec un expert pour la découverte de produit") item.name = "Service Expert";
        if (
          item.name === "2 ans de garantie" ||
          item.name === "5 ans de garantie sur votre appareil"
        )
          hasGarantie = true;
      });
      if (hasDelivery === false) bundleItems.push(deliveryService);
      if (hasGarantie === false && isAccessoryFromSku(skuName) === false) bundleItems.unshift(garantieService);
};
const BundleItems: FC<Props> = ({ product }) => {
  checkBundleItems(product); //async
  return (
    <Fragment>
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
                <ProductImage url={bundleItem.imageUrl} alt={bundleItem.name} />
              )
            }
            titleLabel={bundleItem.name}
            toggleLabel={
              bundleItem.price > 0 ? (
                <FormattedPrice value={bundleItem.price} />
              ) : (
                React.createElement(
                  "span",
                  { style: { color: "#edb112", fontWeight: "bold" } },
                  "Inclus"
                )
              )
            }
            content={content}
          />
        );
      })}
    </Fragment>
  );
};

export default BundleItems;
