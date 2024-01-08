import { PayPalScriptProvider, PayPalMessages } from "@paypal/react-paypal-js";
import { useQuery } from "react-apollo";
import getAppSettings from "./graphql/settings.graphql";
import React, { useEffect } from "react";
import styles from "./style.css";
import { useProduct } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";
import { appInfos } from "./utils/appInfos";

const CSS_HANDLES = ["containerPayPal", "containerPayPalScript"] as const;
interface WindowGTM extends Window {
  dataLayer: any[];
}
const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];

interface AppSettings {
  clientId: string;
  locale: string;
}

export default function PaypalApp() {
  const handles = useCssHandles(CSS_HANDLES);
  const productContext = useProduct();

  const { data } = useQuery(getAppSettings, {
    ssr: false,
    variables: {
      app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version,
    },
  });
  async function getStringCategoryFromId(idCategory: string) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return fetch("/_v/wrapper/api/catalog/category/" + idCategory, options).then((response) => {
      return response.json();
    });
  }
  function getMacroCategory(category: any) {
    let catSplit = category?.split("_");
    let isAccesories = catSplit?.filter((value: any) => value === "AC");
    if (isAccesories.length > 0) {
      return catSplit[catSplit.length - 3] + "_" + catSplit[catSplit.length - 2];
    } else if (category.toLowerCase().includes("accessories")) {
      return "AC";
    } else {
      return catSplit[catSplit.length - 2];
    }
  }

  const pushPayPalWidgetEvent = () => {
    getStringCategoryFromId(productContext?.product.categoryId).then((result) => {
      const macroCat = getMacroCategory(result.AdWordsRemarketingCode);
      dataLayer.push({
        event: "paypal_widget",
        eventCategory: "Paypal Widget", // fixed value
        eventAction: 3, // dynamic value
        eventLabel: productContext?.product.productReference + " - " + productContext?.product.productName, // dynamic value
        paypal_monthly_instalment: 3, // dynamic value
        item_id: productContext?.product.productReference, // dynamic value
        item_name: productContext?.product.productName, // dynamic value
        item_category: result.AdWordsRemarketingCode, // dynamic value
        item_macrocategory: macroCat,
      });
    });
  };

  useEffect(() => {
    if (!data) {
      return;
    }
  }, [data]);

  const settings: AppSettings = data && JSON.parse(data?.publicSettingsForApp?.message);

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
          <PayPalMessages className={`${handles.containerPayPalScript}`} style={style} forceReRender={[]} amount={price} onClick={pushPayPalWidgetEvent} />
        </PayPalScriptProvider>
      )}
    </div>
  );
}
