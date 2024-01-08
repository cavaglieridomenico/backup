import React from "react";
import style from "./style.css";
import { useOrderForm } from "vtex.order-manager/OrderForm";
import { useIntl } from "react-intl";

const SummaryTotalizer: StorefrontFunctionComponent = () => {
  const intl = useIntl();
  const { orderForm } = useOrderForm();
  const { items } = orderForm;
  const currencySymbol = "€";

  console.log(orderForm, "orderForm");

  const [totalPrice, totalDiscount] = items?.reduce(
    (total: number[], item: any) => [
      total[0] + item.listPrice * item.quantity,
      total[1] + (item.listPrice - item.sellingPrice) * item.quantity,
    ],
    [0, 0]
  );

  const finalPrice = totalPrice - totalDiscount;

  const formatPrice = (price: number) =>
    `${(price / 100).toFixed(2).replace(".", ",")} ${currencySymbol}`;

  return (
    <>
      <div className={style.totalizersContainer}>
        <span className={style.totalPriceLabel}>
          {intl.formatMessage({
            id: "store/summary-totalizers-custom.totalPriceLabel",
          })}
        </span>
        <div className={style.price}>{formatPrice(totalPrice)}</div>
      </div>
      {totalDiscount != 0 && (
        <div className={style.totalizersContainer}>
          <span className={style.totalDiscountLabel}>
            {intl.formatMessage({
              id: "store/summary-totalizers-custom.totalDiscountLabel",
            })}
          </span>
          <div className={style.price}>{formatPrice(-totalDiscount)}</div>
        </div>
      )}
      {finalPrice != totalPrice && (
        <div className={style.totalizersContainer}>
          <span
            className={`${style.totalPriceLabel} ${style.finalPriceLabelMinicart}`}
          >
            {intl.formatMessage({
              id: "store/summary-totalizers-custom.finalPriceLabel",
            })}
          </span>
          <div className={`${style.price} ${style.finalPriceLabelMinicart}`}>
            {formatPrice(finalPrice)}
          </div>
        </div>
      )}
    </>
  );
};

SummaryTotalizer.schema = {
  title: "editor.basicblock.title",
  description: "editor.basicblock.description",
  type: "object",
};

export default SummaryTotalizer;
