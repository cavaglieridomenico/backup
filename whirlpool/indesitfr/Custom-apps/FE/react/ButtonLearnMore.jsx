import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";

export default function ButtonLearnMore( {
    cardTitle,
    cardDescription,
    secondCardTitle,
    secondCardDescription,
    firstImage,
    secondImage
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
        "ButtonLearnMore__image",
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
                        <span className={handles.ButtonLearnMore__cardTitle}>{cardTitle}</span>
                        <span className={handles.ButtonLearnMore__cardDescription}>{cardDescription}</span>
                    </div>
                    <div className={handles.ButtonLearnMore__imageContainer}>
                       <img src={firstImage} className= {handles.ButtonLearnMore__image}/>
                    </div>
                </div>
                <div className={handles.ButtonLearnMore__cardContainer}>
                    <div className={handles.ButtonLearnMore__imageContainer}>
                        <img src={secondImage} className={handles.ButtonLearnMore__image}/>
                    </div>
                    <div className={handles.ButtonLearnMore__cardTextContainer}>
                        <span className={handles.ButtonLearnMore__cardTitle}>{secondCardTitle}</span>
                        <span className={handles.ButtonLearnMore__cardDescription}>{secondCardDescription} </span>
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
    title: 'Learn more button',
    type: 'object',
    properties: {
      cardTitle:{
        type:"string",
        description:"per la modifica del titolo della prima carta",
        title:"titolo prima card",
        default:"Additional info"
      },
      cardDescription:{
        type:"string",
        description:"per la modifica della descrizione della prima carta",
        title:"descrizione prima card",
        default:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt enim sit imperdiet id aenean nunc ut faucibus. Vitae ullamcorper turpis blandit semper at. Aliquam tristique eget a et lectus vestibulum nascetur dolor."
      },
      secondCardTitle:{
        type:"string",
        description:"per la modifica del titolo della seconda carta",
        title:"titolo seconda card",
        default:"Additional info"
      },
      secondCardDescription:{
        type:"string",
        description:"per la modifica della descrizione della seconda carta",
        title:"descrizione seconda card",
        default:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt enim sit imperdiet id aenean nunc ut faucibus. Vitae ullamcorper turpis blandit semper at. Aliquam tristique eget a et lectus vestibulum nascetur dolor."
      }
    }
  }