import React from "react";
import { useRuntime } from "vtex.render-runtime";
import DesktopFooter from "./components/DesktopFooter";
import MobileFooter from "./components/MobileFooter";
import style from "./style.css";
import { Item } from "./typings/items";

interface FooterCustomProps {
  items: Item[];
}

const footerCustom: StorefrontFunctionComponent<FooterCustomProps> = ({
  items,
  children,
}) => {
  const {
    deviceInfo: { isMobile },
  } = useRuntime();

  return (
    <div className={style.footerCustomContainer}>
      {!isMobile ? (
        /* ---------- Desktop Footer Menu -----------*/
        <DesktopFooter items={items} children={children} />
      ) : (
        /* ---------- Mobile Footer Menu -----------*/
        <MobileFooter items={items} />
      )}
    </div>
  );
};

footerCustom.schema = {
  title: "footerCustom items",
  description: "editor.basicblock.description",
  type: "object",
  properties: {
    items: {
      type: "array",
      title: "Items",
      items: {
        title: "Item menu",
        properties: {
          itemTitle: {
            title: "ItemTitle",
            type: "string",
          },
          hasImages: {
            title: "has images",
            type: "boolean",
            default: false,
          },
          subItems: {
            title: "SubItems",
            type: "array",
            items: {
              title: "subItems",
              properties: {
                itemTitle: {
                  title: "ItemTitle",
                  type: "string",
                },
                itemLink: {
                  title: "ItemLink",
                  type: "string",
                },
                isOneTrustLink: {
                  title: "isOneTrustLink",
                  type: "boolean",
                  default: false,
                },
                isExternalLink: {
                  title: "isExternalLink",
                  type: "boolean",
                  default: false,
                },
              },
            },
          },
        },
      },
    },
  },
};

export default footerCustom;
