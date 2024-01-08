import React from "react";
import style from "../style.css";
import { Items } from "../typings/desktopMenu";

const AppliancesMenu: StorefrontFunctionComponent = ({ category }) => {
  console.log(category, "category");
  return (
    <>
      <div
        className={`${style.itemsContainer} ${style.itemsContainerAppliances}`}
      >
        {category.ImageAsTitle ? (
          <a href={category?.itemLink} className={style.itemTitleImageLink}>
            <img src={category.ImageAsTitle} className={style.itemTitleImage} />
          </a>
        ) : (
          <>
            <h2 className={style.itemTitle}>{category.itemTitle}</h2>
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
                  <span className={style.subItemTitle}>
                    {subCategory.itemTitle}
                  </span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AppliancesMenu;
