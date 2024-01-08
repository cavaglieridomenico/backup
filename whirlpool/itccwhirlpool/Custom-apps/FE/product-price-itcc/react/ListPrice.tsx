import React from "react";
import { usePrice } from "./context/PriceContext";
import style from "./style.css";

interface ListPriceProps {}

const ListPrice: React.FC<ListPriceProps> = ({}) => {
  const { listPrice, showListPrice } = usePrice();

  return (
    <>
      {showListPrice && (
        <div className={style.listPriceContainer}>
          <span className={style.listPrice}>{listPrice}</span>
        </div>
      )}
    </>
  );
};

export default ListPrice;
