import React from "react";
import style from "../style.css";
import { Items } from "../typings/desktopMenu";
import { usePixel } from "vtex.pixel-manager";

const BrandsMenu: StorefrontFunctionComponent = ({
  brand,
  brandColMaxItem,
  lang,
}) => {
  if (brandColMaxItem == undefined) {
    brandColMaxItem = 3;
  }

  const { push } = usePixel();

  const handleGaEvents = (linkUrl: string, linkText: string) => {
    push({
      event: "menu_footer_click",
      linkUrl: linkUrl,
      linkText: linkText,
      clickArea: "menu",
    });
  };

  /* Get linkText for menu_footer_click event */
  const getGaLabel = (subCategory: any) => {
    return lang == "_en" ? subCategory?.itemTitle : subCategory?.itemTitle_lang;
  };

  return (
    <>
      {brand?.items?.map((category: Items) => (
        <div className={style.itemsContainer}>
          <h2 className={`${style.itemTitle} ${style.itemTitleBrand}`}>
            {/* {category.itemTitle} */}
            {lang == "_en" ? category.itemTitle : category.itemTitle_lang}
          </h2>
          <div
            className={
              category.items && category.items?.length > brandColMaxItem
                ? style.subItemTitleContainerColumns
                : style.subItemTitleContainer
            }
          >
            {category?.items?.map((subCategory: Items) => (
              <a
                href={subCategory?.itemLink}
                className={style.subItemTitleLink}
                onClick={() =>
                  handleGaEvents(subCategory?.itemLink, getGaLabel(subCategory))
                }
              >
                <span
                  className={`${style.subItemTitle} ${style.subItemTitleBrand}`}
                >
                  {/* {subCategory.itemTitle} */}
                  {lang == "_en"
                    ? subCategory.itemTitle
                    : subCategory.itemTitle_lang}
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default BrandsMenu;
