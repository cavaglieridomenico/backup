import React from "react";
import { useCssHandles } from "vtex.css-handles";
import { useInterpolatedLink } from './modules/useInterpolatedLink'

export default function ButtonCallNowOOW({
    src,
    isBlank,
    text,
    isPrimary,
    // menuName,
    gaEvent,
}) {
  console.log('eeeeee 222222222222222',isBlank)
    const CSS_HANDLES = [
        "ButtonCallNowOOW__buttonContainer",
        "ButtonCallNowOOW__buttonWrapper",
        "ButtonCallNowOOW__buttonAnchorPrimary",
        "ButtonCallNowOOW__buttonAnchorSecondary"
    ];
    const { handles } = useCssHandles(CSS_HANDLES);
    const url = useInterpolatedLink(src);
    console.log("src",src)
    console.log("url",url)


    const analyticsCallback = () => {

        window.dataLayer = window.dataLayer || [];
        let analyticsJson = {
            "event": gaEvent,
            "eventCategory": "CTA Click",
            "eventAction": "Support",
            "eventLabel": `Call now Popup`,
            event:gaEvent,
        }
        window.dataLayer.push(analyticsJson);

    }


    return (
        <>
            <div className={handles.ButtonCallNowOOW__buttonContainer} onClick={analyticsCallback}>
                <div className={handles.ButtonCallNowOOW__buttonWrapper}>
                    <a className={isPrimary ? handles.ButtonCallNowOOW__buttonAnchorPrimary : handles.ButtonCallNowOOW__buttonAnchorSecondary} href={src ? url : undefined} target={isBlank ? "_blank" : undefined}>
                        {text}
                    </a>
                </div>
            </div>
        </>
    )
};
