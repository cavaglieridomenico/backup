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
  eighthDescription
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
  title: 'titolo e descrizione cards lavatrici',
  type: 'object',
  properties: {
    firstTitle:{
      type:"string",
      description:"per la modifica del primo titolo",
      title:"primo titolo",
      default:"QR code"
    },
    firstDescription:{
      type:"string",
      description:"per la modifica della prima descrizione",
      title:"prima descrizione",
      default:"Quick description of the specific value quick description of the specific value"
    },
    secondTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Energy efficiency class*"
    },
    secondDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Quick description of the specific value quick description"
    },
    thirdTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Weighted energy consumption"
    },
    thirdDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"in kWh/100 operating cycles (in Eco 40-60 program)"
    },
    forthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Maximum load capacity"
    },
    forthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Quick description of the specific value quick description"
    },
    fifthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Eco 40-60"
    },
    fifthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Duration of “Eco 40-60” cycle program in full load conditions"
    },
    sixthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Weighted energy consumption"
    },
    sixthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"in litres/operating cycle (in Eco 40-60 program)"
    },
    seventhTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Spin efficiency class*"
    },
    seventhDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Quick description of the specific value quick description"
    },
    eighthTitle:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"Noise emissions"
    },
    eighthDescription:{
      type:"string",
      description:"per la modifica del titolo",
      title:"titolo",
      default:"during spin cycle expressed in dB(A) re 1 pW and noise emission class"
    }
  }
}