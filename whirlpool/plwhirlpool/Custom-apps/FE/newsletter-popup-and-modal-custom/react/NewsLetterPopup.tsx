import React, { useState } from "react";
import { useEffect } from "react";
import ModalNewsletter from "./Modal";
import FetchFunction from "./utils/UtilityFunction";
import style from "./style.css";
import { CampaignContextProvider } from "./CampaignContext";
import NewsletterContext from "./NewsLetterContext";
interface NewsLetterPopupProps {
  textDescription?: string;
  button?: boolean;
  textButton?: string;

  time?: number;
  children: React.Component;
  campaignName:
  | "form_HP_promo_5%disc"
  | "popup_HP_promo_5%disc"
  | "form_PDP_promo_5%disc"
  | "form_PLP_promo_5%disc"
  | "form_LP_promo_5%disc"
  | "myAcc_promo_5%disc"
  | "checkout_promo_5%disc"
  | "form_HP_blackfriday"
  | "form_LP_blackfriday"
  | "form_LP_soldes";
}
const NewsLetterPopup: StorefrontFunctionComponent<NewsLetterPopupProps> = ({
  textDescription,
  button,
  textButton,
  time,
  children,
  campaignName = "form_HP_promo_5%disc",

}: NewsLetterPopupProps) => {
  const [user, setUser] = useState(true);


  useEffect(() => {
    FetchFunction.getUser().then((response: any) => {
      if (
        response.namespaces.profile !== undefined &&
        !(response.namespaces.profile.isAuthenticated.value == "false")
      ) {
        FetchFunction.getIsAlreadyOptin(
          response.namespaces.profile.email.value
        ).then((response: any) => {
          const isOptin = response[0].isNewsletterOptIn;
          setUser(isOptin);
        });
      } else {
        setUser(false);
      }
    });
  }, []);

  const getOptin = () => {
    const pathname = window?.location?.pathname
    if (user == false) {
      if (button) {
        return (
          <div className={"vtex-container__newsletter " + (pathname == "/account" ? style.descriptionNone : style.container)}>
            <div
              className={"vtex-description__newsletter " + style.description}
            >
              {textDescription}
            </div>
            <NewsletterContext.Provider value={{ automatic: false }}>
              <CampaignContextProvider
                campaign={campaignName !== undefined ? campaignName : ""}
              >
                <ModalNewsletter
                  children={children}
                  textButton={textButton}
                ></ModalNewsletter>
              </CampaignContextProvider>
            </NewsletterContext.Provider>
          </div>
        );
      } else {
        return (
          <NewsletterContext.Provider value={{ automatic: true }}>
            <CampaignContextProvider
              campaign={campaignName !== undefined ? campaignName : ""}
            >
              <ModalNewsletter children={children} time={time}></ModalNewsletter>
            </CampaignContextProvider>
          </NewsletterContext.Provider>
        );
      }
    } else {
      return <></>;
    }
  };
  return getOptin();
};

NewsLetterPopup.schema = {
  title: "NewsLetterPopup",
  description: "Pop up for newsletter app",
  type: "object",
  properties: {
    textDescription: {
      title: "Description on the container",
      description: "Description on the container",
      default: undefined,
      type: "string",
    },
    button: {
      title: "Container flag",
      description: "If the container should be visible or not",
      default: undefined,
      type: "boolean",
    },
    textButton: {
      title: "Button label",
      description: "Label assigend to the button able to open the modal",
      default: undefined,
      type: "string",
    },
    time: {
      title: "Time for open automatically the modal",
      description:
        "Time expressed in minute, default 60 sec -> if you want 15 sec, then time = 0.25",
      default: undefined,
      type: "number",
    },
    campaignName: {
      title: "Campaign",
      description: "",

      type: "string",
      enum: [
        "form_HP_promo_5%disc",
        "popup_HP_promo_5%disc",
        "form_PDP_promo_5%disc",
        "form_PLP_promo_5%disc",
        "form_LP_promo_5%disc",
        "myAcc_promo_5%disc",
        "checkout_promo_5%disc",
        "form_HP_blackfriday",
        "form_LP_blackfriday",
        "form_LP_soldes",
      ],
      enumNames: [
        "form_HP_promo_5%disc",
        "popup_HP_promo_5%disc",
        "form_PDP_promo_5%disc",
        "form_PLP_promo_5%disc",
        "form_LP_promo_5%disc",
        "myAcc_promo_5%disc",
        "checkout_promo_5%disc",
        "form_HP_blackfriday",
        "form_LP_blackfriday",
        "form_LP_soldes",
      ],
      default: "form_HP_promo_5%disc",
    },
  },
};

export default NewsLetterPopup;
