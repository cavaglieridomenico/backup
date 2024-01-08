import React, { useState } from "react";
import style from "../style.css";
import { crossSvg, menuSvg, backArrow } from "../vectors/vectors";
import { usePixel } from "vtex.pixel-manager";

interface MobileCatalogProps {
  catalogLabel: string;
  items: any;
  images: any;
  productCategories: any;
  accessoryCategories: any;
}

const guessClass = (url: String) => {
  let styleClass = style.brandLogo;

  if (url.includes("KA")) styleClass = style.brandLogoKa;
  if (url.includes("wpro")) styleClass = style.brandLogoWpro;
  if (url.includes("hotpoint")) styleClass = style.brandLogoHotpoint;

  return styleClass;
};
const MobileCatalog: StorefrontFunctionComponent<MobileCatalogProps> = ({
  catalogLabel = "",
  items = [],
  images = [],
  productCategories,
  accessoryCategories,
}) => {
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);
  const [isActive, setIsActive] = useState({
    index: 0,
    clicked: false,
  });
  const svgBase64 = Buffer.from(isCatalogVisible ? crossSvg : menuSvg).toString(
    "base64"
  );
  const backArrowSvg = Buffer.from(backArrow).toString("base64");
  const { push } = usePixel();

  const hamburgerToggle = () => {
    setIsCatalogVisible(!isCatalogVisible),
      (document.body.style.overflow = isCatalogVisible ? "scroll" : "hidden"),
      push({
        event: "filterBurgerInteraction",
        action: !isCatalogVisible ? "open" : "close",
      });
  };

  const handleGaEvents = (linkUrl: string, linkText: string) => {
    push({
      event: "menu_footer_click",
      linkUrl: linkUrl,
      linkText: linkText,
      clickArea: "menu",
    });
  };

  return (
    /* ---------- Mobile Catalog Menu -----------*/
    <>
      <div className={style.catlogButtonDiv}>
        <button className={style.catlogButton} onClick={hamburgerToggle}>
          <img
            src={`data:image/svg+xml;base64,${svgBase64}`}
            className={style.buttonImage}
          />
        </button>
      </div>
      <div
        className={style.catalogMenuContainer}
        style={
          isCatalogVisible
            ? { height: "100vh" }
            : { height: "0", transitionDelay: "0.5s" }
        }
      >
        <div
          className={style.catalogMenuLeftMobile}
          style={isCatalogVisible ? { height: "100vh" } : { height: "0" }}
        >
          <div className={style.catlogueTitleMobile}>
            <h2 className={style.catalogueTitleLabel}>{catalogLabel}</h2>
          </div>
          {items?.map((item: any, index: number) => (
            <div
              key={item.itemTitle}
              className={style.leftMenuLabel}
              onClick={() =>
                !item.itemLink || item.itemLink != ""
                  ? setIsActive({ index: index, clicked: true })
                  : null
              }
            >
              <a
                href={item.itemLink != "" ? item.itemLink : null}
                onClick={() => handleGaEvents(item.itemLink, item.itemTitle)}
              >
                <p className={style.labelP}>{item.itemTitle}</p>
              </a>
            </div>
          ))}
          <div className={style.brandContainer}>
            <div className={style.brandRow}>
              {images?.map((image: any, index: number) => (
                <a
                  href={image.imageLink}
                  className={
                    index == 0 || index == 1
                      ? style.imageLinkConatiner
                      : undefined
                  }
                  onClick={() => handleGaEvents(image.imageLink, "")}
                >
                  <img
                    src={image.imageUrl}
                    className={guessClass(image.imageUrl)}
                  />
                </a>
              ))}
            </div>
          </div>
          <div className={style.emptyContainer}></div>
        </div>
        <div
          className={
            isActive.clicked
              ? style.subMenuDivMobileOpened
              : style.subMenuDivMobile
          }
        >
          <div className={style.subMenuContainerMobile}>
            <div className={style.leftColumnMobile}>
              <img
                src={`data:image/svg+xml;base64,${backArrowSvg}`}
                className={style.buttonImageBack}
                onClick={() => setIsActive({ ...isActive, clicked: false })}
              />
            </div>
            <div className={style.rightColumnMobile}>
              <div className={style.rightColumnTitleWrapper}>
                <h2 className={style.catalogSubTitleMobile}>
                  {items[isActive.index]?.itemTitle}
                </h2>
              </div>
              {items[isActive.index]?.categorySelection != "Products" &&
              items[isActive.index]?.categorySelection != "Accessories" ? (
                <div className={style.rightColumnItemsWrapper}>
                  {items[isActive.index]?.itemGroups?.map(
                    (group: any, index: number) => (
                      <div key={index} className={style.subItemDiv}>
                        <a
                          href={group.itemLink}
                          className={style.groupItemLink}
                          onClick={() =>
                            handleGaEvents(group.itemLink, group.itemTitle)
                          }
                        >
                          <span className={style.groupItemTitle}>
                            {group.itemTitle}
                          </span>
                        </a>
                        <div className={style.subItemGroupDiv}>
                          {group.subItems?.map(
                            (subItem: any, index: number) => (
                              <a
                                key={index}
                                href={subItem.itemLink}
                                onClick={() =>
                                  handleGaEvents(
                                    subItem.itemLink,
                                    subItem.itemTitle
                                  )
                                }
                              >
                                <span className={style.subItemLabel}>
                                  {subItem.itemTitle}
                                </span>
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                  <div className={style.catalogImagesDiv}>
                    {items[isActive.index]?.hasBrandImages &&
                      images?.map((image: any, index: number) => (
                        <a
                          key={index}
                          href={image.imageLink}
                          className={style.catalogImagesLink}
                          onClick={() => handleGaEvents(image.imageLink, "")}
                        >
                          <img
                            src={image.imageUrl}
                            alt=""
                            className={style.catalogImages}
                          />
                        </a>
                      ))}
                  </div>
                </div>
              ) : items[isActive.index]?.categorySelection == "Products" ? (
                <div className={style.subMenuDivCategory}>
                  {productCategories?.children.map(
                    (category: any, index: number) => (
                      <div key={index} className={style.categoryDiv}>
                        {category?.children?.length == 0 ||
                        (category?.children?.length == 1 &&
                          category?.children[0]?.name == category.name) ? (
                          <a
                            href={category.href}
                            onClick={() =>
                              handleGaEvents(category.href, category.name)
                            }
                          >
                            <span className={style.subItemLabelTitle}>
                              {category.name}
                            </span>
                          </a>
                        ) : (
                          <>
                            <span className={style.subItemLabelTitle}>
                              {category.name}
                            </span>
                            <div className={style.subCategoryDiv}>
                              {category.children.map(
                                (subCat: any, index: number) => (
                                  <a
                                    key={index}
                                    className={style.subCategoryLink}
                                    href={subCat.href}
                                    onClick={() =>
                                      handleGaEvents(subCat.href, subCat.name)
                                    }
                                  >
                                    <span className={style.subCategoryText}>
                                      {subCat.name}
                                    </span>
                                  </a>
                                )
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className={style.subMenuDivCategory}>
                  {accessoryCategories?.children.map(
                    (category: any, index: number) => (
                      <div key={index} className={style.categoryDiv}>
                        {category.children.length == 0 ||
                        (category.children.length == 1 &&
                          category.children[0].name == category.name) ? (
                          <a
                            href={category.href}
                            onClick={() =>
                              handleGaEvents(category.href, category.name)
                            }
                          >
                            <span className={style.subItemLabelTitle}>
                              {category.name}
                            </span>
                          </a>
                        ) : (
                          <>
                            <span className={style.subItemLabelTitle}>
                              {category.name}
                            </span>
                            <div className={style.subCategoryDiv}>
                              {category.children.map(
                                (subCat: any, index: number) => (
                                  <a
                                    key={index}
                                    className={style.subCategoryLink}
                                    href={subCat.href}
                                    onClick={() =>
                                      handleGaEvents(subCat.href, subCat.name)
                                    }
                                  >
                                    <span className={style.subCategoryText}>
                                      {subCat.name}
                                    </span>
                                  </a>
                                )
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

MobileCatalog.schema = {};

export default MobileCatalog;
