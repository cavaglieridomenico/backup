import React from "react";
import style from "./style.css";
import { useOrder } from "vtex.order-placed/OrderContext";
import { useIntl } from "react-intl";

const SummaryTotalizerTYP: StorefrontFunctionComponent = () => {
  const intl = useIntl();
  const { items } = useOrder();

  // const { items } = orderForm;
  const currencySymbol = "£";

  const [totalPrice, totalDiscount] = items?.reduce(
    (total: number[], item: any) => [
      total[0] +
        item.listPrice * item.quantity +
        item.bundleItems.reduce(
          (total: number, bundle: any) => total + bundle.price,
          0
        ),
      total[1] + (item.listPrice - item.sellingPrice) * item.quantity,
    ],
    [0, 0]
  );

  const finalPrice = totalPrice - totalDiscount;

  const formatPrice = (price: number) =>
    `${currencySymbol}${(price / 100)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  return (
    <div className={style.totalizersTYPWrapper}>
      <div className={style.totalizersContainerTYP}>
        <span className={style.totalPriceLabelTYP}>
          {`${intl.formatMessage({
            id: "store/summary-totalizers-custom.totalPriceLabel-typ",
          })} (${items?.length})`}
        </span>
        <div className={style.priceTYP}>{formatPrice(totalPrice)}</div>
      </div>
      {totalDiscount != 0 && (
        <div className={style.totalizersContainerTYP}>
          <span className={style.totalPriceLabelTYP}>
            {intl.formatMessage({
              id: "store/summary-totalizers-custom.totalDiscountLabel-typ",
            })}
          </span>
          <div className={style.priceTYP}>{formatPrice(-totalDiscount)}</div>
        </div>
      )}
      <div className={style.totalizersContainerTYP}>
        <span className={style.finalPriceLabel}>
          {intl.formatMessage({
            id: "store/summary-totalizers-custom.finalPriceLabel-typ",
          })}
        </span>
        <div className={style.finalPrice}>{formatPrice(finalPrice)}</div>
      </div>
    </div>
  );
};

SummaryTotalizerTYP.schema = {
  title: "editor.basicblock.title",
  description: "editor.basicblock.description",
  type: "object",
};

export default SummaryTotalizerTYP;
