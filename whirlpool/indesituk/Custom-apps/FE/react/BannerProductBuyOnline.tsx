import React, { useState, useEffect } from "react";
// @ts-ignore
import { useProduct } from "vtex.product-context";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

import ButtonSpecial from "./ButtonSpecial";
import ModalBuyOnline from "./ModalBuyOnline";
import { dataLayer } from "./Analytics";
export interface BannerProductBuyOnline {
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
}

export interface BannerProductBuyOnlineResponse {
  MerchantLogoUrl: string;
  NavigateUrl: string;
}

const CSS_HANDLES = [
  "bannerProductBuyOnline__container",
  "bannerProductBuyOnline__containerCenter",
  "bannerProductBuyOnline__codeLabel",
  "bannerProductBuyOnline__productNameLabel",
  "bannerProductBuyOnline__productNameLabelNoData",
  "bannerProductBuyOnline__wrapper",
  "bannerProductBuyOnline__wrapperShowed",
  "bannerProductBuyOnline__wrapperHidden"
] as const;

export default function BannerProductBuyOnline({
  classes,
}: BannerProductBuyOnline) {
  const [openModalSpecial, setOpenModalSpecial] = useState(false);
  const [availableStores, setAvailableStores] = useState({ d: [] });

  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const { product } = useProduct();

  const productFcode = product.items[0].name;

  const { productName } = product;

  function analyticsOpenModalTracking() {
    dataLayer.push({
      event: "intentionToBuy",
      eventAction: "Pop Retail List",
      eventLabel: `${productFcode}-${productName}`,
    });
  }

  function getStores() {
    fetch(
      `https://services.internetbuyer.co.uk/REST.svc/GetByProductPartNumber?ProductPartNumber=%27${productFcode}%27&CID=49&$format=json`
    )
      .then((response) => response.json())
      .then((data) => setAvailableStores(data));
  }

  useEffect(() => {
    getStores();
  }, [openModalSpecial]);

  const [isSticky, setIsSticky] = useState(false);
  const handleScroll = () => {
    const actualScrollPosition = window.scrollY;
    const minimumHeight = document.body.offsetHeight / 100;
    setIsSticky(actualScrollPosition > minimumHeight);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  const noProduct =
    !availableStores || !availableStores.d || !availableStores.d.length;

  return (
    <>
      <div className={isSticky ? handles.bannerProductBuyOnline__wrapperShowed : handles.bannerProductBuyOnline__wrapperHidden}>
        <div
        className={
          !noProduct
            ? handles.bannerProductBuyOnline__container
            : handles.bannerProductBuyOnline__containerCenter
        }
        style={openModalSpecial ? { zIndex: -1 } : { zIndex: 1 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span className={handles.bannerProductBuyOnline__codeLabel}>
            {productFcode}
          </span>
          <span
            className={
              !noProduct
                ? handles.bannerProductBuyOnline__productNameLabel
                : handles.bannerProductBuyOnline__productNameLabelNoData
            }
          >
            {productName}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {!noProduct && (
            <ButtonSpecial
              onClick={() => {
                setOpenModalSpecial(true);
                analyticsOpenModalTracking();
              }}
            />
          )}
        </div>
      </div>
      </div>
      <ModalBuyOnline
        isOpen={openModalSpecial}
        handleClose={() => setOpenModalSpecial(false)}
      />
    </>
  );
}
