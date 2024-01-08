import classnames from "classnames";
import React, { useState, useEffect } from "react";
import style from "./style.css"
// @ts-ignore
// import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
// import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { useProduct } from "vtex.product-context";

// export interface ShareButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
// }

// const CSS_HANDLES = [
//   "shareButton__container",
//   "shareButton__wrapper",
//   "shareButton__iconIsOpenButton",
//   "shareButton__iconIsCloseButton",
//   "shareButton__iconIsOpen",
//   "shareButton__shareLinkContainer",
//   "shareButton__iconLink",
//   "shareButton__shareTwitterContainer",
//   "shareButton__iconTwitter",
//   "shareButton__shareInstagramContainer",
//   "shareButton__iconInstagram",
//   "shareButton__shareFacebookContainer",
//   "shareButton__iconFacebook",
//   "shareButton__shareEmailContainer",
//   "shareButton__iconEmail",
//   "shareButton__shareWhatsappContainer",
//   "shareButton__iconWhatsapp",
// ] as const;

export default function ShareButton(props :any) {
  // const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const [openShareModal, setOpenShareModal] = useState(false);

  const [sitePosition, setSitePosition] = useState("");
  const [copied, setCopied] = useState(false)

  const isPlp = props.isPlp || false;

  const { product } = useProduct();
  const productName = product?.productName;
  const productDescriptionRaw = product?.description;
// console.log(productDescriptionRaw)
  useEffect(() => {
    setSitePositionCheck();
  }, []);

  function setSitePositionCheck() {
    if (window.location.href) {
      setSitePosition(window.location.href);
    }
  }

  const handleChange = (e: any) => {
    // e.preventDefault()
    e.stopPropagation()
    // e.stopImmediatePropagation()
  }

  //Collect the data needed for the web call
  // let productDescriptionUrl = "";
  // if (productDescriptionRaw.length > 1500) {
  //   productDescriptionUrl = `${productDescriptionRaw.substring(0, 1500)}...`;
  // } else {
  //   productDescriptionUrl = productDescriptionRaw;
  // }
  // productDescriptionUrl += `%0D%0A%0D%0A${sitePosition}`;


  const mailSubject = "Looking for your next kitchen or laundry appliance?";
  const mailBody = "Discover Hotpoint's top innovations and affordable prices. Check it out" + ' ' +sitePosition;

  //Create all share url
  const mailToCall =
    "mailto:?subject="+mailSubject+"&body="+mailBody; //+ productName + "&body=" + productDescriptionUrl;
  // const twitterCall =
  //   "https://twitter.com/intent/tweet?text=" +
  //   productName +
  //   "%0D%0A%0D%0A" +
  //   productDescriptionRaw +
  //   "url=" +
  //   sitePosition;

  // const facebookCall = "https://www.facebook.com/sharer/sharer.php?u="+
  //   window && window.location ? window.location.href : "";

  function copy(e:any) {
    e.stopPropagation();
    e.preventDefault();
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true)
    setTimeout(()=>{
      setCopied(false)
    },2000)
  }

  return (
    <>
      <style>
        {'\
        .render-container{\
          overflow-x: hidden !important;\
          overflow-y: hidden;\
        }\
        \
    '
        }
      </style>
      <div id="fb-root"></div>
      <script src="https://connect.facebook.net/it_IT/sdk.js#xfbml=1&version=v11.0" nonce="RBMj8fNK"></script>
      <div className={style.shareButton__container}>
        <div
          style={isPlp ? {maxHeight: openShareModal ? "360px" : "44px" } : { maxWidth: openShareModal ? "360px" : "44px" }}
          className={ isPlp ? style.shareButton__wrapper_Plp : style.shareButton__wrapper}
        >
          <a onClick={(e: any)=> handleChange(e)} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(sitePosition)}`} target="_blank" rel="noopener" className="fb-xfbml-parse-ignore">
            <div className={style.shareButton__shareFacebookContainer}>
              <span className={[style.shareButton__iconFacebook, style.shareButtonIcon].join(" ")} />
            </div>
          </a>
          <a onClick={(e: any)=> handleChange(e)} href={`https://twitter.com/share?url=${sitePosition}&text=${encodeURI(productDescriptionRaw)}&via=${productName}`} target="_blank" style={{ display: "flex" }}>
            <div className={style.shareButton__shareTwitterContainer}>
              <span className={[style.shareButton__iconTwitter, style.shareButtonIcon].join(" ")} />
            </div>
          </a>
          <a onClick={(e: any)=> handleChange(e)} href={`http://pinterest.com/pin/create/link/?url=${encodeURI(sitePosition)}`} target="_blank" style={{ display: "flex" }}>
            <div className={style.shareButton__sharePinterestContainer}>
              <span className={[style.shareButton__iconPinterest, style.shareButtonIcon].join(" ")} />
            </div>
          </a>
          <div className={style.shareButton__shareWhatsappContainer}>
            <a
            onClick={(e: any)=> handleChange(e)}
              href={`whatsapp://send?text=${encodeURI(sitePosition)} Looking for your next kitchen or laundry appliance? Discover Hotpoint's top innovations & affordable prices. Check it out.`}
              data-action="share/whatsapp/share"
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex" }}
            >
              <span className={[style.shareButton__iconWhatsapp,style.shareButtonIcon].join(" ")} />
            </a>
          </div>
          <div className={style.shareButton__shareEmailContainer}>
            <a
            onClick={(e: any)=> handleChange(e)}
             href={encodeURI(mailToCall)} style={{ display: "flex" }}>
              <span className={[style.shareButton__iconEmail, style.shareButtonIcon].join(" ")} />
            </a>
          </div>
          <div className={style.shareButton__shareLinkContainer} onClick={(e)=>copy(e)}>
            {
              copied  &&
              <div className={style.shareButton__copiedContainer}>
                <span className={isPlp ? style.shareButton__copiedPlp : style.shareButton__copied}>Copied</span>
              </div>

            }
            <span className={[style.shareButton__iconLink, style.shareButtonIcon].join(" ")} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenShareModal(!openShareModal);
            }}
            className={classnames(
              openShareModal
                ? style.shareButton__iconIsOpenButton
                : style.shareButton__iconIsCloseButton
            )}
          >
            <span className={style.shareButton__iconIsOpen} />
          </button>
        </div>
      </div>
    </>
  );
}
