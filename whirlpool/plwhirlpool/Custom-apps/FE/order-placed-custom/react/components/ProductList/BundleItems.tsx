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

        if (bundleName === "Livraison à domicile") hasDelivery = true;
        if (bundleName === "RD VS avec un expert pour la découverte de produit") bundleName = "Service Expert";
        if (
          bundleName === "2 ans de garantie" ||
          bundleName === "5 ans de garantie sur votre appareil"
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
