import React, { useState } from "react";
import style from "../style.css";
import { crossSvg, menuSvg } from "../vectors/vectors";
import { usePixel } from "vtex.pixel-manager";

interface DesktopCatalogProps {
  catalogLabel: string;
  items: any;
  productCategories: any;
  accessoryCategories: any;
  images: any;
}

const DesktopCatalog: StorefrontFunctionComponent<DesktopCatalogProps> = ({
  catalogLabel,
  items,
  images,
  productCategories,
  accessoryCategories,
}) => {
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(0);
  const svgBase64 = Buffer.from(isCatalogVisible ? crossSvg : menuSvg).toString(
    "base64"
  );
  const { push } = usePixel();

  const handleGaEvents = (linkUrl: string, linkText: string) => {
    push({
      event: "menu_footer_click",
      linkUrl: linkUrl,
      linkText: linkText,
      clickArea: "menu",
    });
  };

  return (
    <>
      {/* ---------- Catalog title -----------*/}
      <div className={style.catlogButtonDiv}>
        <button
          className={style.catlogButton}
          onClick={() => {
            setIsCatalogVisible(!isCatalogVisible),
              (document.body.style.overflow = isCatalogVisible
                ? "scroll"
                : "hidden");
          }}
        >
          <img
            src={`data:image/svg+xml;base64,${svgBase64}`}
            className={style.buttonImage}
          />
          {catalogLabel}
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
        {/* ---------- Catalog left part -----------*/}
        <div
          className={style.catalogMenuLeft}
          style={isCatalogVisible ? { height: "60%" } : { height: "0" }}
        >
          {items?.map(
            (
              item: any,
              index: number //(items)TO BE CHANGED when CMS works (items)
            ) => (
              <div
                key={item.itemTitle}
                className={
                  isHovered == index
                    ? style.leftMenuLabelHover
                    : style.leftMenuLabel
                }
                onMouseOver={() => setIsHovered(index)}
              >
                <a
                  href={item.itemLink}
                  onClick={() => handleGaEvents(item.itemLink, item.itemTitle)}
                >
                  <p className={style.labelP}>{item.itemTitle}</p>
                </a>
              </div>
            )
          )}
        </div>
        {/* ---------- Catalog right part -----------*/}
        <div
          className={style.catalogMenuRight}
          style={isCatalogVisible ? { height: "60%" } : { height: "0" }}
        >
          {items &&
          items[isHovered]?.categorySelection != "Products" &&
          items[isHovered]?.categorySelection != "Accessories" ? (
            <div className={style.subMenuDiv}>
              {items[isHovered]?.itemGroups?.map(
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
                      {group.subItems?.map((subItem: any, index: number) => (
                        <a
                          key={index}
                          href={subItem.itemLink}
                          onClick={() =>
                            handleGaEvents(subItem.itemLink, subItem.itemTitle)
                          }
                        >
                          <span className={style.subItemLabel}>
                            {subItem.itemTitle}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              )}
              <div className={style.catalogImagesDiv}>
                {items[isHovered]?.hasBrandImages &&
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
          ) : items && items[isHovered]?.categorySelection == "Products" ? (
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
    </>
  );
};

DesktopCatalog.schema = {};

export default DesktopCatalog;
