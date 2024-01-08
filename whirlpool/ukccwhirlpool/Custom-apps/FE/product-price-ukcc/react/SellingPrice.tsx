import React from "react";
import { usePrice } from "./context/PriceContext";
import style from "./style.css";

interface SellingPriceProps {
  showStar: boolean;
}

const SellingPrice: React.FC<SellingPriceProps> = ({ showStar }) => {
  const { sellingPrice, showSellingPrice } = usePrice();

  return (
    <>
      {showSellingPrice && (
        <div className={style.sellingPriceContainer}>
          <span className={style.sellingPrice}>
            {showStar && <span className={style.sellingPriceSymbol}>*</span>}
            {sellingPrice}
          </span>
        </div>
      )}
    </>
  );
};

export default SellingPrice;
