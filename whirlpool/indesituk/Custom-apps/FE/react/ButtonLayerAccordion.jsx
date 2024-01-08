import React, {useEffect, useState} from "react";
import { useCssHandles } from "vtex.css-handles";
import {usePixel} from "vtex.pixel-manager"

export default function ButtonLayerAccordion({
   richTextENG,
   richText,   // Dynamic value text clicked
   paddingTop
}) {
    const {push} = usePixel()
   
    const CSS_HANDLES = [
        "ButtonAccordionLayer_SingleRow",
        "ButtonAccordionLayer_SingleRowFirst",
        "ButtonAccordionLayer__Col5",
        "ButtonAccordionLayer__buttonAnchor", 
        "ButtonAccordionLayer__arrow_active",
        "ButtonAccordionLayer__arrow_disable"

    ];
    const { handles } = useCssHandles(CSS_HANDLES);
    const [isClicked,setIsCLicked]=useState(true)

    useEffect(() => {
        document.querySelector(".vtex-reviews-and-ratings-2-x-loginLink")?.href ? document.querySelector(".vtex-reviews-and-ratings-2-x-loginLink").removeAttribute("href") : "";
    }, [])

    const analyticsCallback = () => {
        push({event: "extra_info_interaction", extraInfoInteraction: [{type: 'plus button'}]})
    }

    return (
        <>
            <div className={paddingTop?handles.ButtonAccordionLayer_SingleRowFirst:handles.ButtonAccordionLayer_SingleRow} onClick={()=>{analyticsCallback();setIsCLicked(!isClicked)}}>
                <div className={handles.ButtonAccordionLayer__Col5}>
                    <a className={handles.ButtonAccordionLayer__buttonAnchor}>
                        {richText}
                    </a>
                </div>
                <div className={handles.ButtonAccordionLayer__Col5}>
                    <img className={isClicked?handles.ButtonAccordionLayer__arrow_active:handles.ButtonAccordionLayer__arrow_disable}>
                        {"accordion"}
                    </img>
                </div>
            </div>
        </>
    )
};
