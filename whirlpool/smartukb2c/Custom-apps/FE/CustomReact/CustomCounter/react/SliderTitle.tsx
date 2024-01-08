//@ts-nocheck
import React, { useState, useEffect } from 'react'
import styles from './styles.css'
import {
  MessageDescriptor,
  useIntl,
  defineMessages
} from 'react-intl'

interface SliderState {
  sliderHeader: string;
}

const messages = defineMessages({
  sliderWhirlpool: { id: 'store/countdown.sliderTitleWhirlpool' },
  sliderIndesit: { id: 'store/countdown.sliderTitleIndesit' },
  sliderBauknecht: { id: 'store/countdown.sliderTitleBauknecht' },
  detectLanguage: { id: "store/countdown.detectLanguage" },
  whirlpoolTitle: { id: "store/countdown.titleHomeWhirlpool" },
  indesitTitle: { id: "store/countdown.titleHomeIndesit" },
  bauknechtTitle: { id: "store/countdown.titleHomeBauknecht" }
})

const SliderTitle: StorefrontFunctionComponent = () => {

  const intl = useIntl()

  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)

  const [slider, setSlider] = useState<SliderState>({ sliderHeader: translateMessage(messages.sliderWhirlpool) })

  const [brand, setBrand] = useState("")

  useEffect(() => {/* 
    if(translateMessage(messages.detectLanguage)=="de" && window.location.pathname=="/"){
      location.pathname = `/de` 
    }  */
    let url = window && window.location ? window.location.href : "";
    let search = window.location.search;
    let search2 = window.location.href;
    if (url) {
      setBrand(url.includes("indesit") ? "indesit" : "hotpoint");
    }
    if (search.includes("whirlpool.ch") || search2.includes("whirlpool.ch")) {
      setSlider((prevState) => ({
        ...prevState, sliderHeader: translateMessage(messages.sliderWhirlpool)
      }))

      setTimeout(() => {

        if (document) { document.title = translateMessage(messages.whirlpoolTitle) }

      }, 5000);

    }

    else if (search.includes("indesit.ch") || search2.includes("indesit.ch")) {
      setSlider((prevState) => ({
        ...prevState, sliderHeader: translateMessage(messages.sliderIndesit)
      }))


      setTimeout(() => {

        if (document) { document.title = translateMessage(messages.indesitTitle) }

      }, 5000);


    }

    else if (search.includes("bauknecht.ch") || search2.includes("bauknecht.ch")) {
      setSlider((prevState) => ({
        ...prevState, sliderHeader: translateMessage(messages.sliderBauknecht)
      }))

      setTimeout(() => {

        if (document) { document.title = translateMessage(messages.bauknechtTitle) }

      }, 5000);

    }
  }, [])

  return (
    <div>
      {(brand === "indesit" ?
        <div className={styles.sliderHeaderWrapper}>
          <h1 className={styles.sliderHeaderTitle}> Welcome To Indesit Parts</h1>
          <h2 className={styles.sliderHeaderSubtitle}>Providing genuine spare parts and accessories direct from the manufacturer</h2>
          {/* <p className={styles.sliderHeader}>{slider.sliderHeader}</p> */}
        </div> :
        <div className={styles.sliderHeaderWrapper}>
          <h1 className={styles.sliderHeaderTitle}>Why Hotpoint Parts?</h1>
          <h2 className={styles.sliderHeaderSubtitle}>Original parts, direct from the manufacturer. Safe and Interchangeability Guaranteed</h2>
          {/* <p className={styles.sliderHeader}>{slider.sliderHeader}</p> */}
        </div>
      )}
    </div>
  )
}

export default SliderTitle
