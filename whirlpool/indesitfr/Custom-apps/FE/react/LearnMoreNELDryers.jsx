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
  sixthDescription,
  seventhTitle,
  seventhDescription,
  eighthTitle,
  eighthDescription,
  ninthTitle,
  ninthDescription,
  tenthTitle,
  tenthDescription,
  eleventhTitle,
  eleventhDescription,
  twelfthTitle,
  twelfthDescription,
  thirteenthTitle,
  thirteenthDescription
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
              <LearnMoreNELCard
                title={seventhTitle}
                desc={seventhDescription}
              />
              <LearnMoreNELCard
                title={eighthTitle}
                desc={eighthDescription}
              />
              <LearnMoreNELCard
                title={ninthTitle}
                desc={ninthDescription}
              />
              <LearnMoreNELCard
                title={tenthTitle}
                desc={tenthDescription}
              />
              <LearnMoreNELCard
                title={eleventhTitle}
                desc={eleventhDescription}
              />
              <LearnMoreNELCard
                title={twelfthTitle}
                desc={twelfthDescription}
              />
              <LearnMoreNELCard
                title={thirteenthTitle}
                desc={thirteenthDescription}
              />
              
            </div>
            <div className={handles.LearnMoreNEL__marginalNote}>
              *I valori si applicano a lavaggi a un quarto di carico, a mezzo carico o a pieno carico. Durante il lavaggio e l'asciugatura a mezzo carico e a pieno carico.
              ** Lavaggio e asciugatura.
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
  title: 'titolo e descrizione cards asciugatrici',
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
      title:"titolo",
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
      title:"titolo",
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
      title:"titolo",
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
      title:"titolo",
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
      title:"titolo",
      default:"temporary empty"
    },
    seventhTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    seventhDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    eighthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    eighthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    ninthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    ninthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    tenthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    tenthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    eleventhTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    eleventhDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    twelfthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    twelfthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    thirteenthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    },
    thirteenthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"temporary empty"
    }
  }
}