import { PayPalScriptProvider, PayPalMessages } from "@paypal/react-paypal-js";
import { useQuery } from "react-apollo";
import getAppSettings from "./graphql/settings.graphql";
import React, { useEffect } from "react";
import styles from "./style.css";
import { useProduct } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";
import { appInfos } from "./utils/appInfos";

const CSS_HANDLES = ["containerPayPal"] as const;

interface AppSettings {
  clientId: string;
  locale: string;
}

export default function PaypalApp() {
  const handles = useCssHandles(CSS_HANDLES);

  const { data } = useQuery(getAppSettings, {
    ssr: false,
    variables: {
      app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }
  }, [data]);

  const settings: AppSettings = data && JSON.parse(data?.appSettings?.message);

  const productContext = useProduct();
  let price = productContext?.product?.priceRange?.sellingPrice?.highPrice;

  type Style = {
    layout: "text";
    align: "center";
  };

  const style: Style = {
    layout: "text",
    align: "center",
  };

  return (
    <div className={`${handles.containerPayPal} ${styles.containerPayPal}`}>
      {data && (
        <PayPalScriptProvider
          options={{
            "client-id": settings?.clientId,
            components: "messages",
            locale: settings?.locale,
            // currency: "USD",
            "enable-funding": "paylater",
          }}
        >
          <PayPalMessages style={style} forceReRender={[]} amount={price} />
        </PayPalScriptProvider>
      )}
    </div>
  );
}
