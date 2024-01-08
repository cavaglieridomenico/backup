import React, { useState } from "react";
import { useEffect } from "react";
import { InputButton } from "vtex.styleguide";
import deliveryIcon from './iconaSpedizione.svg'
import style from './style.css'

interface FastEstProps {
  textButton:string,
  placeHolder:string,
  title:string
}

const getProva = (cap: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  return fetch("/_v/fastest/deliverydays/" + cap, options).then(
    (response: any) => (response.ok ? response.json() : false)
  );
};

const FastEst: StorefrontFunctionComponent<FastEstProps> = ({textButton="Calcola spedizione",placeHolder="Inserisci il tuo cap", title="Codice postale"}) => {
  const [delivery, setDeliveryTime] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [wrongCap, setWrongCap] = useState(false);
  useEffect(() => {}, []);

  return (
    <form className={style.fastEstForm}
      onSubmit={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        if (e.target[0].value.replace(/\b\d{5}\b/g, "") == "") {
          setWrongCap(false);
          getProva(e.target[0].value).then((repsonse: any) => {
            if (!repsonse) {
              setWrongCap(true);
              setDeliveryTime(-1);
              setIsLoading(false);
            } else {
              setDeliveryTime(repsonse.deliverydays);
              setIsLoading(false);
            }
          });
        } else {
          setWrongCap(true);
          setDeliveryTime(-1);
          setIsLoading(false);
        }
      }}
    >
      <div className={"mb5 vtex-form__shipping "+style.container}>
        <InputButton
          placeholder={placeHolder}
          size="regular"
          label={title}
          button={textButton}
          isLoading={isLoading}
          maxLength="5"
        />
      </div>
      {delivery !== -1 ? (
          <div className={style.containerSuccess}><img src={deliveryIcon} alt="Spedizione" className={style.deliveryImage}/><div className={style.success}>Consegna in {delivery} giorni!<br/><div className={style.subTitle}>Whirlpool considera solo i giorni feriali.</div></div></div>
        ) : (
          <></>
        )}
        {wrongCap ? <div className={style.error}>Cap inserito non valido</div> : <></>}
    </form>
  );
};

FastEst.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {
    textButton:{
      title:"Label button",
      description:"",
      type:"string",
      default:"Calcola spedizione"
    },
    placeHolder:{
      title:"Placeholder input text",
      description:"",
      type:"string",
      default:"Inserisci il tuo cap"
    },
    title:{
      title:"Title input text",
      description:"",
      type:"string",
      default:"Codice postale"
    }
  },
};

export default FastEst;
