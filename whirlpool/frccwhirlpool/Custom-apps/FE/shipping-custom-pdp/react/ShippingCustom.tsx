import React, { useState, useEffect } from "react";
import { InputButton } from "vtex.styleguide";
import { useProduct } from "vtex.product-context";
import { FormattedMessage } from "react-intl";
import shipping from "./graphql/shipping.graphql";
import { useLazyQuery } from "react-apollo";
import { useRuntime } from "vtex.render-runtime";
import { useCssHandles } from "vtex.css-handles";

type ShippingCustomProps = {
  textButton: string;
  placeHolder: string;
  title: string;
};

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

const CSS_HANDLES = [
  "container",
  "containerDelivery",
  "containerInstallation",
  "error",
  "fastEstForm",
  "textResponse",
  "tickIconInstall",
];

const ShippingCustom: StorefrontFunctionComponent<ShippingCustomProps> = ({
  textButton = "Estimer la livraison",
  placeHolder = "",
  title = "Code Postal",
}) => {
  /*--- INTL ---*/
  const sessionAPI = "/api/sessions";
  const { culture } = useRuntime();
  const [response, setResponse]: any = useState({});
  const [isResponse, setIsResponse]: any = useState(false);
  const [tradePolicy, setTradePolicy]: any = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [hasFastDelivery, setHasFastDelivery] = useState(false);
  const [wrongCap, setWrongCap] = useState(false);
  const productContext = useProduct();
  const regex = /^(?:[0-8]\d|9[0-8])\d{3}$/;
  const skuId = productContext?.product?.items?.[0]?.itemId;
  const sellerId = productContext?.product?.items?.[0]?.sellers?.[0]?.sellerId;
  const handles = useCssHandles(CSS_HANDLES);

  const [getDelivery, { data, loading }] = useLazyQuery(shipping, {
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setIsResponse(true);
      if (data?.shipping?.logisticsInfo?.[0]?.slas?.length >= 1) {
        setHasDelivery(true);
      }
      setHasFastDelivery(
        data.shipping.logisticsInfo[0].slas.find((el: any) => {
          return el.id == "Livraison rapide";
        })
      );
    },
  });

  useEffect(() => {
    fetch(`${sessionAPI}?items=*`, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
    })
      .then((res: any) => res.json())
      .then((res: any) => {
        setTradePolicy(res?.namespaces?.store?.channel?.value);
      });
  }, []);
  return (
    <form
      className={handles.fastEstForm}
      onSubmit={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        setIsResponse(false);
        setHasDelivery(false);
        if (regex.test(e.target[0].value)) {
          setWrongCap(false);
          getDelivery({
            variables: {
              items: [{ id: skuId, quantity: "1", seller: sellerId }],
              postalCode: e.target[0].value,
              country: culture?.country,
            },
          });
          getInstallation(skuId, e.target[0].value, tradePolicy).then(
            (res: any) => {
              setResponse(res);
              setIsResponse(true);
              setIsLoading(false);
            }
          );
        } else {
          setWrongCap(true);
          setIsLoading(false);
        }
      }}
    >
      <div className={"mb5 vtex-form__shipping " + handles.container}>
        <InputButton
          placeholder={placeHolder}
          size="regular"
          label={title}
          button={textButton}
          isLoading={isLoading}
          maxLength="5"
        />
      </div>
      {isResponse && !loading && hasDelivery ? (
        <div className={handles.containerDelivery}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={handles.textResponse}>{response.deliveryTime}</p>
        </div>
      ) : isResponse && !loading && !hasDelivery ? (
        <div className={handles.containerInstallation}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/times-solid.svg"}
          />
          <p className={handles.textResponse}>
            <FormattedMessage id="store/shipping-custom-pdp.deliveryKO" />
          </p>
        </div>
      ) : null}
      {isResponse && hasFastDelivery ? (
        <div className={handles.containerDelivery}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={handles.textResponse}>
            <FormattedMessage id="store/shipping-custom-pdp.fastDeliveryOK" />
          </p>
        </div>
      ) : null}
      {isResponse && response?.hasInstallation && response?.isServedZipCode ? (
        <div className={handles.containerInstallation}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={handles.textResponse}>
            <FormattedMessage id="store/shipping-custom-pdp.installationOK" />
          </p>
        </div>
      ) : isResponse ? (
        <div className={handles.containerInstallation}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/times-solid.svg"}
          />
          <p className={handles.textResponse}>
            <FormattedMessage id="store/shipping-custom-pdp.installationKO" />
          </p>
        </div>
      ) : (
        <></>
      )}
      {wrongCap ? (
        <div className={handles.error}>
          <FormattedMessage id="store/shipping-custom-pdp.wrongZipCode" />
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
