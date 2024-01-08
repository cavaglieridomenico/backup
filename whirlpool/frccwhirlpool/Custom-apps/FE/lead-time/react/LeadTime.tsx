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

  const getSpecificationValue = (specName: string): string => {
    const specIndex = product?.properties
      ?.map((productSpecification: any) => productSpecification.name)
      .indexOf(specName);

    const specValue =
      specIndex && specIndex !== -1 && product?.properties[specIndex].values[0];

    return specValue;
  };

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

  const getBooleanSpecificationValue = (specName: string): boolean => {
    let specValue = getSpecificationValue(specName);
    return specValue === "true" ? true : false;
  };

  const getCommunityFromSalesChannel = (channel: String): String => {
    switch (channel) {
      case "1":
        return "EPP";
      case "2":
        return "FF";
      case "3":
        return "VIP";
      default:
        return "";
    }
  };

  const handleLeadDisplay = (channel: any) => {
    const isDiscontinued = getBooleanSpecificationValue("isDiscontinued");
    const community = getCommunityFromSalesChannel(channel);

    if (community !== "") {
      let showPrice = getBooleanSpecificationValue(`showPrice${community}`);
      let sellable = getBooleanSpecificationValue(`sellable${community}`);
      if (isDiscontinued || !sellable || !showPrice) setIsSellable(false);
      else setIsSellable(true);
    } else {
      setIsSellable(false);
    }
  };

  const handleLeadIcon = (channel: any) => {
    const community = getCommunityFromSalesChannel(channel);
    let hasStock = seller?.commertialOffer?.AvailableQuantity != 0;
    let hasFiewPieces = getBooleanSpecificationValue(
      `showFewPiecesAlert${community}`
    );

    setIconSrc(
      !hasStock
        ? `data:image/svg+xml;base64,${Buffer.from(notInStockIcon).toString(
            "base64"
          )}`
        : hasFiewPieces
        ? `data:image/svg+xml;base64,${Buffer.from(fiewPiecesIcon).toString(
            "base64"
          )}`
        : `data:image/svg+xml;base64,${Buffer.from(inStockIcon).toString(
            "base64"
          )}`
    );
  };

  const handleLeadTimeText = (channel: any) => {
    const community = getCommunityFromSalesChannel(channel);
    let hasStock = seller?.commertialOffer?.AvailableQuantity != 0;
    let hasFiewPieces = getBooleanSpecificationValue(
      `showFewPiecesAlert${community}`
    );
    let isAvailable =
      getSpecificationValue(`Disponibilité en ${community}`) ==
      "Achat en ligne";
    let leadTime = getSpecificationValue(`leadTime`);

    //Conditions to choose what label print
    let labelToPrint =
      isAvailable && hasStock && hasFiewPieces
        ? intl.formatMessage({ id: "store/lead-time.fewPieces" })
        : isAvailable && hasStock
        ? intl.formatMessage({ id: "store/lead-time.inStock" })
        : leadTime == "1" || leadTime == "7" || leadTime == "14"
        ? intl.formatMessage({ id: `store/lead-time.${leadTime}DayLeadTime` })
        : intl.formatMessage({ id: "store/lead-time.outOfStock" });

    setLeadTimeText(labelToPrint);
  };

  useEffect(() => {
    if (session && product) {
      let segmentToken = JSON.parse(atob(runtime.segmentToken));
      let channel =
        segmentToken?.channel == null
          ? session?.namespaces?.store?.channel?.value
          : segmentToken?.channel;

      handleLeadDisplay(channel);
      handleLeadIcon(channel);
      handleLeadTimeText(channel);
    } else {
      if (error) {
        console.log(error.message);
      }
    }
  }, [session, product]);

  return (
    <>
      {!isSellable ? (
        <></>
      ) : (
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
