import React, { useLayoutEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";


export default function StoreLocatorLandingPages() {
    const CSS_HANDLES = [
        "landingPages__storeLocatorContainerStyle",
        "landingPages__storeLocatorIconStyle",
        "landingPages__storeLocatorDescriptionStyle",
        "landingPages__storeLocatorDealerStyle",
        "landingPages__storeLocatorFindStyle",
        "landingPages__storeLocatorContainerStyleHidden",
        "landingPages__storeLocatorIconStyleContainer"

    ];

    const { handles } = useCssHandles(CSS_HANDLES);
    const [isStoreVisible, setIsStoreVisible] = useState(false);

    useLayoutEffect(() => {
        ////////////quando carifca il componente
        window.scrollTo(0, 0);
        window.slider1Scrolled = null;
        const m = disableScroll();

        return () => {
            /// quando il componente viene distrutto
            window.removeEventListener('scroll', m);
        };
    }, []);

    function disableScroll() {
        // if any scroll is attempted, set this to the previous value
        const metodoDaBindare = function () {
            /* if (containerSlider.getBoundingClientRect().top <= 500) {

                setIsStoreVisible(true);
            } */
            const element = document.getElementById('store-locator-container');

            if (element) {
                const distanceFromTopElement = element.offsetTop;
                /* const elementHeight = element.getBoundingClientRect().height; */
                const actualScrollPosition = window.scrollY;
                const screenHeight = window.innerHeight;

                if(actualScrollPosition + screenHeight >= distanceFromTopElement) {
                    setIsStoreVisible(true);
                }
            }
        }


        setTimeout(() => {
            window.addEventListener('scroll', metodoDaBindare);
        }, 100);
        return metodoDaBindare;
    }


    return (
        <>
            <div id="store-locator-container" className={isStoreVisible ? handles.landingPages__storeLocatorContainerStyle : handles.landingPages__storeLocatorContainerStyleHidden}>
                <a href="/store-locator">
                    <div className={handles.landingPages__storeLocatorIconStyleContainer}>
                        <div className={handles.landingPages__storeLocatorIconStyle}>

                        </div>
                    </div>
                    <div className={handles.landingPages__storeLocatorDescriptionStyle}>
                        <p className={handles.landingPages__storeLocatorDealerStyle}> Dealer Locator</p>

                        <p className={handles.landingPages__storeLocatorFindStyle}> Find a Indesit store near you!</p>
                    </div>
                </a>
            </div>
        </>
    );
}


//prova-branch