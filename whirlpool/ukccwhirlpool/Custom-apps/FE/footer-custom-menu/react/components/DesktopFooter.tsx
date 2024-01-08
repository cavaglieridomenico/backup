import React from "react";
import style from "../style.css";
import { Item } from "../typings/items";
import { handleClick } from "../utils/utils";
import { usePixel } from "vtex.pixel-manager";

interface DesktopFooterProps {
  items: Item[];
}

const DesktopFooter: StorefrontFunctionComponent<DesktopFooterProps> = ({
  items,
  children,
}) => {
  const { push } = usePixel();
  return (
    <div className={style.footerCustomDesktopContainer}>
      {items &&
        items?.map((item) => (
          <div
            className={`${style.footerCustomDesktopColumn} ${
              item.hasImages ? style.firstColDesktop : null
            }`}
          >
            <div>
              <span className={style.footerCustomDesktopTitle}>
                {item?.itemTitle}
              </span>
              {item?.subItems?.map((subItem) => (
                <a
                  href={subItem?.itemLink}
                  target={subItem.isExternalLink ? "_blank" : ""}
                  className={style.footerCustomDesktopLink}
                  onClick={() =>
                    handleClick(
                      push,
                      subItem.isOneTrustLink,
                      subItem.isExternalLink,
                      subItem.itemLink,
                      {
                        linkUrl: subItem?.itemLink,
                        linkText: subItem?.itemTitle,
                        clickArea: "footer",
                      }
                    )
                  }
                >
                  <span className={style.footerCustomDesktopSubTitle}>
                    {subItem?.itemTitle}
                  </span>
                </a>
              ))}
            </div>
            {item.hasImages && (
              <div className={style.footerCustomDesktopImagesContainer}>
                {children}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

DesktopFooter.schema = {};

export default DesktopFooter;
