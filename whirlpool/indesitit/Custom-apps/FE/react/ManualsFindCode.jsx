import React from "react";
import { useCssHandles } from "vtex.css-handles";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";

const CSS_HANDLES = [
  "ManualsFindCode__anchor",
  "ManualsFindCode__textContainer",
  "ManualsFindCode__text",
];

export default function ManualsFindCode({
  menuName,
  src,
  text,
  labelGa,
  gaEvent,
}) {
  const { handles } = useCssHandles(CSS_HANDLES);
  const url = useInterpolatedLink(src);

  const analyticsCallback = () => {
    window.dataLayer = window.dataLayer || [];

    let analyticsJson = {
      event: "productCodeManualSearch",
      buttonName: labelGa,
    };
    if (menuName) analyticsJson[menuName] = menuName;
    window.dataLayer.push(analyticsJson);
  };

  return (
    <>
      <style>
        {
          "\
        html {\
          scroll-behavior: smooth;\
        }\
        \
        "
        }
      </style>
      <div
        className={handles.ManualsFindCode__anchorContainer}
        onClick={analyticsCallback}
      >
        <a
          className={handles.ManualsFindCode__anchor}
          href={src ? url : undefined}
        >
          <div className={handles.ManualsFindCode__textContainer}>
            <span className={handles.ManualsFindCode__text}>{text}</span>
          </div>
        </a>
      </div>
    </>
  );
}
