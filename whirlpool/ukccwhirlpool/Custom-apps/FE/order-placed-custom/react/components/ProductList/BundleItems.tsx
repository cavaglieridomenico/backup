import React, { FC, Fragment } from "react";
import { ProductImage } from "vtex.order-details";

import FormattedPrice from "../FormattedPrice";
import AttachmentAccordion from "./AttachmentAccordion";

interface Props {
  product: OrderItem;
}

const removeBundlePrefix = (bundleName: string) => {
  return bundleName.replace("O2P_", '').replace("EPP_", '').replace("VIP_", '').replace("FF_", '')
}

const BundleItems: FC<Props> = ({ product }) => {
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
