//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
import ThumpsUp from "./Icons/ThumpsUp"
import PencilIcon from "./Icons/PencilIcon"
import TruckIcon from "./Icons/TruckIcon"
import WashMachine from "./Icons/WashMachine"
import Uk from "./Icons/Uk"
import styles from "./styles.css"




interface CountdownProps {
  firstElement: string;
}

const Countdown: StorefrontFunctionComponent<CountdownProps> = () => {
  const CSS_HANDLES = ['countdownMain', "countdownInner", "countdownImage1", "countdownImage2"]
  const handles = useCssHandles(CSS_HANDLES)

  const [brand, setBrand] = useState("");

  console.log(brand)

  useEffect(() => {
    let url = window && window.location ? window.location.href : "";
    if (url) {
      setBrand(url.includes("indesit") ? "indesit" : "hotpoint");
    }
    var links = document.querySelectorAll(".vtex-menu-2-x-styledLink");
    var linksCards = document.querySelectorAll(".vtex-product-summary-2-x-clearLink");
    document.getElementsByClassName("vtex-store-components-3-x-logoLink")[0].onclick = function (e) {
      e.stopPropagation();

    };
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      link.href = link.href;
      link.onclick = function (e) {
        e.stopPropagation();
        window.dataLayer.push({
          'event': 'menuFooter',
          'eventCategory': 'Menu and Footer Clicks',
          'eventAction': 'Menu - ' + this.textContent,
          'eventLabel': this.href
        })
      };
    }
    for (var i = 0; i < linksCards.length; i++) {
      var link = linksCards[i];
      link.href = link.href;
      link.onclick = function (e) {
        if(e.target.classList[0].includes("button")){
          e.preventDefault();

        } else {
          e.stopPropagation();

        }
      };
    }

  }, [])

  return <div className={`${handles.countdownMain}`}>
    <div className={`${handles.countdownInner}`}>
      {/*<ThumpsUp className={`${handles.countdownImage1}`} />*/}
      <FormattedMessage id="store/countdown.firstElement">
        {message => <p>Genuine Parts</p>}
      </FormattedMessage>
    </div>
    <div className={`${handles.countdownInner}`}>
      {/*<TruckIcon className={`${handles.countdownImage1}`} />*/}
      <p>Next day delivery</p>
    </div>
    <div className={`${handles.countdownInner}`}>
      {(brand === "hotpoint" ?
        <a className={styles.contadownHeaderTrustpilotLink} href="https://uk.trustpilot.com/review/parts.hotpoint.co.uk" target="_blank">
          <div className={styles.contadownHeaderTrustpilot}>
            <div>
              Rated <b> 'Great' </b> on</div>
            <div>
              <img height="20" src="/arquivos/trustpilot-logo.png" alt="" />
              </div>
          </div>
        </a> :
        <a className={styles.contadownHeaderTrustpilotLink} href="https://uk.trustpilot.com/review/parts.indesit.co.uk" target="_blank">
          <div className={styles.contadownHeaderTrustpilot}>
            <div>
              Rated <b> 'Great' </b> on
            </div>
            <div>
              <img height="20" src="/arquivos/trustpilot-logo.png" alt="" />
              </div>
          </div>
        </a>
      )}
    </div>
    <div className={`${handles.countdownInner}`}>
      {/*<Uk className={`${handles.countdownImage1}`} />*/}
      Uk Customer Service
    </div>

    <div className={`${handles.countdownInner}`}>
      {/*<WashMachine className={`${handles.countdownImage1}`} />*/}
      Line drawings available

    </div>

  </div>
}


export default Countdown
