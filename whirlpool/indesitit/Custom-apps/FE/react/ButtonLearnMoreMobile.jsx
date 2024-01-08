import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ButtonLearnMoreMobile({
    cardTitleMobile,
    cardDescriptionMobile,
    secondCardTitleMobile,
    secondCardDescriptionMobile,
    firstImageMobile,
    secondImageMobile
}) {
    const CSS_HANDLES = [
        "ButtonLearnMoreMobile__additionalInfoContainerVisible",
        "ButtonLearnMoreMobile__additionalInfoContainerHidden",
        "ButtonLearnMoreMobile__cardContainer",
        "ButtonLearnMoreMobile__imageContainer",
        "ButtonLearnMoreMobile__Image",
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
                        <img src={firstImageMobile} className={handles.ButtonLearnMoreMobile__Image} />
                    </div>
                    <div className={handles.ButtonLearnMoreMobile__cardTextContainer}>
                        <span className={handles.ButtonLearnMoreMobile__cardTitle}>{cardTitleMobile}</span>
                        <span className={handles.ButtonLearnMoreMobile__cardDescription}>{cardDescriptionMobile}</span>
                    </div>
                </div>
                <div className={handles.ButtonLearnMoreMobile__cardContainer}>
                    <div className={handles.ButtonLearnMoreMobile__imageContainer}>
                        <img src={secondImageMobile} className={handles.ButtonLearnMoreMobile__Image}/>
                    </div>
                    <div className={handles.ButtonLearnMoreMobile__cardTextContainer}>
                        <span className={handles.ButtonLearnMoreMobile__cardTitle}>{secondCardTitleMobile} </span>
                        <span className={handles.ButtonLearnMoreMobile__cardDescription}>{secondCardDescriptionMobile} </span>
                    </div>
                </div>
            </div>
            <div className={handles.ButtonLearnMoreMobile__buttonContainer}>
                <div className={handles.ButtonLearnMoreMobile__button}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                <span className={handles.ButtonLearnMoreMobile__LearnMoreButton}>{isOpen ? "SCOPRI DI MENO" : "SCOPRI DI PIÚ"}</span>
                </div>
            </div>
        </>
    )
}

 ButtonLearnMoreMobile.schema = {
    title: 'Learn more button Mobile',
    type: 'object',
    properties: {
      cardTitleMobile:{
        type:"string",
        description:"per la modifica del titolo della prima carta",
        title:"titolo prima card",
        default:"Additional info"
      },
      cardDescriptionMobile:{
        type:"string",
        description:"per la modifica della descrizione della prima carta",
        title:"descrizione prima card",
        default:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt enim sit imperdiet id aenean nunc ut faucibus. Vitae ullamcorper turpis blandit semper at. Aliquam tristique eget a et lectus vestibulum nascetur dolor."
      },
      secondCardTitleMobile:{
        type:"string",
        description:"per la modifica del titolo della seconda carta",
        title:"titolo seconda card",
        default:"Additional info"
      },
      secondCardDescriptionMobile:{
        type:"string",
        description:"per la modifica della descrizione della seconda carta",
        title:"descrizione seconda card",
        default:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt enim sit imperdiet id aenean nunc ut faucibus. Vitae ullamcorper turpis blandit semper at. Aliquam tristique eget a et lectus vestibulum nascetur dolor."
      }
    }
  } 