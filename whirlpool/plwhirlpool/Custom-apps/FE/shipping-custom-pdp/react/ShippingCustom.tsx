import React, { useState, useEffect } from "react";
import { InputButton } from "vtex.styleguide";
import style from "./style.css";
import { useProduct } from "vtex.product-context";
import { useIntl } from "react-intl";

interface ShippingCustomProps {
  textButton: string;
  placeHolder: string;
  title: string;
}

const getInstallation = (
  skuId: string,
  zipCode: string,
  tradePolicy: string
) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  return fetch(
    "/_v/wrapper/api/catalog/service/installation?skuId=" +
      skuId +
      "&zip=" +
      zipCode +
      "&tradePolicy=" +
      tradePolicy,
    options
  ).then((response: any) => (response.ok ? response.json() : false));
};

const ShippingCustom: StorefrontFunctionComponent<ShippingCustomProps> = ({
  textButton = "Estimer la livraison",
  placeHolder = "",
  title = "Code Postal",
}) => {
  /*--- INTL ---*/
  const intl = useIntl();

  const sessionAPI = "/api/sessions";
  const [response, setResponse]: any = useState({});
  const [tradePolicy, setTradePolicy]: any = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [wrongCap, setWrongCap] = useState(false);
  const productContext = useProduct();
  const regex = /^(?:[0-8]\d|9[0-8])\d{3}$/;
  const skuId = productContext.product.items[0].itemId;

  useEffect(() => {
    fetch(`${sessionAPI}?items=*`, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
    })
      .then((res: any) => res.json())
      .then((res: any) => {
        setTradePolicy(res.namespaces.store.channel.value);
      });
  }, []);

  return (
    <form
      className={style.fastEstForm}
      onSubmit={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        if (regex.test(e.target[0].value)) {
          setWrongCap(false);
          getInstallation(skuId, e.target[0].value, tradePolicy).then(
            (res: any) => {
              setResponse(res);
              setIsLoading(false);
            }
          );
        } else {
          setWrongCap(true);
          setIsLoading(false);
        }
      }}
    >
      <div className={"mb5 vtex-form__shipping " + style.container}>
        <InputButton
          placeholder={placeHolder}
          size="regular"
          label={title}
          button={textButton}
          isLoading={isLoading}
          maxLength="5"
        />
      </div>
      {!wrongCap && response.isServedZipCode ? (
        <div className={style.containerDelivery}>
          <img
            className={style.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={style.textResponse}>
            {intl.formatMessage({ id: "store/shipping-custom-pdp.deliveryOK" })}
          </p>
        </div>
      ) : response.isServedZipCode == false && !wrongCap ? (
        <div className={style.containerInstallation}>
          <img
            className={style.tickIconInstall}
            src={"/arquivos/times-solid.svg"}
          />
          <p className={style.textResponse}>
            {intl.formatMessage({
              id: "store/shipping-custom-pdp.deliveryKO",
            })}
          </p>
        </div>
      ) : null}
      {response.hasInstallation ? (
        <div className={style.containerInstallation}>
          <img
            className={style.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={style.textResponse}>
            {intl.formatMessage({
              id: "store/shipping-custom-pdp.installationOK",
            })}
          </p>
        </div>
      ) : response.hasInstallation && !response.isServedZipCode ? (
        <div className={style.containerInstallation}>
          <img
            className={style.tickIconInstall}
            src={"/arquivos/times-solid.svg"}
          />
          <p className={style.textResponse}>
            {intl.formatMessage({
              id: "store/shipping-custom-pdp.installationKO",
            })}
          </p>
        </div>
      ) : (
        <></>
      )}
      {wrongCap ? (
        <div className={style.error}>
          {intl.formatMessage({ id: "store/shipping-custom-pdp.wrongZipCode" })}
        </div>
      ) : (
        <></>
      )}
    </form>
  );
};

ShippingCustom.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {
    textButton: {
      title: "Label button",
      description: "",
      type: "string",
      default: "Calcola spedizione",
    },
    placeHolder: {
      title: "Placeholder input text",
      description: "",
      type: "string",
      default: "Inserisci il tuo cap",
    },
    title: {
      title: "Title input text",
      description: "",
      type: "string",
      default: "Codice postale",
    },
  },
};

export default ShippingCustom;
