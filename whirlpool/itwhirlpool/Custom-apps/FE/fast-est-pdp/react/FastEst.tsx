import React, { useState } from "react";
import { useEffect } from "react";
import { InputButton } from "vtex.styleguide";
import deliveryIcon from './iconaSpedizione.svg'
import style from './style.css';
import { FormattedMessage } from "react-intl";
import infoIcon from './iconinfo.svg';
import { useProduct } from "vtex.product-context";

interface FastEstProps {
  textButton:string,
  placeHolder:string,
  title:string
}

const getProva = (skuId: string, cap: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  return fetch("/_v/fastest/deliverydays?skuId=" + skuId + "&zip=" + cap, options).then(
    (response: any) => (response.ok ? response.json() : false)
  );
};

const FastEst: StorefrontFunctionComponent<FastEstProps> = ({textButton="Calcola spedizione",placeHolder="Inserisci il tuo cap", title="Codice postale"}) => {
  const [response, setResponse] = useState({});
  const [isPresale, setIsPresale] = useState({});
  const [delivery, setDeliveryTime] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [wrongCap, setWrongCap] = useState(false);
  const productContext = useProduct();
  const skuId = productContext.product.items[0].itemId;
  useEffect(() => {}, []);

  return (
    <>
    <form className={style.fastEstForm}
      onSubmit={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        if (e.target[0].value.replace(/\b\d{5}\b/g, "") == "") {
          setWrongCap(false);
          getProva(skuId, e.target[0].value).then((res: any) => {
            setResponse(res);
            if (!res) {
              setWrongCap(true);
              setDeliveryTime(-1);
              setIsLoading(false);
            } else {
              setDeliveryTime(res.deliverydays);
              setIsLoading(false);
              setIsPresale(res.isPresale);
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
          <div className={style.containerSuccess}><img src={deliveryIcon} alt="Spedizione" className={style.deliveryImage}/><div className={style.success}>Consegna stimata in {delivery} giorni!<br/><div className={style.subTitle}>Whirlpool considera solo i giorni feriali.</div></div></div>
        ) : (
          <></>
        )}
      {wrongCap ? <div className={style.error}>Cap inserito non valido</div> : <></>}
    </form>
    <div className={style.containerPreOrderLabel}>
        {isPresale == true ? (
        <div className={style.containerTeC}>
          <p className={style.deliveryTeC}>
          <img
            src={infoIcon}
            className={style.imageInfo}
          />
          <FormattedMessage id="store/TermsAndConditionLabel" /> {(response as any).productRealeaseDate} <FormattedMessage id="store/TermsAndConditionLabel2" />
          </p>
        </div>
        ) : (
          <></>
        )}
      </div>
    </>
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
