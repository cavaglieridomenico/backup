import React from "react";
import style from "./style.css";
import { useIntl } from "react-intl";
import { useOrderForm } from "vtex.order-manager/OrderForm";

const EmptyCartButton: StorefrontFunctionComponent = () => {
  const intl = useIntl();
  const {
    orderForm: { id },
  } = useOrderForm();

  const handleEmptyCart = () => {
    try {
      fetch(`/api/checkout/pub/orderForm/${id}/items/removeAll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }).then(() => window.location.reload());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={style.emptyCartContainer} onClick={handleEmptyCart}>
      <span className={style.emptyCartLabel}>
        {intl.formatMessage({
          id: "store/empty-cart-button.buttonLabel",
        })}
      </span>
    </div>
  );
};

export default EmptyCartButton;
