import React, { useState } from "react";
import style from "./style.css";
import { crossSvg, menuSvg, backArrow, forwardArrow } from "./vectors/vectors";
import { CatalogMenuProps } from "./typings/menu";
import { Collapsible } from "vtex.styleguide";
import { usePixel } from "vtex.pixel-manager";

const MobileCatalog: StorefrontFunctionComponent<CatalogMenuProps> = ({
  catalogLabel = "",
  items = [],
  children,
}) => {
  const { push } = usePixel();
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const drawerIcon = Buffer.from(menuSvg).toString("base64");
  const arrowIcon = Buffer.from(backArrow).toString("base64");
  const arrowNxtIcon = Buffer.from(forwardArrow).toString("base64");
  const closeIcon = Buffer.from(crossSvg).toString("base64");

  const hamburgerToggle = () => {
    setIsCatalogVisible(!isCatalogVisible),
      (document.body.style.overflow = isCatalogVisible ? "scroll" : "hidden"),
      push({
        event: "filterBurgerInteraction",
        action: !isCatalogVisible ? "open" : "close",
      });
  };

  return (
    <>
      {/* ---------- Drawer Icon -----------*/}
      <div className={style.catlogButtonDiv}>
        <button className={style.catlogButton} onClick={hamburgerToggle}>
          <img
            src={`data:image/svg+xml;base64,${drawerIcon}`}
            className={style.buttonImage}
          />
        </button>
      </div>
      <div
        className={style.catalogMenuContainer}
        style={isCatalogVisible ? { height: "100vh" } : { height: "0" }}
      >
        {/* ---------- Menu container -----------*/}
        <div
          className={style.catalogMenuLeftMobile}
          style={isCatalogVisible ? { height: "100vh" } : { height: "0" }}
        >
          <div
            className={style.catlogueCloseMobileContainer}
            onClick={hamburgerToggle}
          >
            <img
              src={`data:image/svg+xml;base64,${closeIcon}`}
              className={style.closeIcon}
            />
          </div>
          <div className={style.collapsibleContainer}>
            <Collapsible
              header={
                <div className={style.catlogueTitleMobile}>
                  <span className={style.catalogueTitleLabel}>
                    {catalogLabel}
                  </span>
                  <img
                    src={`data:image/svg+xml;base64,${arrowIcon}`}
                    className={style.accordionArrowIcon}
                    style={
                      isOpened
                        ? { transform: "rotate(270deg)" }
                        : { transform: "rotate(180deg)" }
                    }
                    alt="close icon"
                  />
                </div>
              }
              onClick={() => setIsOpened(!isOpened)}
              isOpen={isOpened}
              caretColor="base"
              align="right"
            >
              <div className={style.accordionMenuContainer}>
                {items?.map((item: any, index: number) => (
                  <div key={index} className={style.leftMenuLabel}>
                    <a
                      href={item.itemLink != "" ? item.itemLink : null}
                      className={style.linkCatalogueLabel}
                    >
                      {item.ImageAsTitle != "" ? (
                        <img
                          src={item.ImageAsTitle}
                          className={style.itemTitleImage}
                        />
                      ) : (
                        <p className={style.labelP}>{item.itemTitle}</p>
                      )}
                    </a>
                    <img
                      src={`data:image/svg+xml;base64,${arrowNxtIcon}`}
                      className={style.accordionArrowIconCategories}
                      alt="close icon"
                    />
                  </div>
                ))}
              </div>
            </Collapsible>
          </div>
          <div className={style.childrenContainer}>{children}</div>
        </div>
      </div>
    </>
  );
};

MobileCatalog.schema = {
  title: "[MOBILE] Custom Catalog Menu",
  description: "All catalog menu settings",
  type: "object",
  properties: {
    catalogLabel: {
      title: "Catalog Label",
      description: "This is the catalog label",
      default: "Shop all appliances",
      type: "string",
    },
    items: {
      type: "array",
      title: "Appliances Items",
      items: {
        title: "Item menu",
        properties: {
          itemTitle: {
            title: "ItemTitle",
            type: "string",
          },
          itemLink: {
            title: "ItemLink",
            type: "string",
          },
        },
      },
    },
  },
};

export default MobileCatalog;
