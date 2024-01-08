import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";

const CSS_HANDLES = [
  "menuServiceLink__maxiContainer",
  "menuServiceLink__container",
  "menuServiceLink__containerImage",
  "menuServiceLink__wrapperStaticImage",
  "menuServiceLink__anchor",
  "menuServiceLink__arrowImage",
  "menuServiceLink__arrowImageContainer",
  "menuServiceLink__text",
  "menuServiceLink__textContainer"
];

export default function MenuServiceLink({
  menuName,
  text,
  isBlank,
  src,
  labelGa
}) {
  const { handles } = useCssHandles(CSS_HANDLES);
  const url = useInterpolatedLink(src);
  const analyticsCallback = () => {
    window.dataLayer = window.dataLayer || [];

    let analyticsJson = {
      event: "clickMenuService",
      buttonName: labelGa,
    };
    if (menuName) analyticsJson[menuName] = menuName;
    window.dataLayer.push(analyticsJson);
  };

  return (
    <>
      {/* TEXT */}
      <div
        className={handles.menuServiceLink__container}
        onClick={analyticsCallback}
      >
        <a
          className={handles.menuServiceLink__anchor}
          href={src ? url : undefined}
          target={isBlank ? "_blank" : undefined}
        >
          <div className={handles.menuServiceLink__textContainer}>
            <span className={handles.menuServiceLink__text}>{text}</span>
            <span className={handles.menuServiceLink__arrowImage}></span>
          </div>
          {/*  <div className={handles.menuServiceLink__arrowImageContainer}>
            
          </div> */}
        </a>
      </div>
    </>
  );
}
