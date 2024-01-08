import React from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ToggleBannerFooter({ text }) {
  const CSS_HANDLES = ["ToggleBannerFooter__toggleContainer"];
  const { handles } = useCssHandles(CSS_HANDLES);

  const ToggleBanner = () => {
    const style = {};
    var banner = document.getElementById("onetrust-pc-sdk");

    banner.classList.remove("ot-hide");
    banner.style.removeProperty("display");
    banner.style.removeProperty("opacity");
    banner.style.removeProperty("visibility");

    var layer = document.getElementsByClassName(
      "onetrust-pc-dark-filter ot-fade-in"
    );

    layer.style.removeProperty("display");
    layer.style.remove("opacity");
    layer.style.remove("visibility");
  };

  return (
    <>
      <style>
        {
          "\
            .optanon-toggle-display {\
              color: #0090d0;\
              font-family: 'Roboto-Medium';\
              font-weight: 500 !important;\
              font-size: 16px;\
              line-height: 19px;\
              letter-spacing: 0.04em;\
              cursor: pointer;\
            }\
            @media screen and (max-width: 786px) {\
              .optanon-toggle-display {\
                font-size: 14px;\
              }\
            }\
            \
            "
        }
      </style>
      <div className={handles.ToggleBannerFooter__toggleContainer}>
        <a className="optanon-toggle-display" onClick={ToggleBanner}>
          {text}
        </a>
      </div>
    </>
  );
}
