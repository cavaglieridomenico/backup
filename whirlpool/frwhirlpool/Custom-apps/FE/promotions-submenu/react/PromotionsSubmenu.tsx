import React from "react";
import Item from "./Item";
import style from "./style.css";
import { useDevice } from "vtex.device-detector";

interface PromotionsSubmenuProps {
  items: ItemProps[];
}

interface ItemProps {
  itemTitle: string;
  itemSubtitle: string;
  itemLink: string;
  itemIcon: string;
}

const PromotionsSubmenu: StorefrontFunctionComponent<PromotionsSubmenuProps> = ({
  items,
}) => {
  if (items.length == 0) {
    return null;
  }
  const { isMobile } = useDevice();

  const containerPadding = (children: any) => {
    if (isMobile) {
      return children;
    } else {
      return <div className={style.itemContainerDesk}>{children}</div>;
    }
  };

  const getWidth = (isMobile: boolean) => {
    if (isMobile) {
      return 100;
    }
    //caso minore di 3
    if (items.length < 3) {
      return 100 / items.length;
    } else {
      return 33.3;
    }
  };
  return (
    <div className={isMobile ? style.containerMobile : style.containerDesktop}>
      {containerPadding(
        items.map((item: ItemProps) => {
          return (
            <Item
              itemTitle={item.itemTitle}
              itemIcon={item.itemIcon}
              itemLink={item.itemLink}
              itemSubtitle={item.itemSubtitle}
              width={getWidth(isMobile)}
            />
          );
        })
      )}
    </div>
  );
};

PromotionsSubmenu.schema = {
  title: "PromotionsSubmenu",
  type: "object",
  properties: {
    items: {
      type: "array",
      title: "Items",
      items: {
        title: "Item menu",
        properties: {
          itemLink: {
            title: "ItemLink",
            type: "string",
          },
          itemTitle: {
            title: "ItemTitle",
            type: "string",
          },
          itemSubtitle: {
            title: "itemSubtitle",
            type: "string",
          },
          itemIcon: {
            title: "ItemIcon",
            type: "string",
          },
        },
      },
    },
  },
};

export default PromotionsSubmenu;
