// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import Tilt from 'react-parallax-tilt';
import { FormattedMessage } from 'react-intl'
import PromotiesIcon from "./Icons/PromotiesIcon"

interface Promotions { }

interface PromotionStates {
  brand: string;
  bindingAddress: string;
}

const Promotions: StorefrontFunctionComponent<Promotions> = ({ }) => {

  const CSS_HANDLES = ["promotionsMainDiv", "promotionImages", "promotionTitle", "promotionsWrapper", "promotionFigure", "promotionsIcon"]
  const handles = useCssHandles(CSS_HANDLES)

  const [promotionState, setPromotionState] = useState<PromotionStates>({
    brand: "",
    bindingAddress: ""
  })

  useEffect(() => {
    let search = window.location.search;
    let search2 = window.location.href;
    let isIndesit = (search.includes("indesit") || search2.includes("indesit"));
    let isWhirlpool = (search.includes("whirlpool") || search2.includes("whirlpool"));
    let isBauknecht = (search.includes("bauknecht") || search2.includes("bauknecht"));
    let params = new URLSearchParams(window.location.search);
    setPromotionState((prevState) => ({
      ...prevState,
      brand: (isIndesit ? "indesit" : isBauknecht ? "bauknecht" : isWhirlpool ? "whirlpool" : ""),
      bindingAddress: `${(params.get("__bindingAddress"))}`
    }))
    let promos = [
      // document.querySelector('[data-menu="5"]'), DSP-283 --> Hide Small appliances
      document.querySelector('[data-menu="6"]')
    ] 
     promos.forEach((el: any) => {
      el.addEventListener('click', function (event: any) {
    
  
        document.querySelectorAll(".vtex-flex-layout-0-x-flexRowContent--headerMenuRow > div")[event.currentTarget.dataset.menu].firstElementChild.click();


      }, false);
    });
   
  }, [])

  return <div className={`${handles.promotionsMainDiv}`}>

    {/* DSP-283 --> Hide Small appliances
    <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
      <div className={`${handles.promotionsWrapper}`} data-menu="5">
        <figure className={`${handles.promotionFigure}`}>
          <img className={`${handles.promotionImages}`} src={"/arquivos/appliancesThumb.png"} />
          <FormattedMessage id="store/countdown.firstPromotionImage">
            {message => <h3 className={`${handles.promotionTitle}`} >{message}</h3>}
          </FormattedMessage>
        </figure>
      </div>
    </Tilt> */
    }


    <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
      <div className={`${handles.promotionsWrapper}`} data-menu="6">
        <figure className={`${handles.promotionFigure}`}>
          <img className={`${handles.promotionImages}`} src={"/arquivos/cleaning.png"} />
          <FormattedMessage id="store/countdown.secondPromotionImage">
            {message => <h3 className={`${handles.promotionTitle}`} >{message}</h3>}
          </FormattedMessage>
        </figure>
      </div>
    </Tilt>
    {/*
    <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
      <div className={`${handles.promotionsWrapper}`} onClick={() => window.location.href = `promoties?__bindingAddress=${promotionState.bindingAddress}`}>
        <figure className={`${handles.promotionFigure}`}>
          <PromotiesIcon className={`${handles.promotionsIcon}`} />
          <img className={`${handles.promotionImages}`} src={"/arquivos/placeholderNew.png"} />
          <FormattedMessage id="store/countdown.thirdPromotionImage">
            {message => <h3 className={`${handles.promotionTitle}`} >{message}</h3>}
          </FormattedMessage>
        </figure>
      </div>
    </Tilt>
  */}


  </div>
}

export default Promotions
