import React, { useState } from "react";
import style from "./style.css";
// import { menuSvgWhite, crossSvg } from "./vectors/vectors";
import { DesktopCatalogMenuProps } from "./typings/desktopMenu";
import AppliancesMenu from "./components/AppliancesMenu";
import BrandsMenu from "./components/BrandsMenu";
import { Link } from "vtex.render-runtime";

const DesktopCatalog: StorefrontFunctionComponent<DesktopCatalogMenuProps> = ({
  catalogLabel,
  catalogLabelLink,
  //catalogRowLabel,
  items,
  brandItems,
  children,
}) => {
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);
  const [activeBrand, setActiveBrand] = useState<number | undefined>(undefined);
  // const menuIcon = Buffer.from(
  //   isCatalogVisible ? crossSvg : menuSvgWhite
  // ).toString("base64");

  return (
    <div className={style.catalogRow}>
      <div className={style.catalogRowButton}>
        {children}
        <div className={style.brandsAndButtonContainer}>
          {/* ---------- Brand Images -----------*/}
          <div className={style.brandsContainer}>
            {brandItems?.map((brand, index: number) => (
              <Link to={brand.brandLink} className={style.brandImageLink}>
                <div
                  className={style.brandImageContainer}
                  style={{
                    background:
                      activeBrand == index ? "#dee0e3" : "transparent",
                  }}
                  onMouseEnter={() => {
                    setIsCatalogVisible(false), setActiveBrand(index);
                  }}
                  onMouseLeave={() => setActiveBrand(undefined)}
                >
                  <img
                    src={brand.brandImage}
                    alt="brand-image"
                    className={style.brandImage}
                  />
                </div>
              </Link>
            ))}
          </div>
          {/* ---------- Catalog Button -----------*/}
          <Link
            to={catalogLabelLink}
            className={style.catalogButtonLink}
            onMouseEnter={() => {
              setIsCatalogVisible(true);
            }}
            onMouseLeave={() => setIsCatalogVisible(false)}
          >
            <div
              className={style.catalogButton}
              role="button"
              // onClick={() => setIsCatalogVisible(!isCatalogVisible)}
            >
              <span className={style.catalogButtonLabel}>{catalogLabel}</span>
              {/* <div className={style.catalogButtonIconContainer}>
              <img
              src={`data:image/svg+xml;base64,${menuIcon}`}
              className={style.catalogButtonIcon}
              alt="menu-icon"
              />
            </div> */}
            </div>
          </Link>
        </div>
      </div>
      <div
        style={{ height: isCatalogVisible ? "15rem" : 0 }}
        className={style.catalogCategoriesContainer}
        onMouseEnter={() => {
          setIsCatalogVisible(true);
        }}
        onMouseLeave={() => setIsCatalogVisible(false)}
      >
        {items?.map((category) => (
          <AppliancesMenu category={category} itemsNumber={items?.length} />
        ))}
      </div>
      <div
        style={{
          height:
            activeBrand != undefined && brandItems?.[activeBrand]?.items?.length
              ? "15rem"
              : 0,
        }}
        className={style.brandMenuCategoriesContainer}
        onMouseEnter={() => setActiveBrand(activeBrand)}
        onMouseLeave={() => setActiveBrand(undefined)}
      >
        {activeBrand != undefined && (
          <BrandsMenu brand={brandItems[activeBrand]} />
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
      title: "Catalog Label",
      description: "This is the catalog label",
      default: "Shop all appliances",
      type: "string",
    },
    catalogLabelLink: {
      title: "Catalog Label Link",
      description: "This is the catalog label link",
      default: "/",
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
            title: "ItemTitle",
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
      },
    },
    //Brands Items
    brandItems: {
      type: "array",
      title: "Brand Items",
      items: {
        title: "Item menu",
        properties: {
          brandImage: {
            title: "Brand Image",
            type: "string",
            description: "Insert the image url (ex. /arquivos/filename.jpg)",
            default: "/arquivos/",
          },
          brandLink: {
            title: "Brand Link",
            type: "string",
            description: "Insert the brand plp url",
            default: "",
          },
          items: {
            type: "array",
            title: "Brand Items",
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
                items: {
                  type: "array",
                  title: "Brand SubCategories Items",
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
            },
          },
        },
      },
    },
  },
};

export default DesktopCatalog;
