import React from "react";
import style from "../style.css";
import { Items } from "../typings/desktopMenu";

const BrandsMenu: StorefrontFunctionComponent = ({ brand }) => {
  return (
    <>
      {brand?.items?.map((category: Items) => (
        <div className={style.itemsContainer}>
          <h2 className={`${style.itemTitle} ${style.itemTitleBrand}`}>
            {category.itemTitle}
          </h2>
          <div
            className={
              category.items && category.items?.length > 3
                ? style.subItemTitleContainerColumns
                : style.subItemTitleContainer
            }
          >
            {category?.items?.map((subCategory: Items) => (
              <a
                href={subCategory?.itemLink}
                className={style.subItemTitleLink}
              >
                <span
                  className={`${style.subItemTitle} ${style.subItemTitleBrand}`}
                >
                  {subCategory.itemTitle}
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
