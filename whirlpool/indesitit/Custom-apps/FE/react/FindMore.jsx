import React from "react";
import { useCssHandles } from "vtex.css-handles";

export default function FindCode({ text }) {
  const CSS_HANDLES = ["FindCode__container", "FindCode__anchor"];

  const { handles } = useCssHandles(CSS_HANDLES);

  const analyticsCallback = () => {
    window.dataLayer = window.dataLayer || [];

    let analyticsJson = {
      event: "productCodeManualSearch",
      buttonName: "Where can I find the code?",
    };
    window.dataLayer.push(analyticsJson);
  };

  return (
    <>
      <div className={handles.FindCode__container} onClick={analyticsCallback}>
        <p className={handles.FindCode__anchor}>{text}</p>
      </div>
    </>
  );
}
