import React from "react";
import { usePrice } from "./context/PriceContext";
import style from "./style.css";

interface PromoBadgeProps {
  showPercentageBadge: boolean;
}

const PromoBadge: React.FC<PromoBadgeProps> = ({
  showPercentageBadge = false,
}) => {
  const { percentageDiscount, showListPrice } = usePrice();

  return (
    <>
      {showListPrice && showPercentageBadge ? (
        <div
          className={style.percentageBadgeContainer}
        >{`-${percentageDiscount}%`}</div>
      ) : null}
    </>
  );
};

export default PromoBadge;
