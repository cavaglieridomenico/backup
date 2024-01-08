import React from "react";
import { usePrice } from "./context/PriceContext";
import style from "./style.css";

interface SellingPriceProps {
  showStar: boolean;
  isPdp: boolean;
}

const SellingPrice: React.FC<SellingPriceProps> = ({ showStar, isPdp }) => {
  const { sellingPrice, showSellingPrice, ecofeeValue, ecofee } = usePrice();

  return (
    <>
      {showSellingPrice && (
        <div className={style.sellingPriceContainer}>
          <span className={style.sellingPrice}>
            {showStar && <span className={style.sellingPriceSymbol}>*</span>}
            {sellingPrice}
          </span>
          {isPdp && !isNaN(ecofee) ? (
            <span className={style.ecofeeLabel}>
              *Dont {ecofeeValue} d'éco-part. DEEE
            </span>
          ) : (
            <span className={style.ecofeeLabelCards}>
              *Le prix comprend la TVA, la DEEE et les promotions
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default SellingPrice;
