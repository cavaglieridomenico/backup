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
  "shareButton__container",
  "shareButton__wrapper",
  "shareButton__iconIsOpenButton",
  "shareButton__iconIsCloseButton",
  "shareButton__iconIsOpen",
  "shareButton__shareLinkContainer",
  "shareButton__iconLink",
  "shareButton__shareTwitterContainer",
  "shareButton__iconTwitter",
  "shareButton__shareInstagramContainer",
  "shareButton__iconInstagram",
  "shareButton__shareFacebookContainer",
  "shareButton__iconFacebook",
  "shareButton__shareEmailContainer",
  "shareButton__iconEmail",
  "shareButton__shareWhatsappContainer",
  "shareButton__iconWhatsapp",
] as const;

export default function ShareButton({ classes }: ShareButtonProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const [openShareModal, setOpenShareModal] = useState(false);

  const [sitePosition, setSitePosition] = useState("");
  
  // const { product } = useProduct();
  // const { productName } = product;
  // const productDescriptionRaw = product.description;

  useEffect(() => {
    setSitePositionCheck();
  }, []);

  function setSitePositionCheck() {
    if (window.location.href) {
      setSitePosition(window.location.href);
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


  const mailSubject = "Scopri gli elettrodomestici Indesit";
  const mailBody = "Prova con mano gli affidabili elettrodomestici per la cucina e per la casa di Indesit. "+ sitePosition;

  //Create all share url
  const mailToCall =
    "mailto:?subject="+mailSubject+"&body="+mailBody+ "%0D%0A%0D%0A"+ "Condividilo con un amico!"; //+ productName + "&body=" + productDescriptionUrl;

    const twitterCall =
    "https://twitter.com/intent/tweet?text=" +
    "Elettrodomestici Indesit"+ "%20%7C%20"+ "Indesit Italia" +
    "%0D%0A%0D%0A" +
    "Scopri gli elettrodomestici Indesit e ottieni maggiori informazioni. Clicca per foto, recensioni e informazioni sul prodotto." +
    "%0D%0A%0D%0A" +
    // productName +
    // "%0D%0A%0D%0A" +
    // productDescriptionRaw +
    // "url=" +
    sitePosition;

  const facebookCall = "https://www.facebook.com/sharer/sharer.php?u="+
    window.location.href;
  
  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  return (
    <>
    <style>
      {'\
        \
    '
        }
    </style>
      <div id="fb-root"></div>
      <script src="https://connect.facebook.net/it_IT/sdk.js#xfbml=1&version=v11.0" nonce="RBMj8fNK"></script>
      <div className={handles.shareButton__container}>
        <div
          style={{ maxWidth: openShareModal ? "293px" : "44px" }}
          className={handles.shareButton__wrapper}
        >
          <a  href={facebookCall} className="fb-xfbml-parse-ignore">
            <div className={handles.shareButton__shareFacebookContainer}>
              <span className={handles.shareButton__iconFacebook} />
            </div>
          </a>
          <a href={ twitterCall } style={{ display: "flex" }}>
            <div className={handles.shareButton__shareTwitterContainer}>
              <span className={handles.shareButton__iconTwitter} />
            </div>
          </a>
          <div className={handles.shareButton__shareWhatsappContainer}>
            <a
              href={`whatsapp://send?text=${sitePosition} Scopri gli elettrodomestici Indesit e ottieni maggiori informazioni!`}
              data-action="share/whatsapp/share"
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex" }}
            >
              <span className={handles.shareButton__iconWhatsapp} />
            </a>
          </div>
          <div className={handles.shareButton__shareEmailContainer}>
            <a href={mailToCall} style={{ display: "flex" }}>
              <span className={handles.shareButton__iconEmail} />
            </a>
          </div>
          <div
            className={handles.shareButton__shareLinkContainer}
            onClick={copy}
          >
            <span className={handles.shareButton__iconLink} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenShareModal(!openShareModal);
            }}
            className={classnames(
              openShareModal
                ? handles.shareButton__iconIsOpenButton
                : handles.shareButton__iconIsCloseButton
            )}
          >
            <span className={handles.shareButton__iconIsOpen} />
          </button>
        </div>
      </div>
    </>
  );
}
