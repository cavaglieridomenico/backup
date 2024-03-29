import React, { useState, useCallback } from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { useProduct } from "vtex.product-context";

import ModalBuyOnline from "./ModalBuyOnline";
import { dataLayer } from "./Analytics";

export interface ButtonSpecialGenericProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
  disabled?: boolean;
  hasTargetBlank?: boolean;
  href?: string;
  id?: string;
  isButton?: boolean;
  text?: string;
  width?: string;
}

const CSS_HANDLES = [
  "buttonSpecialGeneric__container",
  "buttonSpecialGeneric__label",
  "modalSpecial__modalOpenOverflow",
] as const;

export default function ButtonSpecialGeneric({
  classes,
  disabled = false,
  hasTargetBlank = true,
  href,
  id,
  isButton = false,
  text = "Compra online",
  width = "max-content",
}: ButtonSpecialGenericProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const [openModal, setOpenModal] = useState(false); 

  const { product } = useProduct();
  const { productName } = product;

  const productFcode = product.items[0].name;
  
  function analyticsOpenModalTracking() {
    dataLayer.push({
      event: "intentionToBuy",
      eventAction: "Pop Retail List",
      eventLabel: `${productFcode}-${productName}`,
    });
  }

  const addScroll = useCallback(() => {
    document
      .querySelector("body")
      ?.classList.remove(handles.modalSpecial__modalOpenOverflow);
  }, []);

  return (
    <>
      { 
        (isButton ? (
          <button
            className={handles.buttonSpecialGeneric__container}
            disabled={disabled}
            id={id}
            style={{ width }}
            onClick={() => {
              setOpenModal(true);
              analyticsOpenModalTracking();
            }}
          >
            <span className={handles.buttonSpecialGeneric__label}>{text}</span>
          </button>
        ) : (
          <div
            id={id}
            className={handles.buttonSpecialGeneric__container}
            style={{ width }}
            onClick={() => {
              setOpenModal(true);
              analyticsOpenModalTracking();
            }}
          >
            <a
              className={handles.buttonSpecialGeneric__label}
              href={href}
              target={hasTargetBlank ? "_blank" : undefined}
            >
              {text}
            </a>
          </div>
        ))}

      {openModal && (
        <ModalBuyOnline
          isOpen={openModal}
          handleClose={() => {
            addScroll(), setOpenModal(false);
          }}
        />
      )}
    </>
  );
}
