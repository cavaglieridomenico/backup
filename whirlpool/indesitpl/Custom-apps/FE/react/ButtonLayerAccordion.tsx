import React, { useState } from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
import { usePixel } from "vtex.pixel-manager";
export interface ButtonLayerAccordionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  richTextENG: string;
  richText: string;
  paddingTop: boolean;
  classes: CssHandlesTypes.CustomClasses<typeof useCssHandles>;
}

export default function ButtonLayerAccordion({
  //richTextENG,
  richText, // Dynamic value text clicked
  paddingTop,
}: ButtonLayerAccordionProps) {
  const { push } = usePixel();
  const CSS_HANDLES = [
    "ButtonAccordionLayer_SingleRow",
    "ButtonAccordionLayer_SingleRowFirst",
    "ButtonAccordionLayer__Col5",
    "ButtonAccordionLayer__buttonAnchor",
    "ButtonAccordionLayer__arrow_active",
    "ButtonAccordionLayer__arrow_disable",
  ] as const;
  const { handles } = useCssHandles(CSS_HANDLES);
  const [isClicked, setIsCLicked] = useState(true);

  const analyticsCallback = () => {
    push({
      event: "extra_info_interaction",
      extraInfoInteraction: [{ type: "plus button" }],
    });
  };

  return (
    <>
      <div
        className={
          paddingTop
            ? handles.ButtonAccordionLayer_SingleRowFirst
            : handles.ButtonAccordionLayer_SingleRow
        }
        onClick={() => {
          analyticsCallback();
          setIsCLicked(!isClicked);
        }}
      >
        <div className={handles.ButtonAccordionLayer__Col5}>
          <a className={handles.ButtonAccordionLayer__buttonAnchor}>
            {richText}
          </a>
        </div>
        <div className={handles.ButtonAccordionLayer__Col5}>
          <img
            className={
              isClicked
                ? handles.ButtonAccordionLayer__arrow_active
                : handles.ButtonAccordionLayer__arrow_disable
            }
          >
            {"accordion"}
          </img>
        </div>
      </div>
    </>
  );
}
