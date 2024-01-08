import React from "react";
import { useCssHandles } from "vtex.css-handles";
import { useInterpolatedLink } from './modules/useInterpolatedLink'

const ButtonCallNowOOW: StorefrontFunctionComponent = ({
    src,
    isBlank,
    text,
    isPrimary,
    // menuName,
    gaEvent,
    triggerModal = false,
    children
}) => {
    const CSS_HANDLES = [
        "ButtonCallNowOOW__buttonContainer",
        "ButtonCallNowOOW__buttonWrapper",
        "ButtonCallNowOOW__buttonAnchorPrimary",
        "ButtonCallNowOOW__buttonAnchorSecondary"
    ];
    const { handles } = useCssHandles(CSS_HANDLES);
    const url = useInterpolatedLink(src);
    console.log("src", src)
    console.log("url", url)


    const analyticsCallback = () => {
        //@ts-ignore
        window.dataLayer = window.dataLayer || [];
        let analyticsJson = {
            "event": gaEvent,
            "eventCategory": "CTA Click",
            "eventAction": "Support",
            "eventLabel": `Call now Popup`
        }
        //@ts-ignore
        window.dataLayer.push(analyticsJson);

    }


    return (
        <>
            <div className={handles.ButtonCallNowOOW__buttonContainer} onClick={analyticsCallback}>
                <div className={handles.ButtonCallNowOOW__buttonWrapper}>
                    {triggerModal
                        ? children
                        : <a className={isPrimary ? handles.ButtonCallNowOOW__buttonAnchorPrimary : handles.ButtonCallNowOOW__buttonAnchorSecondary} href={src ? url : undefined} target={isBlank ? "_blank" : undefined}>
                            {text}
                        </a>
                    }
                </div>
            </div>
        </>
    )
};

ButtonCallNowOOW.schema = {
    title: 'ButtonCallNowOOW',
    description: 'ButtonCallNowOOW',
    type: 'object',
    properties: {
        triggerModal: {
            title: 'trigger Modal',
            description: '',
            default: false,
            type: 'boolean',
        },
        src: {
            title: 'SRC',
            description: 'define src',
            default: "",
            type: 'string',
        },

    }
}

export default ButtonCallNowOOW



