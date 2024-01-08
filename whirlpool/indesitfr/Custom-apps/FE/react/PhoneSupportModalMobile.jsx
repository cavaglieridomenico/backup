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
  // "modalPhoneSupport__augustDisclaimerTextContainer",
  // "modalPhoneSupport__augustDisclaimerText",
  // "modalPhoneSupport__augustDisclaimerDescriptionContainer",
  // "modalPhoneSupport__augustDisclaimerDescription",
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
      ctaText: "Protection complémentaire",
      href: "../service#protegez-votre-equipment",
      target: "",
    },
    {
      ctaText: "Manuels d'utilisation",
      href: "../service#manuels-utilisation",
      target: "",
    },
    {
      ctaText: "Résolution en ligne",
      href: "../service/resolution-en-ligne",
      target: "",
    },
    {
      ctaText: "Intervention",
      href: "../service/intervention",
      target: "",
    },
  ];

  const [openPhoneSupportModalMobile, setOpenPhoneSupportModalMobile] =
    useState(isOpen);

  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  const CtaButtonSupport = ({ ctaText, href, target }) => {
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
            <button className={handles.ctaButtonSupport__wrapper}>
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
                  {"Besoin d'assistance? Contactez-nous"}
                </span>
              </div>
              <div className={handles.modalPhoneSupport__daysNumberContainer}>
                <span className={handles.modalPhoneSupport__daysNumber}>
                  <a
                    className={handles.modalPhoneSupport__daysNumberAnchor}
                    href="tel:+330969391234"
                  >
                    09.69.39.1234
                  </a>
                  <div
                    className={handles.modalPhoneSupport__containerSeparator}
                  >
                    <div className={handles.modalPhoneSupport__separator} />
                  </div>
                  {`Du lundi au vendredi de 9h à 19h \nSamedi de 9h à 17h* \n*prix d'un appel local, non surtaxé`}
                </span>
              </div>
              {/* <div className={handles.modalPhoneSupport__augustDisclaimerTextContainer}>
                <span className={handles.modalPhoneSupport__augustDisclaimerText}>
                  {"Horaires exceptionnels"}
                  <br/>
                  {"Août 2023 :"}
                </span>
                <div className={handles.modalPhoneSupport__augustDisclaimerDescriptionContainer}>
                  <span className={handles.modalPhoneSupport__augustDisclaimerDescription}>
                    {"Du lundi au vendredi de 9h à 17h"}
                    <br/>
                    {"Fermeture le samedi et le dimanche."}
                  </span>
                </div>
              </div> */}
              <div className={handles.modalPhoneSupport__containerSeparator}>
                <div className={handles.modalPhoneSupport__separator} />
              </div>
              {/* <div
                className={handles.modalPhoneSupport__warrantyNumberContainer}
              >
                <span className={handles.modalPhoneSupport__warrantyNumber}>
                  {
                    "Service garantie | 09.69.39.1234*\nDépannage | 09.69.39.1234*\nAutres | 09.69.39.1234*"
                  }
                </span>
              </div> */}
            </div>
            <div className={handles.modalSpecial__contentItems}>
              <span className={handles.modalPhoneSupport__titleWhere}>
                Choisissez l'un de nos services et découvrez les avantages qui
                vous sont réservés!
              </span>
              <div
                className={handles.modalPhoneSupport__ctaContainer}
                style={{ marginLeft: "auto", marginRight: "auto" }}
              >
                {ctaData &&
                  ctaData.map((data) => {
                    return (
                      <CtaButtonSupport
                        ctaText={data.ctaText}
                        href={data.href}
                        target={data.target}
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
