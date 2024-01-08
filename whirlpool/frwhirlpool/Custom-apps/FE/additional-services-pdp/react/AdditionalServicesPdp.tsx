import React, { useEffect, useState } from "react";
import getAdditionalServices from "./graphql/getAdditionalServices.graphql";
import { useLazyQuery } from "react-apollo";
// @ts-ignore
import { useProduct } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";
import ContentLoader from "react-content-loader";
import { FormattedCurrency } from "vtex.format-currency";
import { IntlShape, useIntl } from "react-intl";
// @ts-ignore
import whirlpoolClubLogo from "../assets/whirlpoolClub.svg";
// @ts-ignore
import infoIcon from "../assets/infoIcon.svg";
type serviceProps = {
  //Theme Props
  showTitle: boolean,
};

const CSS_HANDLES = [
  "serviziAggiuntiviTableNew",
  "serviceTitleNew",
  "whirlpoolLogoNew",
  "servTitleStyleNew",
  "serviceContainer",
  "serviceIcon",
  "serviceBox",
  "serviceName",
  "priceContainerNew",
  "freeLabelNew",
  "labelPriceNew",
  "listPriceNew",
  "serviziAggiuntiviDescrContainerNew",
  "serviziAggiuntiviDescrLeftSideNew",
  "serviziAggiuntiviTitleNew",
  "popUpDescription",
  "infoIcon",
  "popUpContainer",
];

type priceContainerProps = {
  intl: IntlShape,
  handles: any,
  service: any,
};
const PriceContainer: StorefrontFunctionComponent<priceContainerProps> = ({
  intl,
  handles,
  service,
}) => {
  return (
    <div className={handles.priceContainerNew}>
      {service?.ListPrice > service?.Price && (
        <span className={handles.listPriceNew}>
          <FormattedCurrency value={service?.ListPrice} />
        </span>
      )}
      {service?.Price === 0 ? (
        <span className={handles.freeLabelNew}>
          {intl.formatMessage({
            id: "store/additional-services-pdp.freeLabel",
          })}
        </span>
      ) : (
        <span key="servicePriceValue" className={handles.labelPriceNew}>
          <FormattedCurrency value={service?.Price} />
        </span>
      )}
    </div>
  );
};

const AdditionalServicesPdp: StorefrontFunctionComponent<serviceProps> = ({
  //Theme Props
  showTitle = false,
}) => {
  const intl = useIntl();
  const handles = useCssHandles(CSS_HANDLES);
  /*--- BASIC CONSTS ---*/
  const { product } = useProduct();
  const premiumProp = product.properties.find(
    (el) => el.name === "PRODOTTI PREMIUM"
  );
  const isPremium = premiumProp
    ? premiumProp.values[0] === "Whirlpool Club"
    : false;
  const skuId = product?.items?.[0]?.itemId;
  const [showPopup, setShowPopUp]: any = useState(undefined);
  /*--- STATE MANAGEMENT ---*/
  const [additionalServices, setAdditionalServices]: any = useState([]);

  /*--- GRAPHQL QUERY ---*/
  const [getSearchData, { data, loading }] = useLazyQuery(
    getAdditionalServices,
    {
      onCompleted: () => {
        if (!skuId) console.error("Product Context goes wrong");
      },
    }
  );


  useEffect(() => {
    if (product?.items) {
      getSearchData({
        variables: {
          s: skuId,
        },
      });
    }
  }, [product]);

  useEffect(() => {
    if (data) {
      setAdditionalServices([
        ...data?.additionalServices,
      ]);
    }
  }, [data]);

  const isAnAccessory = product?.categories?.some((path) =>
    path.includes("accessoires")
  );

  // const isSellable =
  // 	product?.properties?.filter((e: any) => e.name == `sellable`)[0]?.values[0] ==
  // 	"true";
  const isSellable = true;
  return (
    <>
      {!isAnAccessory && isSellable ? (
        <>
          {!loading ? (
            additionalServices?.length > 0 && (
              <div className={handles.serviziAggiuntiviTableNew}>
                <div className={handles.serviceTitleNew}>
                  {showTitle && (
                    <p className={handles.servTitleStyleNew}>
                      {intl.formatMessage({
                        id: "store/additional-services-pdp.serviceTitle",
                      })}
                    </p>
                  )}
                  {isPremium && (
                    <img
                      className={handles.whirlpoolLogoNew}
                      src={whirlpoolClubLogo}
                    />
                  )}
                </div>
                <div className={handles.serviceContainer}>
                  {additionalServices?.map((service: any) => (
                    <div className={handles.serviceBox}>
											{service.Description ?
											<img
                        src={infoIcon}
                        className={handles.infoIcon}
                        onMouseEnter={() => setShowPopUp(service.Id)}
                        onMouseLeave={() => setShowPopUp(undefined)}
                      />: <span className={handles.infoIcon}></span>
										}
                      <img
                        className={handles.serviceIcon}
                        src={
                          service.IconLink ??
                          "https://frwhirlpool.vtexassets.com/arquivos/delivery.svg"
                        }
                        alt="icon link"
                      />
                      <p className={handles.serviceName}>{service.Name}</p>
                      <PriceContainer
                        intl={intl}
                        handles={handles}
                        service={service}
                      />
                      {showPopup === service.Id && (
                        <div className={handles.popUpContainer}>
                          <span className={handles.popUpDescription}>
                            {service.Description}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <ContentLoader
              width="100%"
              speed={1}
              height="100%"
              viewBox="0 0 380 70"
            ></ContentLoader>
          )}
        </>
      ) : null}
    </>
  );
};

AdditionalServicesPdp.schema = {
  title: "AdditionalServicesPdp",
  description: "editor.services.description",
  type: "object",
  properties: {
    serviceTitle: {
      title: "Title",
      description: "Title of the section",
      default: "Services included",
      type: "string",
    },
    serviceLabel1: {
      title: "serviceLabel1",
      description: "Label for service 1",
      default: "Servizi 1",
      type: "string",
    },
    serviceLabel2: {
      title: "serviceLabel2",
      description: "Label for service 2",
      default: "Servizi 2",
      type: "string",
    },
    serviceLabel3: {
      title: "serviceLabel3",
      description: "Label for service 3",
      default: "Servizio 3",
      type: "string",
    },
    serviceLabel4: {
      title: "serviceLabel4",
      description: "Label for service 4",
      default: "Servizio 4",
      type: "string",
    },
    serviceLabel5: {
      title: "serviceLabel5",
      description: "Label for service 5",
      default: "Servizio 5",
      type: "string",
    },
    discountDesc: {
      title: "discountDesc",
      description: "Description of discountDesc",
      default: "Descrizione",
      type: "string",
    },
    freeLabel: {
      title: "Free Label",
      description: "Free label",
      default: "Inclus",
      type: "string",
    },
  },
};

export default AdditionalServicesPdp;
