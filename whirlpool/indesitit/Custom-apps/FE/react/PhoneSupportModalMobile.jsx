import React, { useState, useEffect, useCallback } from "react";
import classnames from "classnames";
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "bannerProductBuyOnline__wrapperOpen",
  "bannerProductBuyOnline__wrapper",
  "modalPhoneSupport__background",
  "modalPhoneSupport__background__open",
  "modalPhoneSupport__container",
  "modalPhoneSupport__container__open",
  "modalPhoneSupport__buttonContainer",
  "modalPhoneSupport__buttonClose",
  "modalPhoneSupport__closeIcon",
  "modalSpecial__contentItems",
  "modalPhoneSupport__titleWhere",
  "modalPhoneSupport__subtitle",
  "modalSpecial__imageButtonContainer",
  "modalPhoneSupport__scroller",
  "modalPhoneSupport__scrollerOpen",
  "modalPhoneSupport__modalOpenOverflow",
  "modalPhoneSupport__ctaContainer",
  // Other
  "buttonSpecial__iconBuy",
  "buttonSpecial__container",
  "buttonSpecial__label",
  //CTA BUTTON
  "ctaButtonSupport__row",
  "ctaButtonSupport__container",
  "ctaButtonSupport__wrapper",
  "ctaButtonSupport__textContainer",
  "ctaButtonSupport__text",
  "ctaButtonSupport__iconContainer",
  "ctaButtonSupport__icon",
  // SECTION NUMBERS
  "modalPhoneSupport__numbersContainer",
  "modalPhoneSupport__titleNumberContainer",
  "modalPhoneSupport__titleNumber",
  "modalPhoneSupport__daysNumberContainer",
  "modalPhoneSupport__daysNumber",
  "modalPhoneSupport__daysNumberAnchor",
  "modalPhoneSupport__warrantyNumberContainer",
  "modalPhoneSupport__warrantyNumber",
  // SEPARATOR
  "modalPhoneSupport__containerSeparator",
  "modalPhoneSupport__separator",
];

