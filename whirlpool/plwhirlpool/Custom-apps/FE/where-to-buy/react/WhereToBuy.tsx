import React, { useLayoutEffect } from "react";
import { useProduct } from "vtex.product-context";
import { useIntl, defineMessages } from "react-intl";
import { useCssHandles } from "vtex.css-handles";
import { usePixel } from "vtex.pixel-manager";

interface WhereToBuyProps {
  idDataAsset: string;
}

const CSS_HANDLES = ["wheretobuy"];

const messages = defineMessages({
  whereToBuy: { id: "store/where-to-buy.action" },
});

const WhereToBuy: StorefrontFunctionComponent<WhereToBuyProps> = ({
  idDataAsset = "1318",
}) => {
  const productContextValue = useProduct();
  const { push } = usePixel();

  const intl = useIntl();
  const handleAddToCart: React.MouseEventHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    push({ event: "store_locator_from_product" });
  };

  const handles = useCssHandles(CSS_HANDLES);

  useLayoutEffect(() => {
    let previousScript: any;

    if (!(document as Document).getElementById("wheretobuyscript")) {
      const script = document.createElement("script");
      script.src =
        "https://cscoreproweustor.blob.core.windows.net/widget/scripts/cswidget.loader.js";

      script.setAttribute("type", "text/javascript");
      script.setAttribute("id", "wheretobuyscript");
      // script.setAttribute('defer', '')
      const head = document.querySelector("head");
      head?.appendChild(script);
      previousScript = script;
    }

    return () => {
      // Remove the script
      previousScript?.parentNode?.removeChild(previousScript); // remove from the DOM tree
      previousScript = null; // Trigger the garbage collector to free some RAM to avoi memory leak
      // Remove the button
      (document as Document).getElementById("cswidgetjs")?.remove(); // Remove the script imported automatically
      (document as Document).getElementById("cswidgetstyle3")?.remove(); // Remove the style imported automatically
      (document as Document)
        .querySelectorAll(".csWidgetModal")
        .forEach((e: Element | null) => {
          e?.remove(); // remove from the DOM tree
          e = null; // Trigger the garbage collector to free some RAM to avoi memory leak
        });
    };
  }, []);

  return (
    <button
      className={`${handles.wheretobuy} cswidget`}
      data-asset-id={idDataAsset}
      onClick={handleAddToCart}
      data-product-sku={productContextValue.selectedItem.ean}
    >
      {intl.formatMessage(messages.whereToBuy)}
    </button>
  );
};

WhereToBuy.schema = {
  title: "WhereToBuy",
  description: "WhereToBuy",
  type: "object",
  properties: {
    idDataAsset: {
      title: "Data asset id",
      description: "",
      default: null,
      type: "string",
    },
  },
};

export default WhereToBuy;
