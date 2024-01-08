import React, { useState, useEffect } from "react";
import { useCssHandles } from "vtex.css-handles";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";
import PhoneSupportModalMobile from "./PhoneSupportModalMobile";

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
}) {
  const CSS_HANDLES = [
    "ButtonAssistenza__buttonContainer",
    "ButtonAssistenza__buttonWrapper",
    "ButtonAssistenza__buttonAnchorPrimary",
    "ButtonAssistenza__buttonAnchorSecondary",
  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const [objForm, setObjForm] = useState([]);
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
    if (labelGa === "En savoir plus") {
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
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(objForm);

    //GA4FUNREQ17
    isGa4 ? window.dataLayer.push(ga4AnalyticsObj) : null;
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
