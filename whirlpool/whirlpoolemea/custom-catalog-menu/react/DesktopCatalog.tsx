import React, { useState } from "react";
import style from "./style.css";
import { useCssHandles } from "vtex.css-handles";
import { useRuntime, Link } from "vtex.render-runtime";
import { menuSvgWhite, crossSvg } from "./vectors/vectors";
import { DesktopCatalogMenuProps } from "./typings/desktopMenu";
import AppliancesMenu from "./components/AppliancesMenu";
import BrandsMenu from "./components/BrandsMenu";

const CSS_HANDLES = [
  "brandsAndButtonContainer", 
  "catalogRow", 
  "catalogRowButton",
  "ShopAndCategoryContainer",
  "catalogButtonLink",
  "catalogButton",
  "catalogButtonLabel",
  "catalogButtonIconContainer",
  "brandsContainer",
  "weekDealsContainer",
  "catalogCategoriesContainer",
  "brandMenuCategoriesContainerItems",
  "brandMenuCategoriesContainer"
];

const DesktopCatalog: StorefrontFunctionComponent<DesktopCatalogMenuProps> = ({
  catalogLabel,
  catalogLabel_lang,
  catalogLabelLink,
  catalogLabelLink_lang,
  weekDealsLabel,
  weekDealsLink,
  items,
  brandItems,
  appliancesColMaxItem,
  brandColMaxItem,
  children
}) => {
  const {
    culture: { locale },
  } = useRuntime();
  const lang = locale == "it-IT" ? "_it" : "_en";
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);
  const [activeBrand, setActiveBrand] = useState<number | undefined>(undefined);
  const handles = useCssHandles(CSS_HANDLES);

  const menuIcon = Buffer.from(
    isCatalogVisible ? crossSvg : menuSvgWhite
  ).toString("base64");

  return (
    <div className={`${style.catalogRow} ${handles.catalogRow}`}>
      <div className={`${style.catalogRowButton} ${handles.catalogRowButton}`}>
        {children}
        <div className={`${style.brandsAndButtonContainer} ${handles.brandsAndButtonContainer}`}>
        <div className={`${style.ShopAndCategoryContainer} ${handles.ShopAndCategoryContainer}`}>
            {/* ---------- Catalog Button -----------*/}
          <Link to={lang == "_en" ? catalogLabelLink : catalogLabelLink_lang} className={`${style.catalogButtonLink} ${handles.catalogButtonLink}`}>
          <div
            className={`${style.catalogButton} ${handles.catalogButton}`}
            role="button"
            onMouseEnter={() => {
              setIsCatalogVisible(!isCatalogVisible);
            }}
            onMouseLeave={() => {
              setIsCatalogVisible(!isCatalogVisible);
            }}
          >
            <span className={`${style.catalogButtonLabel} ${handles.catalogButtonLabel}`}>
              {lang == "_en" ? catalogLabel : catalogLabel_lang}
            </span>
            <div className={`${style.catalogButtonIconContainer} ${handles.catalogButtonIconContainer}`}>
              <img
                src={`data:image/svg+xml;base64,${menuIcon}`}
                className={style.catalogButtonIcon}
                alt="menu-icon"
              />
            </div>
          </div>
          </Link>
          {/* ---------- Brand Images -----------*/}
          {/* <div className={style.brandsContainer}>
            {brandItems?.map((brand, index: number) => (
              <div
                className={`${activeBrand == index ? style.brandImageContainerActive : style.brandImageContainer}`}
                onMouseEnter={() => {
                  setIsCatalogVisible(false), setActiveBrand(index);
                }}
                onMouseLeave={() => setActiveBrand(undefined)}
              >
            <a href={brand.brandLink} className={style.brandImageLink}>
                <img
                  src={brand.brandImage}
                  alt="brand-image"
                  className={style.brandImage}
                />
              </a>
              </div>
            ))}
          </div> */}
          {/* ---------- Label Category -----------*/}
          <div className={`${style.brandsContainer} ${handles.brandsContainer}`}>
            {brandItems?.map((brand, index: number) => (
              <div
                className={`${activeBrand == index ? style.brandImageContainerActive : style.brandImageContainer}`}
              >
              <a href={brand.brandLink} className={style.brandCategoryLink}>
                {brand.categoryLabel} 
              </a>
              </div>
            ))}
          </div>
        </div>
          {/* ---------- Weeks Days -----------*/}
          {
            weekDealsLabel != "" ?
              <div className={`${style.weekDealsContainer} ${handles.weekDealsContainer}`}>
                <a href={weekDealsLink} className={style.weekDealsLink}>
                  {weekDealsLabel}
                </a>
              </div>
              : null
          }
        </div>
      </div>
      <div className={`${style.brandMenuCategoriesContainerItems} ${handles.brandMenuCategoriesContainerItems}`}>
      <div
        className={`${style.catalogCategoriesContainer} ${handles.catalogCategoriesContainer} ${isCatalogVisible ? style.catalogCategoriesContainerVisible : style.catalogCategoriesContainerHidden}`}
        onMouseEnter={() => {
          setIsCatalogVisible(true);
        }}
        onMouseLeave={() => {
          setIsCatalogVisible(!isCatalogVisible);
        }}
      >
        {items?.map((category) => (
          <AppliancesMenu
            category={category}
            appliancesColMaxItem={appliancesColMaxItem}
            lang={lang}
          />
        ))}
      </div>
      </div>

      <div
        className={`${style.brandMenuCategoriesContainer} ${handles.brandMenuCategoriesContainer} ${activeBrand != undefined ? style.brandMenuCategoriesContainerVisible : style.brandMenuCategoriesContainerHidden}`}
        onMouseEnter={() => setActiveBrand(activeBrand)}
        onMouseLeave={() => setActiveBrand(undefined)}
      >
        {activeBrand != undefined && (
          <BrandsMenu
            brand={brandItems[activeBrand]}
            brandColMaxItem={brandColMaxItem}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
};

DesktopCatalog.schema = {
  title: "[DESKTOP] Custom Catalog Menu",
  description: "All catalog menu settings",
  type: "object",
  properties: {
    catalogRowLabel: {
      title: "Catalog Row Label",
      description: "This is the catalog row label",
      type: "object",
      properties: {
        isVisible: {
          title: "Is label visible?",
          type: "boolean",
          default: true,
        },
        labelText: {
          title: "Label text",
          type: "string",
          default: "Low prices all year!",
        },
        labelLink: {
          title: "Label link",
          type: "string",
        },
      },
    },
    catalogLabel: {
      title: "Catalog Label english language",
      description: "This is the catalog label",
      default: "Shop all appliances",
      type: "string",
    },
    catalogLabel_lang: {
      title: "Catalog Label second language",
      description: "This is the catalog label",
      default: "Shop all appliances",
      type: "string",
    },
    catalogLabelLink: {
      title: "Catalog Label link english language",
      description: "This is the catalog label link",
      default: "/appliances",
      type: "string",
    },
    catalogLabelLink_lang: {
      title: "Catalog Label link second language",
      description: "This is the catalog label link",
      default: "/prodotti",
      type: "string",
    },
    //Appliances Items
    items: {
      type: "array",
      title: "Appliances Items",
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
          items: {
            type: "array",
            title: "SubCategories Items",
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
        },
      },
    },
    //Brands Items
    brandItems: {
      type: "array",
      title: "Category Items",
      items: {
        title: "Item menu",
        properties: {
          categoryLabel: {
            title: "Category Label",
            type: "string",
            description: "Insert the category Label",
            default: "Label",
          },
          brandLink:{
            title: "Brand Link",
            type: "string",
            description: "Insert the brand PLP url",
            default: "#",
          },
          // brandImage: {
          //   title: "Brand Image",
          //   type: "string",
          //   description: "Insert the image url (ex. /arquivos/filename.jpg)",
          //   default: "/arquivos/",
          // },
          // items: {
          //   type: "array",
          //   title: "Brand Items",
          //   items: {
          //     title: "Item menu",
          //     properties: {
          //       // itemTitle: {
          //       //   title: "ItemTitle",
          //       //   type: "string",
          //       // },
          //       itemTitle: {
          //         title: "ItemTitle english language",
          //         type: "string",
          //       },
          //       itemTitle_lang: {
          //         title: "ItemTitle second language",
          //         type: "string",
          //       },
          //       itemLink: {
          //         title: "ItemLink",
          //         type: "string",
          //       },
          //       items: {
          //         type: "array",
          //         title: "Brand SubCategories Items",
          //         items: {
          //           title: "Item menu",
          //           properties: {
          //             itemTitle: {
          //               title: "ItemTitle english language",
          //               type: "string",
          //             },
          //             itemTitle_lang: {
          //               title: "ItemTitle second language",
          //               type: "string",
          //             },
          //             itemLink: {
          //               title: "ItemLink",
          //               type: "string",
          //             },
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
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
    weekDealsLink:{
      title: "Week deals Link",
      type: "string",
      description: "Insert the week deals Link",
      default: "#",
    },
  },
};

export default DesktopCatalog;
