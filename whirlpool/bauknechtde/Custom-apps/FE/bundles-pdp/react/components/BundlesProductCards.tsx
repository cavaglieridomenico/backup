import React from 'react'
import { useBundle } from '../hooks/context'
import {RatingSummary} from "bauknechtde.custom-bazaarvoice-whirlpool";
import { SliderLayout } from 'vtex.slider-layout'
import styles from "../style.css";

const BundlesProductCards: StorefrontFunctionComponent = () => {

    const {kitItems, selectedCard, setSelectedCard} = useBundle();
    const isKit = kitItems?.length > 0;
    const paramsArray = kitItems?.map((item: any) => ({
        linkText: item?.product?.linkText,
        productId: item?.product?.productId,
        productReference: item?.product?.linkText?.split("-")?.reverse()?.[0]
    }))
    const sliderConfigs = {
        showPaginationDots: "never",
        fullWidth: false,
        itemsPerPage: {
            desktop: 1,
            tablet: 1,
            phone: 1
        }
    }
    
  return (
    <div className={styles.productCardsWrapper}>
        {window?.innerWidth <= 640 ? (
            <SliderLayout {...sliderConfigs}>
                {kitItems?.map((item: any, index: any) => (
                    <div style={{"border": `${selectedCard === index ? "1px solid #727273" : "1px solid transparent"}`}} className={styles.productCardContainer} onClick={() => setSelectedCard(index)} key={index}>
                        <img className={styles.productCardImage} src={item?.sku?.images?.[0].imageUrl} alt="Product Image" />
                        <p className={styles.productCardName}>{item?.product?.productName}</p>
                        <RatingSummary isKit={isKit} queryParams={paramsArray[index]} />
                    </div>
                ))}
            </SliderLayout>
        ) : (
            kitItems?.map((item: any, index: any) => (
                <div style={{"border": `${selectedCard === index ? "1px solid #727273" : "1px solid transparent"}`}} className={styles.productCardContainer} onClick={() => setSelectedCard(index)} key={index}>
                    <img className={styles.productCardImage} src={item?.sku?.images?.[0].imageUrl} alt="Product Image" />
                    <p className={styles.productCardName}>{item?.product?.productName}</p>
                    <RatingSummary isKit={isKit} queryParams={paramsArray[index]} />
                </div>
            ))  
        )}
    </div>
  )
}

export default BundlesProductCards