import React, { useState, useEffect } from "react";
import style from "./style.css";
import { useProduct } from "vtex.product-context";
import { fiewPiecesIcon, inStockIcon, notInStockIcon } from "./vectors/vectors";
import { useRenderSession } from "vtex.session-client";
import { useIntl } from "react-intl";

interface WindowRuntime extends Window {
  __RUNTIME__: any;
}

const LeadTime: StorefrontFunctionComponent = () => {
  /*--- INTL ---*/
  const intl = useIntl();

  /*--- UTILS ---*/
  const { product } = useProduct();
  const { session, error } = useRenderSession();

  const [isSellable, setIsSellable] = useState(false);
  const [iconSrc, setIconSrc] = useState("");
  const [leadTimeText, setLeadTimeText] = useState("");

  const runtime = ((window as unknown) as WindowRuntime).__RUNTIME__;

  const getDefaultSeller = (sellers: any[]) => {
    if (!sellers || sellers.length === 0) {
      return;
    }

    const defaultSeller = sellers.find((seller) => seller.sellerDefault);

    if (!defaultSeller) {
      return sellers[0];
    }

    return defaultSeller;
  };
  const seller = getDefaultSeller(product?.items?.[0]?.sellers);

  const getSpecificationValue = (specName: string): string => {
    const specIndex = product?.properties?.map((productSpecification: any) => productSpecification.name).indexOf(specName);

    const specValue = specIndex && specIndex !== -1 && product?.properties[specIndex].values[0];

    return specValue;
  };

  const getBooleanSpecificationValue = (specName: string): boolean => {
    let specValue = getSpecificationValue(specName);
    return specValue === "true" ? true : false;
  };

  const getCommunityFromSalesChannel = (channel: String): String => {
    switch (channel) {
      case "d2ef55bf-ed56-4961-82bc-6bb753a25e90":
        return "EPP";
      case "df038a38-b21d-4a04-adbe-592af410dae3":
        return "FF";
      case "53e2c7bb-0de5-4ffe-9008-0e3f0d31a545":
        return "VIP";
      default:
        return "";
    }
  };

  const handleLeadDisplay = (channel: any) => {
    const isDiscontinued = getBooleanSpecificationValue("isDiscontinued");
    const community = getCommunityFromSalesChannel(channel);

    if (community !== "") {
      // let showPrice = getBooleanSpecificationValue(`showPrice${community}`);
      let sellable = getBooleanSpecificationValue(`sellable${community}`);

      if (isDiscontinued || !sellable) {
        setIsSellable(false);
      } else {
        setIsSellable(true);
      }
    } else {
      setIsSellable(false);
    }
  };

  const handleLeadIcon = (channel: any) => {
    const community = getCommunityFromSalesChannel(channel);
    let hasFiewPieces = getBooleanSpecificationValue(`showFewPiecesAlert${community}`);
    if (channel == "d2ef55bf-ed56-4961-82bc-6bb753a25e90") {
      setIconSrc(
        !eppHasStock || !productHasStock
          ? `data:image/svg+xml;base64,${Buffer.from(notInStockIcon).toString("base64")}`
          : hasFiewPieces
          ? `data:image/svg+xml;base64,${Buffer.from(fiewPiecesIcon).toString("base64")}`
          : `data:image/svg+xml;base64,${Buffer.from(inStockIcon).toString("base64")}`
      );
    } else if (channel == "df038a38-b21d-4a04-adbe-592af410dae3") {
      setIconSrc(
        !ffHasStock || !productHasStock
          ? `data:image/svg+xml;base64,${Buffer.from(notInStockIcon).toString("base64")}`
          : hasFiewPieces
          ? `data:image/svg+xml;base64,${Buffer.from(fiewPiecesIcon).toString("base64")}`
          : `data:image/svg+xml;base64,${Buffer.from(inStockIcon).toString("base64")}`
      );
    } else {
      setIconSrc(
        !vipHasStock || !productHasStock
          ? `data:image/svg+xml;base64,${Buffer.from(notInStockIcon).toString("base64")}`
          : hasFiewPieces
          ? `data:image/svg+xml;base64,${Buffer.from(fiewPiecesIcon).toString("base64")}`
          : `data:image/svg+xml;base64,${Buffer.from(inStockIcon).toString("base64")}`
      );
    }
  };
  const getStockSpecificationValue = (specName: string): boolean => {
    let specValue = getSpecificationValue(specName);
    if (runtime.culture.locale == "it-IT") {
      if (specName === "Solo prodotti disponibili") {
        return specValue === "Si" ? true : false;
      } else {
        return specValue === "Prodotti disponibili" ? true : false;
      }
    } else if (specName === "Only products available") {
      return specValue === "And" ? true : false;
    } else {
      return specValue === "Show In Stock Products Only" || specValue === "Available products" ? true : false;
    }
  };
  let eppHasStock =
    runtime.culture.locale == "it-IT"
      ? getStockSpecificationValue("Disponibilità")
      : getStockSpecificationValue("Stock Availability") ||
        getStockSpecificationValue("Availability") || // temporary specification awaiting solution on the vtex side
        getStockSpecificationValue("Available Stock"); // temporary specification awaiting solution on the vtex side
  let ffHasStock =
    runtime.culture.locale == "it-IT"
      ? getStockSpecificationValue("Solo prodotti disponibili")
      : getStockSpecificationValue("Stock Status") ||
        getStockSpecificationValue("Only available") || // temporary specification awaiting solution on the vtex side
        getStockSpecificationValue("Available Stock"); // temporary specification awaiting solution on the vtex side
  let vipHasStock =
    runtime.culture.locale == "it-IT"
      ? getStockSpecificationValue("Solo disponibili")
      : getStockSpecificationValue("Only available") ||
        getStockSpecificationValue("Only products available") || // temporary specification awaiting solution on the vtex side
        getStockSpecificationValue("Available Stock"); // temporary specification awaiting solution on the vtex side

  const productHasStock = seller?.commertialOffer?.AvailableQuantity != 0;

  const handleLeadTimeText = (channel: any) => {
    const community = getCommunityFromSalesChannel(channel);
    let hasFiewPieces = getBooleanSpecificationValue(`showFewPiecesAlert${community}`);
    let labelToPrint;
    if (channel == "d2ef55bf-ed56-4961-82bc-6bb753a25e90") {
      labelToPrint = hasFiewPieces
        ? intl.formatMessage({ id: "store/lead-time.fewPieces" })
        : eppHasStock && productHasStock
        ? intl.formatMessage({ id: "store/lead-time.inStock" })
        : intl.formatMessage({ id: "store/lead-time.outOfStock" });

      setLeadTimeText(labelToPrint);
    } else if (channel == "df038a38-b21d-4a04-adbe-592af410dae3") {
      labelToPrint = hasFiewPieces
        ? intl.formatMessage({ id: "store/lead-time.fewPieces" })
        : ffHasStock && productHasStock
        ? intl.formatMessage({ id: "store/lead-time.inStock" })
        : intl.formatMessage({ id: "store/lead-time.outOfStock" });
      setLeadTimeText(labelToPrint);
    } else {
      labelToPrint = hasFiewPieces
        ? intl.formatMessage({ id: "store/lead-time.fewPieces" })
        : vipHasStock && productHasStock
        ? intl.formatMessage({ id: "store/lead-time.inStock" })
        : intl.formatMessage({ id: "store/lead-time.outOfStock" });

      setLeadTimeText(labelToPrint);
    }
  };

  useEffect(() => {
    if (session) {
      let channel = runtime.binding.id;
      if (product) {
        handleLeadDisplay(channel);
        handleLeadIcon(channel);
        handleLeadTimeText(channel);
      }
    } else {
      if (error) {
        console.log(error.message);
      }
    }
  }, [session, product]);

  return (
    <>
      {isSellable && (
        <div className={style.leadTimeContainer}>
          <div className={style.leadTimeWrapper}>
            <img src={iconSrc} alt="icon" className={style.leadTimeImg} />
            <span className={style.leadTimeText}>{leadTimeText}</span>
          </div>
        </div>
      )}
    </>
  );
};

LeadTime.schema = {
  // title: 'editor.basicblock.title',
  // description: 'editor.basicblock.description',
  // type: 'object'
};

export default LeadTime;
