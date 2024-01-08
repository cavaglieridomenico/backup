import React from 'react'
import { SliderLayout } from 'vtex.slider-layout';
import {StoreLink} from "bauknechtde.store-link-custom";
import { useBundle } from '../hooks/context'
import styles from "../style.css";

interface BundlesProductAdditionalInfosProps {
    sectionTitle?: string;
    firstText?: string;
    secondText?: string;
    thirdText?: string;
    fourthText?: string;
    itemNumber: number;
}

const BundlesProductAdditionalInfos: StorefrontFunctionComponent<BundlesProductAdditionalInfosProps> = (props) => {

    const {sectionTitle, itemNumber, children} = props;
    const {selectedCard, kitItems} = useBundle();
    const index = itemNumber;
    const sliderConfigs = {
        infinite: true,
        itemsPerPage: {
            desktop: 1,
            tablet: 1,
            phone: 1
        },
        fullWidth: false
    }
    const storeLinkConfigs = {
        displayMode: "button"
    }

  return (
        <>
            {selectedCard === index ? (
                <div key={index} className={styles.additionalInfosWrapper}>
                    <h3 className={styles.additionalInfosTitle}>{sectionTitle}</h3>
                    <div className={styles.additionalInfosContainer}>
                        <div className={styles.additionalInfosTextContainer}>
                            {children}
                        </div>
                        <div className={styles.additionalInfosSliderContainer}>
                            <SliderLayout {...sliderConfigs}>
                                {kitItems?.[index]?.sku?.images.slice(0, 3).map((item: any, index: any) => (
                                    <img key={index} src={item.imageUrl} alt={item.imageText} />
                                ))}
                            </SliderLayout>
                        </div>
                    </div>
                    <div className={styles.additionalInfosCtaContainer}>
                        {/* <StoreLink href={`/${kitItems?.[index]?.product?.linkText}/p`} label="Produkt ansehen" {...storeLinkConfigs} /> */}
                        <StoreLink href={"/landings/herd-und-backofensets"} label="Alle Sets entdecken" {...storeLinkConfigs} />
                    </div>
                </div>
            ) : null}
        </>
  )
}

export default BundlesProductAdditionalInfos

BundlesProductAdditionalInfos.schema = {
  title: "[BUNDLES] - Additional Infos",
  description: "Change the texts in the additional infos container",
  type: "object",
  properties: {
        sectionTitle: {
            title: "Section Title",
            description: "Section Title of additional infos",
            default: "Title of Section",
            type: "string"  
        }
    }
}