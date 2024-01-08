/* eslint-disable no-console */
import React, { useEffect } from "react";
import { NoSSR, useRuntime } from "vtex.render-runtime";
import { HashRouter } from "react-router-dom";
import { CartContextProvider, useCart } from "./providers/cart";
import {OrderContextProvider, useOrder} from "./providers/orderform"
import { AppSettingsContextProvider } from "./providers/appSettings";

interface CheckoutContainer {
  enforceLogin?: boolean;
}

const Cart: React.FC<CheckoutContainer> = ({ children }) => {
  const { orderLoading, hasItems } = useOrder();
  const { push } = useCart();
  const { navigate } = useRuntime();

  useEffect(() => {
    if (orderLoading) {
      return;
    }
    if (!hasItems) {
      navigate({
        page: "store.checkout.cart-add",
      });

      return;
    }
  }, [hasItems, orderLoading]);

  useEffect(() => {
    push({ event: "cartLoaded", data: "cart loaded" });
  }, []);

  return <>{children}</>;
};

const ContainerCart: React.FC<CheckoutContainer> = ({ children }) => {
  return (
    <NoSSR>
      <HashRouter>
        <OrderContextProvider>
            <CartContextProvider>
              <AppSettingsContextProvider>
                <Cart>{children}</Cart>
              </AppSettingsContextProvider>
            </CartContextProvider>
        </OrderContextProvider>
      </HashRouter>
    </NoSSR>
  );
};

export default ContainerCart;
