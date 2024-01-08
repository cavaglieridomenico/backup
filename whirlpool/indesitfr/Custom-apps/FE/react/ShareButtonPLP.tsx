import classnames from "classnames";
import React, { useState, useEffect } from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { useProduct } from "vtex.product-context";

export interface ShareButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
}

const CSS_HANDLES = [
  "shareButtonPLP__container",
  "shareButtonPLP__wrapper",
  "shareButtonPLP__iconIsOpenButton",
  "shareButtonPLP__iconIsCloseButton",
  "shareButtonPLP__iconIsOpen",
  "shareButtonPLP__shareLinkContainer",
  "shareButtonPLP__iconLink",
  "shareButtonPLP__shareTwitterContainer",
  "shareButtonPLP__iconTwitter",
  "shareButtonPLP__shareInstagramContainer",
  "shareButtonPLP__iconInstagram",
  "shareButtonPLP__shareFacebookContainer",
  "shareButtonPLP__iconFacebook",
  "shareButtonPLP__shareEmailContainer",
  "shareButtonPLP__iconEmail",
  "shareButtonPLP__shareWhatsappContainer",
  "shareButtonPLP__iconWhatsapp",
] as const;

export default function ShareButtonPLP({ classes }: ShareButtonProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const [openShareModal, setOpenShareModal] = useState(false);
  const [sitePosition, setSitePosition] = useState("");
  const { product } = useProduct();

  useEffect(() => {
    setSitePositionCheck();
  }, []);

  function setSitePositionCheck() {
    if (window.location.host) {
      setSitePosition(window.location.host.concat(product.link));
    }
  }

  //Collect the data needed for the web call
  // let productDescriptionUrl = "";
  // if (productDescriptionRaw.length > 1500) {
  //   productDescriptionUrl = `${productDescriptionRaw.substring(0, 1500)}...`;
  // } else {
  //   productDescriptionUrl = productDescriptionRaw;
  // }
  // productDescriptionUrl += `%0D%0A%0D%0A${sitePosition}`;

  const mailSubject = "Découvrez les appareils Indesit faciles à utiliser.";
  const mailBody = "Découvrez par vous-même les appareils électroménagers Indesit."+ sitePosition;

  //Create all share url
  const mailToCall =
    "mailto:?subject="+mailSubject+"&body="+mailBody+ "%0D%0A%0D%0A"+ " Parlez-en à un ami!";

    const twitterCall =
    "https://twitter.com/intent/tweet?text=" +
    "Appareils électroménagers Indesit"+ "%20%7C%20"+ "Indesit France" +
    "%0D%0A%0D%0A" +
    "Découvrez les appareils Indesit faciles à utiliser et obtenez plus d'informations. Cliquez pour voir les photos, les avis et les informations sur le produit." +
    "%0D%0A%0D%0A" +
    sitePosition;

  const facebookCall = "https://www.facebook.com/sharer/sharer.php?u=" + sitePosition;

  function copy() {
    const el = document.createElement("input");
    el.value = sitePosition;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  return (
    <>
      <script src="https://connect.facebook.net/it_IT/sdk.js#xfbml=1&version=v11.0" nonce="RBMj8fNK"></script>
      <div className={handles.shareButtonPLP__container}>
        <div
          style={{ maxWidth: openShareModal ? "293px" : "44px" }}
          className={handles.shareButtonPLP__wrapper}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <a href={facebookCall} style={{ display: "flex" }}>
            <div className={handles.shareButtonPLP__shareFacebookContainer}>
              <span className={handles.shareButtonPLP__iconFacebook} />
            </div>
          </a>
          <a href={twitterCall} style={{ display: "flex" }}>
            <div className={handles.shareButtonPLP__shareTwitterContainer}>
              <span className={handles.shareButtonPLP__iconTwitter} />
            </div>
          </a>
          <div className={handles.shareButtonPLP__shareWhatsappContainer}>
            <a
              href={`whatsapp://send?text=${sitePosition}Scopri gli elettrodomestici Indesit e ottieni maggiori informazioni!`}
              data-action="share/whatsapp/share"
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex" }}
            >
              <span className={handles.shareButtonPLP__iconWhatsapp} />
            </a>
          </div>
          <div className={handles.shareButtonPLP__shareEmailContainer}>
            <a href={mailToCall} style={{ display: "flex" }}>
              {<span className={handles.shareButtonPLP__iconEmail} />}
            </a>
          </div>
          <div
            className={handles.shareButtonPLP__shareLinkContainer}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              copy();
            }}
          >
            <span className={handles.shareButtonPLP__iconLink} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenShareModal(!openShareModal);
            }}
            className={classnames(
              openShareModal
                ? handles.shareButtonPLP__iconIsOpenButton
                : handles.shareButtonPLP__iconIsCloseButton
            )}
          >
            <span className={handles.shareButtonPLP__iconIsOpen} />
          </button>
        </div>
      </div>
    </>
  );
}
