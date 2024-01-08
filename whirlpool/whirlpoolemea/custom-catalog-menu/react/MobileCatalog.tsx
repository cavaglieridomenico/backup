import React, { useState, useEffect } from "react";
import style from "./style.css";
import { useRuntime } from "vtex.render-runtime";
import { menuSvg, forwardArrow, crossSvgBlack } from "./vectors/vectors";
import { CatalogMenuProps } from "./typings/menu";
//import { Collapsible } from "vtex.styleguide";
import { usePixel } from "vtex.pixel-manager";

interface WindowRuntime extends Window {
  __RUNTIME__: any;
}

const MobileCatalog: StorefrontFunctionComponent<CatalogMenuProps> = ({
  // catalogLabel = "",
  // catalogLabel_lang = "",
  supportMenuLink = "",
  supportMenuLabel = "",
  weekDealsLink = "",
  weekDealsLabel = "",
  items = [],
  // showSubCategoryArrow = true,
  children,
}) => {
  //Binding fix in CMS--> If not production and not myvtex.com environment => append binding to avoid redirect to default binding in CMS
  const { production } = useRuntime();
  const {
    binding: { canonicalBaseAddress },
  } = useRuntime();
  const runtime = (window as unknown as WindowRuntime).__RUNTIME__;
  const assetServerLinkedHost = runtime?.assetServerLinkedHost;

  const isCMS = assetServerLinkedHost?.indexOf("myvtex.com") >= 1;
  const urlToAddToKeepBinding = `?__bindingAddress=${canonicalBaseAddress}`;

  const { push } = usePixel();
  //const [isOpened, setIsOpened] = useState(false);
  const {
    culture: { locale },
  } = useRuntime();

  const drawerIcon = Buffer.from(menuSvg).toString("base64");
  //const arrowIcon = Buffer.from(backArrow).toString("base64");
  const arrowNxtIcon = Buffer.from(forwardArrow).toString("base64");
  const closeIcon = Buffer.from(crossSvgBlack).toString("base64");
  const lang = locale == "it-IT" ? "_it" : "_en";
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);

  const hamburgerToggle = () => {
    setIsCatalogVisible(!isCatalogVisible),
      (document.body.style.overflow = isCatalogVisible ? "scroll" : "hidden"),
      push({
        event: "drawerInteraction",
        action: !isCatalogVisible ? "open" : "close",
      });
  };

  useEffect(() => {
    setIsCatalogVisible(false);
    if (document?.body?.style?.overflow) {
      document.body.style.overflow = "scroll";
    }
  }, [window?.location?.href]);

  const handleGaEvents = (linkUrl: string, linkText: string) => {
    push({
      event: "menu_footer_click",
      linkUrl: linkUrl,
      linkText: linkText,
      clickArea: "menu",
    });
  };

  /* Get linkUrl for menu_footer_click event */
  const getGaLink = (itemLink: string) => {
    return isCMS && production
      ? `${itemLink}${urlToAddToKeepBinding}`
      : itemLink;
  };
  /* Get linkText for menu_footer_click event */
  const getGaLabel = (subCategory: any) => {
    return lang == "_en" ? subCategory?.itemTitle : subCategory?.itemTitle_lang;
  };

  return (
    <>
      {/* ---------- Drawer Icon -----------*/}
      <div className={style.catlogButtonDiv}>
        <button className={style.catlogButton} onClick={hamburgerToggle}>
          <img
            src={isCatalogVisible ? `data:image/svg+xml;base64,${closeIcon}` : `data:image/svg+xml;base64,${drawerIcon}`}
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
          {/* <div
            className={style.catlogueCloseMobileContainer}
            onClick={hamburgerToggle}
          >
            <img
              src={`data:image/svg+xml;base64,${closeIcon}`}
              className={style.closeIcon}
            />
          </div> */}
          <div className={style.collapsibleContainer}>
            {/* <Collapsible
              header={
                <div className={style.catlogueTitleMobile}>
                  <span className={style.catalogueTitleLabel}>
                    {lang == "_en" ? catalogLabel : catalogLabel_lang}
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
            > */}
            <div className={style.accordionMenuContainer}>
              {items?.map((item: any, index: number) => (
                <div key={index} className={style.leftMenuLabel}>
                  <a
                    href={
                      isCMS && production && item.itemLink != ""
                        ? `${item?.itemLink}${urlToAddToKeepBinding}`
                        : item?.itemLink
                    }
                    className={style.linkCatalogueLabel}
                    onClick={() =>
                      handleGaEvents(
                        getGaLink(item.itemLink),
                        item.ImageAsTitle != "" ? "" : getGaLabel(item)
                      )
                    }
                  >
                    {item.ImageAsTitle != "" ? (
                      <img
                        src={item.ImageAsTitle}
                        className={style.itemTitleImage}
                      />
                    ) : (
                      <div className={style.contentLink}>
                        <p className={style.labelP}>
                          {lang === "_en"
                            ? item.itemTitle
                            : item.itemTitle_lang}
                        </p>
                        <img
                          src={`data:image/svg+xml;base64,${arrowNxtIcon}`}
                          className={style.accordionArrowIconCategories}
                          alt="close icon"
                        />
                      </div>
                    )}
                  </a>
                  {/* {showSubCategoryArrow &&
                    <img
                      src={`data:image/svg+xml;base64,${arrowNxtIcon}`}
                      className={style.accordionArrowIconCategories}
                      alt="close icon"
                    />} */}
                </div>
              ))}
            </div>
            {/* </Collapsible> */}
            {/* ---------- Weeks Days -----------*/}
            <div className={style.weekDealsContainerMobile}>
              <a href={weekDealsLink} className={style.weekDealsLinkMobile}>
                {weekDealsLabel}
              </a>
            </div>
            {/* ---------- Support -----------*/}
              <div className={style.supportMenuContainer}>
              <a href={supportMenuLink} className={style.supportMenuLink}>
                {supportMenuLabel}
              </a>
            </div>
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
    // catalogLabel: {
    //   title: "Catalog Label english language",
    //   description: "This is the catalog label",
    //   default: "Shop all appliances",
    //   type: "string",
    // },
    // catalogLabel_lang: {
    //   title: "Catalog Label country language",
    //   description: "This is the catalog label",
    //   default: "Shop all appliances",
    //   type: "string",
    // },
    items: {
      type: "array",
      title: "Category Items",
      items: {
        title: "Item menu",
        properties: {
          itemTitle: {
            title: "ItemTitle english language",
            type: "string",
          },
          itemTitle_lang: {
            title: "ItemTitle second language",
            type: "string",
          },
          itemLink: {
            title: "ItemLink",
            type: "string",
          },
        },
      },
    },
    //Week deals
    weekDealsLabel: {
      title: "Week deals Label",
      type: "string",
      description: "Insert the week deals Label",
      default: "Label",
    },
    weekDealsLink: {
      title: "Week deals Link",
      type: "string",
      description: "Insert the week deals Link",
      default: "#",
    },
    //Support Menu
    supportMenuLabel: {
      title: "Button Label",
      type: "string",
      description: "Insert the support button Label",
      default: "Support",
    },
    supportMenuLink: {
      title: "Button Link",
      type: "string",
      description: "Insert the support button Link",
      default: "#",
    },
  },
};

export default MobileCatalog;
