import React, { useState, useRef } from "react";
import style from "./style.css";
import { useRuntime } from "vtex.render-runtime";

interface CatalogMenuProps {
  items: ItemProps[];
  showOnMobile: boolean;
}

interface ItemProps {
  itemTitle: string;
  itemLink: string;
  imageLink: string;
  SvgCode: string;
  hasSubMenu: boolean;
  subItems: SubItemProps[];
}
interface SubItemProps {
  itemTitle: string;
  itemLink: string;
  imageLink: string;
  SvgCode: string;
}

const MdaMenuComponent: StorefrontFunctionComponent<CatalogMenuProps> = ({
  showOnMobile,
  items,
}) => {
  const inputRef: any = useRef();

  const [selected, setSelected] = useState({
    index: -1,
    isVisible: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [prevIndex, setPrevIndex] = useState(-1);

  const createSvg = (svgString: string) => {
    const svgBase64 = Buffer.from(svgString).toString("base64");
    return `data:image/svg+xml;base64,${svgBase64}`;
  };

  const { deviceInfo } = useRuntime();
  const isMobile = deviceInfo.type == "phone";

  const handleCategoryClick = (index: number) => {
    setSelected({
      ...selected,
      index: index,
      isVisible: selected.index == index ? !selected.isVisible : true,
    });
    if (!isOpen) {
      window?.scroll({
        top: window.pageYOffset + 200,
        behavior: "smooth",
      });
      setPrevIndex(index);
      setIsOpen(true);
    } else {
      if (prevIndex == index) {
        window?.scroll({
          top: window.pageYOffset - 200,
          behavior: "smooth",
        });
        setPrevIndex(-1);
        setIsOpen(false);
      } else {
        setPrevIndex(index);
      }
    }
  };

  // window?.scroll({
  //   top: !selected.isVisible
  //     ? window.pageYOffset + 200
  //     : window.pageYOffset - 200,
  //   behavior: "smooth",
  // });

  return (
    <>
      {/*--- Layout Desktop ---*/
        !isMobile ? (
          <>
            <div className={style.menuContainer} ref={inputRef}>
              {items &&
                items?.map((item, index) => (
                  <div
                    key={index}
                    className={style.categoryCard}
                    onClick={() =>
                      item?.subItems?.length > 0
                        ? handleCategoryClick(index)
                        : null
                    }
                  >
                    <a
                      href={!item?.hasSubMenu ? item?.itemLink : undefined}
                      className={style.categoryCardLink}
                    >
                      <img
                        src={
                          item?.SvgCode != ""
                            ? createSvg(item?.SvgCode)
                            : item?.imageLink
                        }
                        alt=""
                        className={style.categoryCardImage}
                      />
                      <span className={style.categoryCardTitle}>
                        {item.itemTitle}
                      </span>
                    </a>
                  </div>
                ))}
            </div>
            <div
              className={
                selected.isVisible
                  ? style.subMenuContainer
                  : style.subMenuContainerClosed
              }
            >
              {items &&
                items[selected.index]?.hasSubMenu &&
                items[selected.index]?.subItems?.map(
                  (subItem: any, index: number) => (
                    <div key={index} className={style.categoryCard}>
                      <a
                        href={subItem.itemLink}
                        className={style.subCategoryCardLink}
                      >
                        <img
                          src={
                            subItem.SvgCode != ""
                              ? createSvg(subItem.SvgCode)
                              : subItem.imageLink
                          }
                          alt=""
                          className={style.categoryCardImage}
                        />
                        <span className={style.categoryCardTitle}>
                          {subItem.itemTitle}
                        </span>
                      </a>
                    </div>
                  )
                )}
            </div>
          </>
        ) : /*--- Layout Mobile solo per menu senza il sottomenu (ex. Hotpoint) ---*/
          isMobile && showOnMobile ? (
            <div className={style.menuContainerMobile}>
              {items &&
                items?.map((item, index) => (
                  <div key={index} className={style.categoryCard}>
                    <a
                      href={
                        item?.subItems?.length <= 0 ? item?.itemLink : undefined
                      }
                      className={style.categoryCardLink}
                    >
                      <img
                        src={
                          item.SvgCode != ""
                            ? createSvg(item.SvgCode)
                            : item.imageLink
                        }
                        alt=""
                        className={style.categoryCardImage}
                      />
                      <span className={style.categoryCardTitle}>
                        {item.itemTitle}
                      </span>
                    </a>
                  </div>
                ))}
            </div>
          ) : null}
    </>
  );
};

MdaMenuComponent.schema = {
  title: "Custom MDA Menu",
  description: "Custom MDA Menu settings",
  type: "object",
  properties: {
    showOnMobile: {
      title: "showOnMobile",
      type: "boolean",
      description: "Select if you want to show the menu on mobile",
      default: false,
    },
    items: {
      type: "array",
      title: "Items",
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
          imageLink: {
            title: "imageLink",
            type: "string",
            description:
              "The suggestion is to uplad the image on Vtex (ex. /arquivos/image.jpg). DO NOT insert both imageLink and SvgCode",
          },
          SvgCode: {
            title: "SvgCode",
            type: "string",
            description:
              "(ex. <svg width='50px' height='70px' xmlns='http://www.w3.org/2000/svg' [...] </svg>). DO NOT insert both imageLink and SvgLink",
          },
          hasSubMenu: {
            title: "HasSubMenu",
            type: "boolean",
            description: "Select if the item has at least one sub Item",
          },
          subItems: {
            type: "array",
            title: "subItems",
            items: {
              title: "subItems",
              properties: {
                itemTitle: {
                  title: "ItemTitle",
                  type: "string",
                },
                itemLink: {
                  title: "ItemLink",
                  type: "string",
                },
                imageLink: {
                  title: "imageLink",
                  type: "string",
                  description:
                    "The suggestion is to uplad the image on Vtex (ex. /arquivos/image.jpg). DO NOT insert both imageLink and SvgCode",
                },
                SvgCode: {
                  title: "SvgCode",
                  type: "string",
                  description:
                    "(ex. <svg width='50px' height='70px' xmlns='http://www.w3.org/2000/svg' [...] </svg>). DO NOT insert both imageLink and SvgLink",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default MdaMenuComponent;
