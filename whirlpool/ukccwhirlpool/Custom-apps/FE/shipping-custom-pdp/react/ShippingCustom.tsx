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
  zipCode: string,
  tradePolicy: string,
  skuId: string
) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  return fetch(
    `/_v/wrapper/api/catalog/service/installation/${zipCode}?tradePolicy=${tradePolicy}&skuId=${skuId}`,
    options
  ).then((response: any) => (response.ok ? response.json() : false));
};

const ShippingCustom: StorefrontFunctionComponent<ShippingCustomProps> = ({
  textButton = "Estimer la livraison",
  placeHolder = "",
  title = "Code Postal",
}) => {
  /*--- TRADE POLICY ---*/
  const [tradePolicy, setTradePolicy]: any = useState("4");

  useEffect(() => {
    if (typeof window != undefined) {
      const sc = JSON.parse(
        Buffer.from(
          (window as any).__RUNTIME__.segmentToken,
          "base64"
        ).toString()
      ).channel;

      const url = window.location.href;
      const scWithoutChannel = url.includes("epp")
        ? "1"
        : url.includes("ff")
        ? "2"
        : "3";

      sc && sc != "4" ? setTradePolicy(sc) : setTradePolicy(scWithoutChannel);
    }
  }, [typeof window]);

  /*--- INTL ---*/
  const intl = useIntl();

  // const { culture } = useRuntime();
  const [response, setResponse]: any = useState({});
  const [isResponse, setIsResponse]: any = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wrongCap, setWrongCap] = useState(false);
  const productContext = useProduct();
  const skuId = productContext?.product?.items?.[0]?.itemId;

  console.log(response, "response");

  return (
    <form
      className={style.fastEstForm}
      onSubmit={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        setIsResponse(false);
        setWrongCap(false);
        getInstallation(e.target[0].value, tradePolicy, skuId).then(
          (res: any) => {
            setResponse(res);
            setIsResponse(true);
            setIsLoading(false);
          }
        );
      }}
    >
      <div className={"mb5 vtex-form__shipping " + style.container}>
        <InputButton
          placeholder={placeHolder}
          size="regular"
          label={title}
          button={textButton}
          isLoading={isLoading}
          // maxLength="5"
        />
      </div>
      {!wrongCap && isResponse ? (
        <>
          {response.isServedZipCode ? (
            <div className={style.containerDelivery}>
              <img
                className={style.tickIconInstall}
                src={"/arquivos/check-solid.svg"}
              />
              <p className={style.textResponse}>
                {intl.formatMessage({
                  id: "store/shipping-custom-pdp.deliveryOK",
                })}
              </p>
            </div>
          ) : !response.isServedZipCode && !response.hasInstallation ? (
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
            <div className={style.containerDelivery}>
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
          ) : !response.hasInstallation && response.isServedZipCode ? (
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
          ) : null}
        </>
      ) : wrongCap ? (
        <div className={style.error}>
          {intl.formatMessage({ id: "store/shipping-custom-pdp.wrongZipCode" })}
        </div>
      ) : null}

      {/* {isResponse && response?.hasInstallation && response?.isServedZipCode ? (
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
      ) : isResponse ? (
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
      )} */}
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
