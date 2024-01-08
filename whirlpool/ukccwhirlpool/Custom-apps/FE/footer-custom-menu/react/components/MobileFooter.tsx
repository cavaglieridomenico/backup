import React, { useState, useEffect } from "react";
import style from "../style.css";
import { Collapsible } from "vtex.styleguide";
import { Item } from "../typings/items";
import { handleClick } from "../utils/utils";
import { usePixel } from "vtex.pixel-manager";

interface MobileFooterProps {
  items: Item[];
}

const MobileFooter: StorefrontFunctionComponent<MobileFooterProps> = ({
  items,
}) => {
  const { push } = usePixel();

  useEffect(() => {
    if (items) {
      setOpenQuestion(setInitialState(items));
    }
  }, [items]);

  const [openQuestion, setOpenQuestion]: any = useState();

  const setInitialState = (items: Item[]) => {
    let obj: any = {};
    for (let i = 0; i < items.length; i++) {
      obj[items[i].itemTitle] = {
        isOpen: false,
      };
    }
    return obj;
  };

  const toggleAccordion = (questionNbr: string) => {
    let newOpen: any = { ...openQuestion };
    let newValue = !newOpen[questionNbr].isOpen;
    newOpen[questionNbr].isOpen = newValue;
    setOpenQuestion(newOpen);
  };

  return (
    <div className={style.customFooterCustomMobileContainer}>
      {items?.map((item) => (
        <Collapsible
          align="right"
          header={
            <div className={style.titleTextContainer}>
              <span className={style.titleText}>{item.itemTitle}</span>
              <span className={style.titleTextPlus}>
                {openQuestion && openQuestion[item.itemTitle]?.isOpen
                  ? "-"
                  : "+"}
              </span>
            </div>
          }
          onClick={() => toggleAccordion(item.itemTitle)}
          isOpen={openQuestion && openQuestion[item.itemTitle]?.isOpen}
        >
          {item?.subItems?.map((subItem) => (
            <div className={style.titleTextContainer}>
              <a
                className={style.titleLinkSubItems}
                href={subItem.itemLink}
                target={subItem.isExternalLink ? "_blank" : ""}
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
                <span className={style.titleTextSubItems}>
                  {subItem.itemTitle}
                </span>
              </a>
            </div>
          ))}
        </Collapsible>
      ))}
    </div>
  );
};

MobileFooter.schema = {};

export default MobileFooter;
