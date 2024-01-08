import React, { useContext, useEffect, useState } from "react";
import { ProductContext, useProduct } from "vtex.product-context";
import style from "./style.css";
import { Collapsible } from "vtex.styleguide";
import ContentLoader from "react-content-loader";
import { FormattedCurrency } from "vtex.format-currency";

interface SelectedItem {
  sellers: Array<{
    commertialOffer: {
      AvailableQuantity: number;
    };
  }>;
}
interface serviceProps {
  serviceTitle: string;
  serviceLabel1: string;
  serviceLabel2: string;
  serviceLabel3: string;
  serviceLabel4: string;
  serviceLabel5: string;
  freeLabel: string;
}

const servAggTooltip = {
  paddingTop: "0.875rem",
};
const servTitleStyle = {
  fontWeight: 700,
  lineHeight: 1.5,
};

const ServiziAggiuntiviPdp: StorefrontFunctionComponent<serviceProps> = ({
  serviceTitle,
  serviceLabel1,
  serviceLabel2,
  serviceLabel3,
  serviceLabel4,
  serviceLabel5,
  freeLabel,
}) => {
  const [tableRows, settableRows] : any = useState([]);
  const [showTitle, setShowTitle] : any = useState(false);
  const [showAccordion, setShowAccordion] : any = useState(false);
  const [openQuestion, setOpenQuestion] : any = useState({});
  // const [warranty5years, setwarranty5years] : any = useState(false)
  const { product } = useProduct();
  const serviceLabelList: string[] = [];
  serviceLabelList?.push(
    serviceLabel1,
    serviceLabel2,
    serviceLabel3,
    serviceLabel4,
    serviceLabel5
  );

  const valuesFromContext:any = useContext(ProductContext);
  const fiveYearsWarrantyControl = valuesFromContext.product.properties.filter((item)=> (item.name === "fiveYearsWarranty" && item.values !== []&& item.values[0] !== 'false'))

  // @ts-ignore
  const { selectedItem }: { selectedItem: SelectedItem } = valuesFromContext;
  // @ts-ignore
  const { itemId: skuId } = selectedItem;

  // const consegnaPiano = {
  //   Id: 0,
  //   ServiceTypeId: 0,
  //   Name: "Instalacja sprzętu",
  //   IsFile: false,
  //   IsGiftCard: false,
  //   IsRequired: false,
  //   Options: [
  //     {
  //       Id: 608,
  //       Name: "Instalacja sprzętu",
  //       Description: "Instalacja sprzętu",
  //       PriceName: "W cenie",
  //       ListPrice: 0,
  //       Price: 0,
  //     },
  //   ],
  //   Attachments: [],
  // };

const twoYearswarranty = {
  Id: 246,
  ServiceTypeId: 1,
  Name: "2 lata gwarancji",
  IsFile: false,
  IsGiftCard: false,
  IsRequired: false,
  Options: [
      {
          Id: 611,
          Name: "2 lata gwarancji",
          Description: "2 lata gwarancji",
          PriceName: "W cenie",
          ListPrice: 0,
          Price: 0
      }
  ],
  Attachments: []
}
  // @ts-ignore
  const isItAnAccessory = product.categories.some((path) =>
    path.includes("accessoires")
  );
  if (isItAnAccessory) {
    return null;
  }

  const isSellable =
    product?.properties?.filter((e: any) => e.name == "sellable")[0]?.values[0] ==
    "true";
  if (!isSellable) {
    return null;
  }

  const setInitialState = (services: any) => {
    let array: any = {};
    for (let i = 0; i < services.length; i++) {
      array[services[i].ServiceTypeId] = {
        isOpen: false,
      };
    }
    return array;
  };

  const toggleAccordion = (questionNbr) => {
    let newOpen: any = { ...openQuestion };
    let newValue = !newOpen[questionNbr].isOpen;
    newOpen[questionNbr].isOpen = newValue;
    setOpenQuestion(newOpen);
  };

  useEffect(() => {
    fetch(`/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${skuId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.Services.length > 0 ) {

          if(fiveYearsWarrantyControl.length === 0){
            json.Services.splice(1, 0, twoYearswarranty)
          } 
          setOpenQuestion(setInitialState(json.Services));
          settableRows(json.Services);
          setShowTitle(true);
        }
        json.Services.map((service)=>{
          if(service.ServiceTypeId === 4){
              service.Options[0].Name = '+3 lata pełnej gwarancji producenta'
          }
        })
				// tableRows.unshift(consegnaPiano);
				setShowAccordion(true);
      })
    return () => {};
  }, []);

  return (
    <>
      {showAccordion ? (
        <div className={style.serviziAggiuntiviTable}>
          <div className={style.serviceTitle}>
            {showTitle ? (
              <p className="service-title" style={servTitleStyle}>
                {serviceTitle}
              </p>
            ) : null}
          </div>
          {tableRows?.map((service: any, key: number) => (
            <div
              key={key}
              className={style.servAggRow + " servizi-aggiuntivi-row"}
            >
              <Collapsible
                key={key}
                header={
                  <div className={style.servOptions}>
                    {service.Options[0].Name}
                    {service.Options[0].Price === 0 ? (
                      <span className={style.freeLabel}>{freeLabel}</span>
                    ) : (
                      <span
                        key="servicePriceValue"
                        className={style.labelPrice}
                      >
                        <FormattedCurrency value={service.Options[0].Price} />
                      </span>
                    )}
                  </div>
                }
                align="right"
                onClick={() => {
                  toggleAccordion(service.ServiceTypeId);
                }}
                isOpen={
                  openQuestion && openQuestion[service.ServiceTypeId].isOpen
                }
                caretColor="#505050"
              >
                <div
                  style={servAggTooltip}
                  className={style.serviziAggiuntiviTooltip}
                >
                  {serviceLabelList[service.ServiceTypeId]}
                </div>
              </Collapsible>
            </div>
          ))}
          {/* {
            !warranty5years &&
          <div
            key={10}
            className={style.servAggRow + " servizi-aggiuntivi-row "}
            >
              <div className={`${style.servOptions} ${style.twoYearsWarranty}`}>
                      {twoYearswarranty.Options[0].Name}
                      {twoYearswarranty.Options[0].Price === 0 ? (
                        <span className={style.freeLabel}>{freeLabel}</span>
                      ) : (
                        <span
                          key="servicePriceValue"
                          className={style.labelPrice}
                        >
                          <FormattedCurrency value={twoYearswarranty.Options[0].Price} />
                        </span>
                      )}
              </div>
          </div>
          } */}
        </div>
      ) : (
        <ContentLoader
          width="100%"
          speed={1}
          height="100%"
          viewBox="0 0 380 70"
        ></ContentLoader>
      )}
    </>
  );
};

ServiziAggiuntiviPdp.schema = {
  title: "editor.services.title",
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
      default: "W cenie",
      type: "string",
    },
  },
};

export default ServiziAggiuntiviPdp;
