import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ButtonLearnMoreInformation () {
    const CSS_HANDLES = [
        "ButtonLearnMoreInformation__show",
        "ButtonLearnMoreInformation__hide",
        "ButtonLearnMoreInformation_title",
        "ButtonLearnMoreInformation__description",
        "ButtonLearnMoreInformation__buttonContainer",
        "ButtonLearnMoreInformation__button",
        "ButtonLearnMoreInformation__buttonText"
    ];
    const { handles } = useCssHandles(CSS_HANDLES);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={isOpen ? handles.ButtonLearnMoreInformation__show : handles.ButtonLearnMoreInformation__hide}>
                <span className={handles.ButtonLearnMoreInformation_title}>
                    Header of the paragraph
                </span>
                <span className={handles.ButtonLearnMoreInformation__description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt enim sit imperdiet id aenean nunc ut faucibus. Vitae ullamcorper turpis blandit semper at. Aliquam tristique eget a et lectus vestibulum nascetur dolor. 
                </span>
            </div>
            <div className={handles.ButtonLearnMoreInformation__buttonContainer}>
                <div className={handles.ButtonLearnMoreInformation__button}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    <span className={handles.ButtonLearnMoreInformation__buttonText}>{isOpen ? "LEARN LESS" : "LEARN MORE"}</span>
                </div>
            </div>
        </>
    )
}