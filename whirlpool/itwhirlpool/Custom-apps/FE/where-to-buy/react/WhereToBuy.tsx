import React, { useEffect, useState } from 'react'
import { useProduct } from "vtex.product-context";
import style from "./style.css";
import { getRetailers } from './utils/wtbIntegration';

interface WhereToBuyProps {
  storeLocatorLink: string
}

const WhereToBuy: StorefrontFunctionComponent<WhereToBuyProps> = ({ storeLocatorLink }) => {
  const productContext = useProduct()
  const { name } = productContext.selectedItem
  const [retailers, setRetailers] = useState([])

  useEffect(() => {
    getRetailers(name)
      .then(response => response.json())
      .then(data => setRetailers(data.d));
  }, []);

  return (
    <>
      <div style={{ display: 'flex', margin: '1rem 2rem 2rem 2rem' }}>
        <div className={style.wtbTitleUnderline}>WH</div>
        <div className={style.wtbTitle}>ERE TO BUY</div>
      </div>
      <div className={style.retailerWrapper}>
        {retailers.map((element: any) => <div className={style.retailerItemContainer}>
          <img src={element.MerchantLogoUrl} />
          <button onClick={() => window.open(element.NavigateUrl, '_blank')} className={[style.buyNowButton, style.fromLeft].join(" ")}><span className={style.buyNowContent}>Buy now</span></button>
        </div>)}
        <div className={style.storeLocatorLinkContainer}><a className={style.storeLocatorLink} href={storeLocatorLink} target="_blank">Click here to find your nearest store.</a></div>
      </div>
    </>
  )
}

WhereToBuy.schema = {
  title: 'Where To Buy Label',
  description: 'editor.wheretobuy.description',
  type: 'object',
  properties: {
    storeLocatorLink: {
      title: 'Store Locator link',
      description: 'This is the Store Locator link',
      type: 'string',
      default: '/store-locator',
    },
  },
}

export default WhereToBuy

