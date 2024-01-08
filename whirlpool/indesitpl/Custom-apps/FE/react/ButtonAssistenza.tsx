import React, { useState, useEffect } from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
import PhoneSupportModalMobile from "./PhoneSupportModalMobile";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";
import { dataLayer } from "./Analytics";

export interface ButtonAssistenzaProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string;
  isBlank: boolean;
  text: string;
  isPrimary: boolean;
  menuName: string;
  gaEvent: string;
  labelGa: string;
  isGa4: boolean;
  typeGA4: string;
  menuNameENG: string;
  classes: CssHandlesTypes.CustomClasses<typeof useCssHandles>;
  isModalMobile: boolean;
}

export default function ButtonAssistenza({
  src,
  isBlank,
  text,
  isPrimary,
  menuName,
  gaEvent,
  labelGa,
  isGa4 = false,
  typeGA4 = "",
  menuNameENG,
  isModalMobile = false,
}: ButtonAssistenzaProps) {
  const CSS_HANDLES = [
    "ButtonAssistenza__buttonContainer",
    "ButtonAssistenza__buttonWrapper",
    "ButtonAssistenza__buttonAnchorPrimary",
    "ButtonAssistenza__buttonAnchorSecondary",
  ] as const;

  const { handles } = useCssHandles(CSS_HANDLES);
  const [objForm, setObjForm] = useState<Object>([]);
  const [clickListner, setClickListener] = useState(false);
  const [openModalSpecial, setOpenModalSpecial] = useState(false);
  const url = useInterpolatedLink(src);

  //GA4FUNREQ17
  const ga4AnalyticsObj = {
    event: "contacts_click",
    type: typeGA4,
  };

  useEffect(() => {
    // Dynamic capture of information about event
    if (labelGa === "Dowiedz się więcej") {
      labelGa = "Find out more";
    }
    setObjForm({
      ...objForm,
      event: gaEvent,
      buttonName: labelGa,
      menuName: menuNameENG ? menuNameENG : menuName,
    });

    return () => {
      setClickListener(!clickListner);
    };
  }, [clickListner]);

  const analyticsCallback = () => {
    dataLayer.push(objForm);

    //GA4FUNREQ17
    isGa4 ? dataLayer.push(ga4AnalyticsObj) : null;
  };

  return (
    <>
      <style>
        {
          "\
        .bg-base{\
          overflow-x:unset !important;\
        }\
      "
        }
      </style>
      <div
        className={handles.ButtonAssistenza__buttonContainer}
        onClick={() => {
          analyticsCallback();
          setClickListener(true);
        }}
      >
        <div className={handles.ButtonAssistenza__buttonWrapper}>
          <a
            className={
              isPrimary
                ? handles.ButtonAssistenza__buttonAnchorPrimary
                : handles.ButtonAssistenza__buttonAnchorSecondary
            }
            href={src ? url : undefined}
            target={isBlank ? "_blank" : undefined}
            onClick={() => (isModalMobile ? setOpenModalSpecial(true) : "")}
          >
            {text}
          </a>
        </div>
      </div>
      <PhoneSupportModalMobile
        isOpen={openModalSpecial}
        handleClose={() => setOpenModalSpecial(false)}
      />
    </>
  );
}
