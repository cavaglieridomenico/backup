import React from "react";
import { useCssHandles } from "vtex.css-handles";
import { useInterpolatedLink } from './modules/useInterpolatedLink'

export default function ButtonAssistenza({
    src,
    isBlank,
    text,
    isPrimary,
    menuName,
    gaEvent,
    callNowButton,
    callNowButtonENG
}) {
    const CSS_HANDLES = [
        "ButtonAssistenza__buttonContainer",
        "ButtonAssistenza__buttonWrapper",
        "ButtonAssistenza__buttonAnchorPrimary",
        "ButtonAssistenza__buttonAnchorSecondary"
    ];
    const { handles } = useCssHandles(CSS_HANDLES);

    const url = useInterpolatedLink(src);

    const analyticsCallback = () => {

        window.dataLayer = window.dataLayer || [];
        let analyticsJson = {
            event:gaEvent,
            callNowButton:callNowButtonENG? callNowButtonENG: callNowButton
        }
        
        if(menuName) 
            analyticsJson[menuName ]= labelGa
         
        window.dataLayer.push(analyticsJson);

    }


    return (
        <>
            <div className={handles.ButtonAssistenza__buttonContainer} onClick={analyticsCallback}>
                <div className={handles.ButtonAssistenza__buttonWrapper}>
                    <a className={isPrimary ? handles.ButtonAssistenza__buttonAnchorPrimary : handles.ButtonAssistenza__buttonAnchorSecondary} href={src ? url : undefined} target={isBlank ? "_blank" : undefined}>
                        {text}
                    </a>
                </div>
            </div>
        </>
    )
};