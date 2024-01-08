import React from "react";
import style from "../style.css";
import { Items } from "../typings/desktopMenu";
import { useRuntime } from "vtex.render-runtime";
import { usePixel } from "vtex.pixel-manager";

interface WindowRuntime extends Window {
  __RUNTIME__: any;
}
const AppliancesMenu: StorefrontFunctionComponent = ({
  category,
  appliancesColMaxItem = 3,
  lang,
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
    <div className={style.itemsContainer}>
      {category.ImageAsTitle ? (
        <a
          href={category?.itemLink}
          className={style.itemTitleImageLink}
          onClick={() => handleGaEvents(category?.itemLink, "")}
        >
          <img src={category.ImageAsTitle} className={style.itemTitleImage} />
        </a>
      ) : (
        <>
          <h2 className={style.itemTitle}>
            {lang == "_en" ? category.itemTitle : category.itemTitle_lang}
          </h2>
          <div
            className={
              category.items && category.items?.length > appliancesColMaxItem
                ? style.subItemTitleContainerColumns
                : style.subItemTitleContainer
            }
          >
            {category?.items?.map((subCategory: Items) => (
              <a
                href={
                  isCMS && production
                    ? `${subCategory?.itemLink}${urlToAddToKeepBinding}`
                    : subCategory?.itemLink
                }
                className={style.subItemTitleLink}
                onClick={() =>
                  handleGaEvents(
                    getGaLink(subCategory?.itemLink),
                    getGaLabel(subCategory)
                  )
                }
              >
                <span className={style.subItemTitle}>
                  {lang == "_en"
                    ? subCategory.itemTitle
                    : subCategory.itemTitle_lang}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AppliancesMenu;
