import React, { useState } from "react";
import { InputButton } from "vtex.styleguide";
import style from "./style.css";
import { useProduct } from "vtex.product-context";
import { useIntl } from "react-intl";
import shipping from "./graphql/shipping.graphql";
import { useLazyQuery } from "react-apollo";
import { useRuntime } from "vtex.render-runtime";

interface ShippingCustomProps {
  textButton: string;
  textButton_lang: string;
  placeHolder: string;
  placeHolder_lang: string;
  title: string;
  title_lang: string;
}

// const getInstallation = (
//   skuId: string,
//   zipCode: string,
//   tradePolicy: string
// ) => {
//   const options = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   };
//   return fetch(
//     "/_v/wrapper/api/catalog/service/installation?skuId=" +
//       skuId +
//       "&zip=" +
//       zipCode +
//       "&tradePolicy=" +
//       tradePolicy,
//     options
//   ).then((response: any) => (response.ok ? response.json() : false));
// };

const ShippingCustom: StorefrontFunctionComponent<ShippingCustomProps> = ({
  textButton,
  textButton_lang,
  placeHolder,
  placeHolder_lang,
  title,
  title_lang,
}) => {
  /*--- INTL ---*/
  const intl = useIntl();

  // const sessionAPI = "/api/sessions";
  const { culture } = useRuntime();
  // const [isResponse, setIsResponse]: any = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [tradePolicy, setTradePolicy]: any = useState();
  const [hasDelivery, setHasDelivery] = useState(false);
  const [wrongCap, setWrongCap] = useState(false);
  const productContext = useProduct();
  const regex = /^(?:[0-8]\d|9[0-8])\d{3}$/;
  const skuId = productContext?.product?.items?.[0]?.itemId;
  const sellerId = productContext?.product?.items?.[0]?.sellers?.[0]?.sellerId;

  const [getDelivery, { data, loading }] = useLazyQuery(shipping, {
    fetchPolicy: "no-cache",
    onCompleted: () => {
      if (data?.shipping?.logisticsInfo?.[0]?.slas) {
        setHasDelivery(true);
      }
    },
  });

  // useEffect(() => {
  //   fetch(`${sessionAPI}?items=*`, {
  //     method: "GET",
  //     credentials: "same-origin",
  //     cache: "no-cache",
  //     headers: { "Content-Type": "application/json" },
  //   })
  //     .then((res: any) => res.json())
  //     .then((res: any) => {
  //       setTradePolicy(res?.namespaces?.store?.channel?.value);
  //     });
  // }, []);

  console.log(hasDelivery, "hasDelivery");

  return (
    <form
      className={style.fastEstForm}
      onSubmit={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        // setIsLoading(true);
        // setIsResponse(false);
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
        } else {
          setWrongCap(true);
          // setIsLoading(false);
        }
      }}
    >
      <div className={"mb5 vtex-form__shipping " + style.container}>
        <InputButton
          placeholder={
            culture.locale === "it-IT" ? placeHolder : placeHolder_lang
          }
          size="regular"
          label={culture.locale === "it-IT" ? title : title_lang}
          button={culture.locale === "it-IT" ? textButton : textButton_lang}
          isLoading={loading}
          maxLength="5"
        />
      </div>
      {!loading && hasDelivery && (
        <div className={style.containerDelivery}>
          <img
            className={style.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={style.textResponse}>
            {intl.formatMessage({ id: "store/shipping-custom-pdp.deliveryOK" })}
          </p>
        </div>
      )}
      {wrongCap && (
        <div className={style.error}>
          {intl.formatMessage({ id: "store/shipping-custom-pdp.wrongZipCode" })}
        </div>
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
      title: "Label button current lang",
      description: "",
      type: "string",
      default: "Calcola spedizione",
    },
    textButton_lang: {
      title: "Label button second lang",
      description: "",
      type: "string",
      default: "Calcola spedizione",
    },
    placeHolder: {
      title: "Placeholder input text current lang",
      description: "",
      type: "string",
      default: "Inserisci il tuo cap",
    },
    placeHolder_lang: {
      title: "Placeholder input text default lang",
      description: "",
      type: "string",
      default: "Inserisci il tuo cap",
    },
    title: {
      title: "Title input text current lang",
      description: "",
      type: "string",
      default: "Codice postale",
    },
    title_lang: {
      title: "Title input text second lang",
      description: "",
      type: "string",
      default: "Codice postale",
    },
  },
};

export default ShippingCustom;