export default function PhoneSupportModalMobile({
  isOpen = false,
  classes,
  handleClose,
}) {

  const ctaData = [
    {
      ctaText: "Piani di protezione",
      href: "#piani-di-protezione",
      target: "",
      gaEvent: "Protection plans",
      labelGa: "Learn more",
    },
    {
      ctaText: "Manuali",
      href: "#manuali",
      target: "",
      gaEvent: "Manuals",
      labelGa: "Go to manuals",
    },
    {
      ctaText: "Risoluzione dei problemi",
      href: "#problemi-e-soluzioni",
      target: "",
      gaEvent: "Troubleshooting",
      labelGa: "Learn more",
    },
    {
      ctaText: "Intervento",
      href: "/richiedi-un-intervento",
      target: "",
      gaEvent: "Intervention",
      labelGa: "Book now",
    },
  ];

  const analyticsCallback = (gaEvent, labelGa) => {
    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: 'clickMenuServiceModal',
      menuName: gaEvent,
      buttonName: labelGa,
    }
    window.dataLayer.push(analyticsJson);

  }
  const [openPhoneSupportModalMobile, setOpenPhoneSupportModalMobile] =
    useState(isOpen);

  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  const CtaButtonSupport = ({ ctaText, href, target, gaEvent, labelGa }) => {
    const { handles } = useCssHandles(CSS_HANDLES);

    return (
      <>
        <div className={handles.ctaButtonSupport__row}>
          <a
            onClick={() => {
              if (handleClose) {
                handleClose();
              }
            }}
            className={handles.ctaButtonSupport__container}
            href={href}
            target={target}
          >
            <button className={handles.ctaButtonSupport__wrapper} onClick={()=>analyticsCallback(gaEvent, labelGa)}>
              <div className={handles.ctaButtonSupport__textContainer}>
                <div className={handles.ctaButtonSupport__text}>{ctaText}</div>
              </div>
              <div className={handles.ctaButtonSupport__iconContainer}>
                <span className={handles.ctaButtonSupport__icon}></span>
              </div>
            </button>
          </a>
        </div>
      </>
    );
  };

  useEffect(() => {
    setOpenPhoneSupportModalMobile(isOpen);
  }, [isOpen]);

  const removeScrollToBodyInVtex = useCallback(() => {
    if (openPhoneSupportModalMobile) {
      document
        .querySelector("body")
        ?.classList.add(handles.modalPhoneSupport__modalOpenOverflow);
    } else {
      document
        .querySelector("body")
        ?.classList.remove(handles.modalPhoneSupport__modalOpenOverflow);
    }
  }, [
    openPhoneSupportModalMobile,
    handles.modalPhoneSupport__modalOpenOverflow,
  ]);

  useEffect(() => {
    removeScrollToBodyInVtex();
  }, [openPhoneSupportModalMobile, removeScrollToBodyInVtex]);

  return (
    <>
      <style>
        {
          "\
        .bg-base{\
          overflow-x:hidden;\
        }\
        html {\
          scroll-behavior: smooth;\
        }\
      "
        }
      </style>
      <div
        className={classnames(
          handles.bannerProductBuyOnline__wrapper,
          openPhoneSupportModalMobile
            ? handles.bannerProductBuyOnline__wrapperOpen
            : ""
        )}
      >
        <div
          className={classnames(
            handles.modalPhoneSupport__background,
            openPhoneSupportModalMobile
              ? handles.modalPhoneSupport__background__open
              : ""
          )}
        />
        <div
          className={classnames(
            handles.modalPhoneSupport__scroller,
            openPhoneSupportModalMobile
              ? handles.modalPhoneSupport__scrollerOpen
              : ""
          )}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (handleClose) {
              handleClose();
            }
          }}
        >
          <div
            className={classnames(
              handles.modalPhoneSupport__container,
              openPhoneSupportModalMobile
                ? handles.modalPhoneSupport__container__open
                : ""
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className={handles.modalPhoneSupport__buttonContainer}>
              <button
                className={handles.modalPhoneSupport__buttonClose}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (handleClose) {
                    handleClose();
                  }
                }}
              >
                <span className={handles.modalPhoneSupport__closeIcon} />
              </button>
            </div>
            {/* Modal content */}
            <div className={handles.modalPhoneSupport__numbersContainer}>
              <div className={handles.modalPhoneSupport__titleNumberContainer}>
                <span className={handles.modalPhoneSupport__titleNumber}>
                  {"Assistenza clienti"}
                </span>
              </div>
              <div className={handles.modalPhoneSupport__daysNumberContainer}>
                <p className={handles.modalPhoneSupport__daysNumber}>
                  <a
                  className={handles.modalPhoneSupport__daysNumberAnchor}
                  href="tel:+39022030"
                  >
                    02.2030*
                  </a>
                  <br />
                  {" Numero Unico in Tutta Italia"}
                </p>
                <div className={handles.modalPhoneSupport__containerSeparator}>
                  <div className={handles.modalPhoneSupport__separator} />
                </div>
                <p className={handles.modalPhoneSupport__daysNumber}>
                  {
                    "Lun - Ven 8.00-19.00 "
                  }
                </p>
                <p className={handles.modalPhoneSupport__daysNumber}>
                  {
                    "Sab - Dom 9.00-13.00"
                  }
                </p>
                <p className={handles.modalPhoneSupport__daysNumber}>
                  {
                    "Giorni festivi esclusi"
                  }
                </p>
                <p className={handles.modalPhoneSupport__daysNumber}>
                  {
                    "*Al costo di una chiamata a rete fissa secondo il piano tariffario previsto dal proprio operatore."
                  }
                </p>
              </div>
              <div className={handles.modalPhoneSupport__containerSeparator}>
                <div className={handles.modalPhoneSupport__separator} />
              </div>
              <div
                className={handles.modalPhoneSupport__warrantyNumberContainer}
              >
                {/* <span className={handles.modalPhoneSupport__warrantyNumber}>
                  {
                    "Servizio di garanzia | 09.69.39.1234 Risoluzione dei problemi | 09.69.39.1235 Altri | 09.69.39.1236"
                  }
                </span> */}
              </div>
            </div>
            <div className={handles.modalSpecial__contentItems}>
              <span className={handles.modalPhoneSupport__titleWhere}>
                Scegliete uno dei nostri servizi e scoprite tutti i vantaggi che vi sono riservati!​​​​​​​
              </span>
              <div className={handles.modalPhoneSupport__ctaContainer} style={{ marginLeft: "auto", marginRight: "auto" }}>
                {ctaData &&
                  ctaData.map((data) => {
                    return (
                      <CtaButtonSupport
                        ctaText={data.ctaText}
                        href={"../assistenza" + data.href}
                        target={data.target}
                        gaEvent={data.gaEvent}
                        labelGa={data.labelGa}

                      />
                    );
                  })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
