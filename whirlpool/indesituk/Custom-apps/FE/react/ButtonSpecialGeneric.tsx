import React, { useState, useEffect, useCallback } from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { useProduct } from "vtex.product-context";

import ModalBuyOnline from "./ModalBuyOnline";
import {usePixel} from "vtex.pixel-manager"

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
  text = "BUY ONLINE",
  width = "max-content",
}: ButtonSpecialGenericProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const [openModal, setOpenModal] = useState(false);
  const [availableStores, setAvailableStores] = useState({ d: [] });

  const { product } = useProduct();
  const {push} = usePixel();

  const productFcode = product.items[0].name;

  const noProduct = !availableStores || !availableStores?.d || !availableStores?.d?.length;

  function getStores() {
    fetch(
      `https://services.internetbuyer.co.uk/REST.svc/GetByProductPartNumber?ProductPartNumber=%27${productFcode}%27&CID=49&$format=json`
    )
      .then((response) => response.json())
      .then((data) => setAvailableStores(data));
  }

  useEffect(() => {
    getStores();
  }, [openModal]);

  function analyticsOpenModalTracking() {
    console.log('testttttttttttttt')
    // GA4FUNREQ36
    push({event: "store_locator_from_product", slug: product?.product?.linkText})
    // GA4FUNREQ38
    push({ event: "intentionToBuy", slug: product?.product?.linkText });
  }

  const addScroll = useCallback(() => {
    document
      .querySelector("body")
      ?.classList.remove(handles.modalSpecial__modalOpenOverflow);
  }, []);

  return (
    <>
      {!noProduct &&
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
