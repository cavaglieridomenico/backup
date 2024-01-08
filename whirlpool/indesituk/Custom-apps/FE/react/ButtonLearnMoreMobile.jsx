import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ButtonLearnMoreMobile({
    firstTitle,
    firstDesc,
    secondTitle,
    secondDesc
}) {
    const CSS_HANDLES = [
        "ButtonLearnMoreMobile__additionalInfoContainerVisible",
        "ButtonLearnMoreMobile__additionalInfoContainerHidden",
        "ButtonLearnMoreMobile__cardContainer",
        "ButtonLearnMoreMobile__imageContainer",
        "ButtonLearnMoreMobile__firstImage",
        "ButtonLearnMoreMobile__secondImage",
        "ButtonLearnMoreMobile__cardTextContainer",
        "ButtonLearnMoreMobile__cardTitle",
        "ButtonLearnMoreMobile__cardDescription",
        "ButtonLearnMoreMobile__buttonContainer",
        "ButtonLearnMoreMobile__button",
        "ButtonLearnMoreMobile__LearnMoreButton"
    ];
    const { handles } = useCssHandles(CSS_HANDLES);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={isOpen ? handles.ButtonLearnMoreMobile__additionalInfoContainerVisible : handles.ButtonLearnMoreMobile__additionalInfoContainerHidden}>
                <div className={handles.ButtonLearnMoreMobile__cardContainer}>
                    <div className={handles.ButtonLearnMoreMobile__imageContainer}>
                        <span className={handles.ButtonLearnMoreMobile__firstImage}/>
                    </div>
                    <div className={handles.ButtonLearnMoreMobile__cardTextContainer}>
                        <span className={handles.ButtonLearnMoreMobile__cardTitle}>{firstTitle}</span>
                        <span className={handles.ButtonLearnMoreMobile__cardDescription}>{firstDesc}</span>
                    </div>
                </div>
                <div className={handles.ButtonLearnMoreMobile__cardContainer}>
                    <div className={handles.ButtonLearnMoreMobile__imageContainer}>
                        <span className={handles.ButtonLearnMoreMobile__secondImage}/>
                    </div>
                    <div className={handles.ButtonLearnMoreMobile__cardTextContainer}>
                        <span className={handles.ButtonLearnMoreMobile__cardTitle}>{secondTitle}</span>
                        <span className={handles.ButtonLearnMoreMobile__cardDescription}>{secondDesc}</span>
                    </div>
                </div>
            </div>
            <div className={handles.ButtonLearnMoreMobile__buttonContainer}>
                <div className={handles.ButtonLearnMoreMobile__button}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                <span className={handles.ButtonLearnMoreMobile__LearnMoreButton}>{isOpen ? "LEARN LESS" : "LEARN MORE"}</span>
                </div>
            </div>
        </>
    )
}

ButtonLearnMoreMobile.schema = {
    title: 'Titolo e descrizione cards a scomparsa',
    type: 'object',
    properties: {
        firstTitle: {
            type: 'string',
            description: 'Per la modifica del primo titolo',
            title: 'Primo titolo',
            default: 'Recommendations'
        },
        firstDesc: {
            type: 'string',
            description: 'Per la modifca della prima descrizione',
            title: 'Prima descrizione',
            default: 'The tool recommends alternative products if they are found to save you more money through their energy savings. The alternative products may cost more upfront, but will save you money in energy costs in the long run.'
        },
        secondTitle: {
            type: 'string',
            description: 'Per la modifica del secondo titolo',
            title: 'Secondo titolo',
            default: 'Energy efficient appliances'
        },
        secondDesc: {
            type: 'string',
            description: 'Per la modifca della seconda descrizione',
            title: 'Seconda descrizione',
            defualt: 'Using the Youreko tool will make sure you always get the most energy efficient appliances that are right for your home and family.'
        }
    }
}