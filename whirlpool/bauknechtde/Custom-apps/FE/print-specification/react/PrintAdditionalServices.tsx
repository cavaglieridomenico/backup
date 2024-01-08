import React from "react";
import { useProduct } from "vtex.product-context";
import style from "./style.css";
import { addServicesLogo } from "./utils/vectors";
import { FormattedMessage } from "react-intl";

interface Service {
  name: string;
  price: number;
}

interface PrintAdditionalServicesProps {
  specificationName: string;
  specificationFormat: "string" | "json";
  iconImg: string;
}

const PrintAdditionalServices: StorefrontFunctionComponent<PrintAdditionalServicesProps> = ({
  specificationName = "additionalServices",
  specificationFormat = "json",
  iconImg = `data:image/svg+xml;base64,${Buffer.from(addServicesLogo).toString("base64")}`,
}: PrintAdditionalServicesProps) => {
  const productContext = useProduct();

  const additionalServiceSpecValue: string = productContext?.product?.properties?.find((spec: any) => spec.name == specificationName)?.values?.[0];

  if (!additionalServiceSpecValue) return null;

  if (specificationFormat == "string") {
    const services = additionalServiceSpecValue.split(";");
    return (
      <div className={style.plpAddServices}>
        {services?.map((service: string) => (
          <div className={style.plpAddServiceContainer}>
            <img className={style.plpAddServiceImg} src={iconImg} alt="" />
            <span className={style.plpAddServiceText}>{service}</span>
          </div>
        ))}
      </div>
    );
  }

  const services: Service[] = JSON.parse(additionalServiceSpecValue);

  return (
    <div className={style.plpAddServices}>
      {services?.map((service) => (
        <div className={style.plpAddServiceContainer}>
          <img className={style.plpAddServiceImg} src={iconImg} alt="" />
          <span className={style.plpAddServiceText}>
            {service.name === "Sorglos PLUS Geräteschutz auf Wunsch (monatl. Gebühr)" ? "Sorglos PLUS Geräteschutz auf Wunsch" : service.name}
          </span>
          <span className={style.plpAddServicePrice}>
            {service.price == 0 ? (
              service.name === "Sorglos PLUS Geräteschutz auf Wunsch (monatl. Gebühr)" ? (
                <FormattedMessage id="store/print-specification.additionalServices.alternativeWarrantyLabel" />
              ) : (
                <FormattedMessage id="store/print-specification.additionalServices.freeLabel" />
              )
            ) : (
              <FormattedMessage
                id="store/print-specification.additionalServices.priceLabel"
                values={{
                  price: service.price.toFixed(Number.isInteger(service.price) ? 0 : 2).replace(".", ","),
                }}
              />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

PrintAdditionalServices.schema = {
  title: "Print specification",
  description: "Print one or more specification",
  type: "object",
  properties: {
    iconImg: {
      title: "Icon image",
      type: "string",
    },
  },
};

export default PrintAdditionalServices;
