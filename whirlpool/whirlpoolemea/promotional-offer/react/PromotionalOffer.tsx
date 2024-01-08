import React from "react";
import { useProduct } from "vtex.product-context";
import { index as RichText } from "vtex.rich-text";

type CollectionItem = {
  collectionId: string;
  label: string;
};
type PromotionProps = {
  collectionsList: Array<CollectionItem>;
  elementsToShow: number;
};

const PromotionalOffer: StorefrontFunctionComponent<PromotionProps> = ({
  collectionsList = [],
  elementsToShow = 1,
}: PromotionProps) => {
  const productContext = useProduct();
  const productClusters = productContext?.product?.productClusters;
  let activeCollectionsList: Array<CollectionItem> = [];
  if (productClusters && productClusters.length && collectionsList.length) {
    const collectionIds = productClusters.map((el: any) => el.id);
    activeCollectionsList = collectionsList.filter((el) =>
      collectionIds.includes(el.collectionId)
    );
    const lastItemToShow =
      elementsToShow >= activeCollectionsList.length
        ? activeCollectionsList.length
        : elementsToShow;
    activeCollectionsList = activeCollectionsList.slice(0, lastItemToShow);
  }
  return (
    <div>
      {activeCollectionsList.map((el: CollectionItem, key: number) => (
        <RichText key={key} text={el.label} title="label offer" />
      ))}
    </div>
  );
};

export default PromotionalOffer;

PromotionalOffer.schema = {
  title: "Promotion offer",
  description: "You can put the list of collections and their related pdf link",
  type: "object",
  properties: {
    elementsToShow: {
      title: "Number of elements to display",
      type: "number",
      default: 1,
    },
    collectionsList: {
      title: "List of collections",
      type: "array",
      items: {
        title: "Collection item",
        properties: {
          label: {
            title: "Label of the promotion",
            type: "string",
          },
          collectionId: {
            title: "ID of collection",
            type: "string",
          },
        },
      },
    },
  },
};
