import React, { useState } from "react";
import { InputButton } from "vtex.styleguide";
import { useProduct } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";
import { FormattedMessage } from "react-intl";
import infoIcon from './iconinfo.svg'

type ShippingCustomProps = {
  textButton: string;
  placeHolder: string;
  title: string;
};

const getData = (skuId: string, zipCode: string) => {
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
      zipCode,
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
  "containerTeC",
  "imageInfo",
  "deliveryTeC"
];
const ShippingCustom: StorefrontFunctionComponent<ShippingCustomProps> = ({
  textButton = "Estimer la livraison",
  placeHolder = "",
  title = "Code Postal",
}) => {
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [wrongCap, setWrongCap] = useState(false);
  const productContext = useProduct();
  const regex = /^(?:[0-8]\d|9[0-8])\d{3}$/;
  const skuId = productContext.product.items[0].itemId;
  const handles = useCssHandles(CSS_HANDLES);

  return (
    <form
      className={handles.fastEstForm}
      onSubmit={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        setDelivery(true);
        if (regex.test(e.target[0].value)) {
          setWrongCap(false);
          getData(skuId, e.target[0].value).then((res: any) => {
            setResponse(res);
            if (!res) {
              setWrongCap(true);
              setIsLoading(false);
            } else {
              setIsLoading(false);
            }
          });
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
      {(response as any).data == "OK" && (response as any).isPresale == true ? (
        <div className={handles.containerTeC}>
          <p className={handles.deliveryTeC}>
          <img
            className={handles.imageInfo}
            src={infoIcon}
          />
          <FormattedMessage id="store/TermsAndConditionLabel" /> {(response as any).productRealeaseDate} <FormattedMessage id="store/TermsAndConditionLabel2" />
          </p>
        </div>
      ) : (
        <></>
      )}
      {(response as any).hasFastDelivery == true &&
      (response as any).data == "OK" ? (
        <div className={handles.containerDelivery}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={handles.textResponse}>
            <FormattedMessage id="store/fast-delivery" />
          </p>
        </div>
      ) : (
        <></>
      )}
      {delivery && !wrongCap ? (
        <div className={handles.containerDelivery}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={handles.textResponse}>
            {(response as any).deliveryTime}
          </p>
        </div>
      ) : (
        <></>
      )}
      {(response as any).hasInstallation == true &&
      (response as any).data == "OK" ? (
        <div className={handles.containerInstallation}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/check-solid.svg"}
          />
          <p className={handles.textResponse}>
            <FormattedMessage id="store/installation" />
          </p>
        </div>
      ) : (response as any).hasInstallation == true &&
        (response as any).data == "KO" ? (
        <div className={handles.containerInstallation}>
          <img
            className={handles.tickIconInstall}
            src={"/arquivos/times-solid.svg"}
          />
          <p className={handles.textResponse}>
            <FormattedMessage id="store/not-installation" />
          </p>
        </div>
      ) : (
        <></>
      )}
      {wrongCap ? (
        <div className={handles.error}>
          <FormattedMessage id="store/error" />
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
