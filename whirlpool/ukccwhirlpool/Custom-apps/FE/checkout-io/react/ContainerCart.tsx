/* eslint-disable no-console */
import React, { useEffect } from "react";
import { NoSSR, useRuntime } from "vtex.render-runtime";
import { HashRouter } from "react-router-dom";
import {
  CartOrderContextProvider,
  useCartOrder,
} from "./providers/cartOrderform";
import { CartContextProvider, useCart } from "./providers/cart";
import {OrderContextProvider} from "./providers/orderform"

interface CheckoutContainer {
  enforceLogin?: boolean;
}

const Cart: React.FC<CheckoutContainer> = ({ children }) => {
  const { cartOrderLoading, hasItems } = useCartOrder();
  const { push } = useCart();
  const { navigate } = useRuntime();

  useEffect(() => {
    if (cartOrderLoading) {
      return;
    }
    if (!hasItems) {
      navigate({
        page: "store.checkout.cart-add",
      });

      return;
    }
  }, [hasItems, cartOrderLoading]);

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
          <CartOrderContextProvider>
            <CartContextProvider>
              <Cart>{children}</Cart>
            </CartContextProvider>
          </CartOrderContextProvider>
        </OrderContextProvider>
      </HashRouter>
    </NoSSR>
  );
};

export default ContainerCart;
