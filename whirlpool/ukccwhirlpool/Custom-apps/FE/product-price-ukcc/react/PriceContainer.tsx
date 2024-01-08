import React from "react";
import { PriceContextProvider } from "./context/PriceContext";
import SellingPrice from "./SellingPrice";
import ListPrice from "./ListPrice";
import PromoBadge from "./PromoBadge";
import style from "./style.css";

interface PriceContainerProps {
  showStar: boolean;
  showPercentageBadge: boolean;
  sellerID: string;
}

const PriceContainer: React.FC<PriceContainerProps> = ({
  showStar,
  showPercentageBadge,
  sellerID,
}) => {
  return (
    <PriceContextProvider sellerID={sellerID}>
      <div className={style.productPriceContainer}>
        <PromoBadge showPercentageBadge={showPercentageBadge} />
        <div className={style.productPriceWrapper}>
          <ListPrice />
          <SellingPrice showStar={showStar} />
        </div>
      </div>
    </PriceContextProvider>
  );
};

export default PriceContainer;
