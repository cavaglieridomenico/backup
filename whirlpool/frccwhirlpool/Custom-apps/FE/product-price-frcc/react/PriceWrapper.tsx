import React, { useState, useEffect } from "react";
import SellingPrice from "./SellingPrice";
import ListPrice from "./ListPrice";
import style from "./style.css";
import { useProduct, ProductTypes } from "vtex.product-context";
import { useRenderSession } from "vtex.session-client";

interface PriceContainerProps {
  showStar: boolean;
  isPdp: boolean;
}

interface WindowRuntime extends Window {
  __RUNTIME__: any;
}

const PriceWrapper: React.FC<PriceContainerProps> = ({
  showStar = true,
  isPdp = false,
}) => {
  const productContext = useProduct();
  let runtime = ((window as unknown) as WindowRuntime).__RUNTIME__;

  const [currentSc, setCurrentSc] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [outOfStock, setOutOfstock] = useState(false);
  const { session, error } = useRenderSession();

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

  function getDefaultSeller(sellers?: ProductTypes.Seller[]) {
    if (!sellers) {
      return undefined;
    }

    const defaultSeller = sellers.find((seller) => seller.sellerDefault);

    if (defaultSeller) {
      return defaultSeller;
    }

    return sellers[0];
  }

  const getSpecificationValue = (specName: string) => {
    const showPriceSpecIndex = productContext?.product?.properties
      ?.map((productSpecification: any) => productSpecification.name)
      .indexOf(specName);
    const showPriceString =
      showPriceSpecIndex &&
      showPriceSpecIndex !== -1 &&
      productContext?.product?.properties[showPriceSpecIndex].values[0];
    const showPrice = showPriceString === "true" ? true : false;
    return showPrice;
  };

  const handleShowPrice = () => {
    const isDiscontinued = getSpecificationValue("isDiscontinued");
    const community = getCommunityFromSalesChannel(currentSc);

    if (community !== "") {
      let showPrice = getSpecificationValue(`showPrice${community}`);
      let sellable = getSpecificationValue(`sellable${community}`);

      if (
        (showPrice && outOfStock) ||
        isDiscontinued ||
        !sellable ||
        !showPrice
      )
        setIsAvailable(false);
      else setIsAvailable(true);
      return true;
    } else {
      setIsAvailable(false);
      return false;
    }
  };

  useEffect(() => {
    if (session) {
      if (JSON.parse(atob(runtime.segmentToken)).channel === null) {
        setCurrentSc(session?.namespaces?.store?.channel?.value);
      } else {
        setCurrentSc(JSON.parse(atob(runtime.segmentToken)).channel);
      }
    } else {
      if (error) {
        console.log(error.message);
      }
    }
  }, [session]);

  useEffect(() => {
    if (productContext) {
      const seller = getDefaultSeller(productContext?.selectedItem?.sellers);
      const commercialOffer = seller?.commertialOffer;
      setOutOfstock(
        !commercialOffer || commercialOffer?.AvailableQuantity <= 0
          ? true
          : false
      );
      handleShowPrice();
    }
  }, [currentSc, productContext]);

  if (isAvailable) {
    return (
      <div className={style.productPriceContainer}>
        <ListPrice />
        <SellingPrice showStar={showStar} isPdp={isPdp} />
      </div>
    );
  } else {
    return <></>;
  }
};

export default PriceWrapper;
