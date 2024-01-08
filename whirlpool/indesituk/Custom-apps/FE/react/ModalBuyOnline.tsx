import React, { useState, useEffect, useCallback } from "react";
import classnames from "classnames";

// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { useProduct } from "vtex.product-context";

import ButtonSpecial from "./ButtonSpecial";

interface ModalBuyOnlineProps {
  isOpen: boolean;
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
  handleClose: () => void;
}

export interface BannerProductBuyOnlineResponse {
  MerchantLogoUrl: string;
  NavigateUrl: string;
}

const CSS_HANDLES = [
  "bannerProductBuyOnline__wrapperOpen",
  "bannerProductBuyOnline__wrapper",
  "modalSpecial__background",
  "modalSpecial__background__open",
  "modalSpecial__container",
  "modalSpecial__container__open",
  "modalSpecial__buttonContainer",
  "modalSpecial__buttonClose",
  "modalSpecial__closeIcon",
  "modalSpecial__contentItems",
  "modalSpecial__titleWhere",
  "modalSpecial__subtitle",
  "modalSpecial__imageButtonContainer",
  "modalSpecial__scroller",
  "modalSpecial__scrollerOpen",
  "modalSpecial__modalOpenOverflow",
] as const;

export default function ModalBuyOnline({
  isOpen = false,
  classes,
  handleClose,
}: ModalBuyOnlineProps) {
  const [openModalBuyOnline, setOpenModalBuyOnline] = useState(isOpen);

  const [availableStores, setAvailableStores] = useState({ d: [] });

  const { product } = useProduct();

  const productFcode = product.items[0].name ? product.items[0].name : "";

  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  function getStores() {
    fetch(
      `https://services.internetbuyer.co.uk/REST.svc/GetByProductPartNumber?ProductPartNumber=%27${productFcode}%27&CID=49&$format=json`
    )
      .then((response) => response.json())
      .then((data) => setAvailableStores(data));
  }

  useEffect(() => {
    getStores();
  }, [openModalBuyOnline]);

  useEffect(() => {
    setOpenModalBuyOnline(isOpen);
  }, [isOpen]);

  const removeScrollToBodyInVtex = useCallback(() => {
    if (openModalBuyOnline) {
      document
        .querySelector("body")
        ?.classList.add(handles.modalSpecial__modalOpenOverflow);
    } else {
      document
        .querySelector("body")
        ?.classList.remove(handles.modalSpecial__modalOpenOverflow);
    }
  }, [openModalBuyOnline, handles.modalSpecial__modalOpenOverflow]);

  useEffect(() => {
    removeScrollToBodyInVtex();
  }, [openModalBuyOnline, removeScrollToBodyInVtex]);

  return (
    <div
      className={classnames(
        handles.bannerProductBuyOnline__wrapper,
        openModalBuyOnline ? handles.bannerProductBuyOnline__wrapperOpen : ""
      )}
    >
      <div
        className={classnames(
          handles.modalSpecial__background,
          openModalBuyOnline ? handles.modalSpecial__background__open : ""
        )}
      />
      <div
        className={classnames(
          handles.modalSpecial__scroller,
          openModalBuyOnline ? handles.modalSpecial__scrollerOpen : ""
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (handleClose) {
            handleClose();
          }
        }}
      >
        <div
          className={classnames(
            handles.modalSpecial__container,
            openModalBuyOnline ? handles.modalSpecial__container__open : ""
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={handles.modalSpecial__buttonContainer}>
            <button
              className={handles.modalSpecial__buttonClose}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (handleClose) {
                  handleClose();
                }
              }}
            >
              <span className={handles.modalSpecial__closeIcon} />
            </button>
          </div>
          {/* Modal content */}
          <div className={handles.modalSpecial__contentItems}>
            <span className={handles.modalSpecial__titleWhere}>
              Where to buy
            </span>
            <span className={handles.modalSpecial__subtitle}>
              Buy online from the following retailers
            </span>
            {availableStores?.d.map(
              (
                {
                  MerchantLogoUrl,
                  NavigateUrl,
                }: BannerProductBuyOnlineResponse,
                i: React.Key | null | undefined
              ) => (
                <div
                  className={handles.modalSpecial__imageButtonContainer}
                  key={i}
                >
                  <img
                    style={{
                      maxHeight: "64px",
                      width: "auto",
                      marginBottom: "20px",
                    }}
                    alt=""
                    src={MerchantLogoUrl}
                  />
                  <ButtonSpecial isButton={false} href={NavigateUrl} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
