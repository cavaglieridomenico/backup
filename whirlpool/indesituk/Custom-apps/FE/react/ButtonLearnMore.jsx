import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ButtonLearnMore({
    firstTitle,
    firstDesc,
    secondTitle,
    secondDesc
}) {
    const CSS_HANDLES = [
        "ButtonLearnMore__additionalInfoContainerVisible",
        "ButtonLearnMore__additionalInfoContainerHidden",
        "ButtonLearnMore__button",
        "ButtonLearnMore__cardContainer",
        "ButtonLearnMore__cardTextContainer",
        "ButtonLearnMore__cardTitle",
        "ButtonLearnMore__cardDescription",
        "ButtonLearnMore__cardImageContainer",
        "ButtonLearnMore__imageContainer",
        "ButtonLearnMore__firstImage",
        "ButtonLearnMore__secondImage",
        "ButtonLearnMore__buttonContainer",
        "ButtonLearnMore__LearnMoreButton"
    ];
    const { handles } = useCssHandles(CSS_HANDLES);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={isOpen ? handles.ButtonLearnMore__additionalInfoContainerVisible : handles.ButtonLearnMore__additionalInfoContainerHidden}>
                <div className={handles.ButtonLearnMore__cardContainer}>
                    <div className={handles.ButtonLearnMore__cardTextContainer}>
                        <span className={handles.ButtonLearnMore__cardTitle}>{firstTitle}</span>
                        <span className={handles.ButtonLearnMore__cardDescription}>{firstDesc}</span>
                    </div>
                    <div className={handles.ButtonLearnMore__imageContainer}>
                        <span className={handles.ButtonLearnMore__firstImage}/>
                    </div>
                </div>
                <div className={handles.ButtonLearnMore__cardContainer}>
                    <div className={handles.ButtonLearnMore__imageContainer}>
                        <span className={handles.ButtonLearnMore__secondImage}/>
                    </div>
                    <div className={handles.ButtonLearnMore__cardTextContainer}>
                        <span className={handles.ButtonLearnMore__cardTitle}>{secondTitle}</span>
                        <span className={handles.ButtonLearnMore__cardDescription}>{secondDesc}</span>
                    </div>
                </div>
            </div>
            <div className={handles.ButtonLearnMore__buttonContainer}>
                <div className={handles.ButtonLearnMore__button}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                <span className={handles.ButtonLearnMore__LearnMoreButton}>{isOpen ? "LEARN LESS" : "LEARN MORE"}</span>
                </div>
            </div>
        </>
    )
};

ButtonLearnMore.schema = {
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
            default: 'Using the Youreko tool will make sure you always get the most energy efficient appliances that are right for your home and family.'
        }
    }
}