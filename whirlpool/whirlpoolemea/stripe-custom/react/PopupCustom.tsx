import React, { useState, useEffect } from "react";
import { getCookie } from "./utils/cookieManager";
import { useCssHandles } from "vtex.css-handles";
import { IconClose } from "vtex.store-icons";

interface PopupCustomProps {
  children?: React.ReactNode;
}

const CSS_HANDLES = [
  "containerVisible",
  "containerHidden",
  "closeIcon",
] as const;

const PopupCustom: StorefrontFunctionComponent<PopupCustomProps> = ({
  children,
}) => {
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [isBannerClosed, setIsBannerClosed] = useState<any>("true");
  const handles = useCssHandles(CSS_HANDLES);

  useEffect(() => {
    // At render check if the user already closed the banner in cookies (should not be shown again)
    const isBanner = getCookie("isBannerClosed");
    setIsBannerClosed(isBanner);
  }, []);

  const closeBanner = () => {
    // Close the banner and set the preference in cookies
    setIsClosed(!isClosed);
    document.cookie = `isBannerClosed=true; expires=${new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * 365
    ).toUTCString()}; path=/`;
  };

  return (
    <>
      {isBannerClosed !== "true" && (
        <div
          className={
            !isClosed
              ? `${handles.containerVisible} ph3 w-100 animated flex justify-between items-center bg-near-white pv2 relative`
              : `${handles.containerHidden} dn`
          }
        >
          <div className="w-100">{children}</div>
          <button
            onClick={closeBanner}
            className="ma0 bg-transparent pointer bw0 pa3"
          >
            <IconClose size={20} type="line" />
          </button>
        </div>
      )}
    </>
  );
};

PopupCustom.schema = {
  title: "Stripe - Pop Up Custom",
  description: "Custom Banner with text and CTA for promos",
  type: "object",
  properties: {},
};

export default PopupCustom;
