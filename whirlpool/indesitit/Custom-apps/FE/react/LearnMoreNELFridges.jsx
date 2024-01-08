import React, { useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import LearnMoreNELCard from "./LearnMoreNELCard";

export default function LearnMoreNEL( {
  firstTitle,
  firstDescription,
  secondTitle,
  secondDescription,
  thirdTitle,
  thirdDescription,
  forthTitle,
  forthDescription,
  fifthTitle,
  fifthDescription,
  sixthTitle,
  sixthDescription
  // isDisplayed
}) {
  const CSS_HANDLES= [
    "LearnMoreNEL__container",
    "LearnMoreNEL__containerHidden",
    "LearnMoreNEL__cardWrapper",
    "LearnMoreNEL__marginalNote",
    "LearnMoreNEL__buttonContainer",
    "LearnMoreNEL__button"
  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={isOpen ? handles.LearnMoreNEL__container : handles.LearnMoreNEL__containerHidden}>
            <div className={handles.LearnMoreNEL__cardWrapper}>
                <LearnMoreNELCard
                    title={firstTitle}
                    desc={firstDescription}
                />
              <LearnMoreNELCard
                  title={secondTitle}
                  desc={secondDescription}
              />
              <LearnMoreNELCard
                  title={thirdTitle}
                  desc={thirdDescription}
              />
              <LearnMoreNELCard
                  title={forthTitle}
                  desc={forthDescription}
              />
              <LearnMoreNELCard
                  title={fifthTitle}
                  desc={fifthDescription}
              />
              <LearnMoreNELCard
                title={sixthTitle}
                desc={sixthDescription}
              />
          
            </div>
            <div className={handles.LearnMoreNEL__marginalNote}>
              *I valori si applicano a un quarto di carico, a mezzo carico o a pieno carico.
            </div>
        </div>
        <div className={handles.LearnMoreNEL__buttonContainer}>
            <div className={handles.LearnMoreNEL__button}
              onClick={
                  () => setIsOpen(!isOpen)
              }
            >
              {isOpen ? "MOSTRA MENO" : "PER SAPERNE DI PIÙ"}
        </div>
      </div>
    </>
  )
}

LearnMoreNEL.schema = {
  title: 'titolo e descrizione cards frigoriferi',
  type: 'object',
  properties: {
    firstTitle:{
      type:"string",
      description:"per la modifica del primo titolo",
      title:"primo titolo",
      default:"temporary empty"
    },
    firstDescription:{
      type:"string",
      description:"per la modifica della prima descrizione",
      title:"prima descrizione",
      default:"temporary empty"
    },
    secondTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    secondDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"descrizione",
      default:"temporary empty"
    },
    thirdTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    thirdDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"descrizione",
      default:"temporary empty"
    },
    forthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    forthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"descrizione",
      default:"temporary empty"
    },
    fifthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    fifthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"descrizione",
      default:"temporary empty"
    },
    sixthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    sixthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"descrizione",
      default:"temporary empty"
    }

    // isDisplayed:{
    //   type:"boolean",
    //   "title":"Visbile",
    //   default:true,
    //   description:"modifica visibilità"
    // }
  }
}