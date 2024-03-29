/** @format */

import React, { useState, createContext } from "react";
import { useEffect } from "react";
import ModalNewsletter from "./Modal";
import FetchFunction from "./UtilityFunction";
import style from "./style.css";
import { CampaignContextProvider } from "./CampaignContext";
import { Button } from "vtex.styleguide";
import { useRuntime } from "vtex.render-runtime";
import { usePixel } from "vtex.pixel-manager";
import NewsletterContext from "./NewsLetterContext";

export const UserContext = createContext({});

interface NewsLetterPopupProps {
  textDescription?: string;
  button?: boolean;
  textButton?: string;
  time?: number;
  children: React.Component;
  redirectUrl: string;
  campaignName: [any];
}
const NewsLetterPopup: StorefrontFunctionComponent<NewsLetterPopupProps> = ({
  textDescription,
  button,
  textButton,
  time,
  children,
  redirectUrl = "/newsletter?FORM_PLP_BRAND",
  campaignName = [{ item: "form_HP_promo_10%disc" }],
}: NewsLetterPopupProps) => {
  const [user, setUser] = useState(true);
  const { navigate } = useRuntime();
  const { push } = usePixel();

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
    if (user == false) {
      if (button) {
        return (
          <div className={"vtex-container__newsletter " + style.container}>
            <div
              className={"vtex-description__newsletter " + style.description}
            >
              {textDescription}
            </div>
            <NewsletterContext.Provider value={{ automatic: false }}>
              <Button
                onClick={() => {
                  push({ event: "newsletterLink", text: textButton });
                  navigate({
                    to: redirectUrl,
                    query:
                      campaignName[0] !== undefined
                        ? `campaign=${campaignName[0]?.item}`
                        : "",
                  });
                }}
              >
                {textButton}
              </Button>
            </NewsletterContext.Provider>
          </div>
        );
      } else {
        return (
          <NewsletterContext.Provider value={{ automatic: true }}>
            <CampaignContextProvider
              campaign={
                campaignName[0] !== undefined ? campaignName[0].item : ""
              }
            >
              {time != 0 ?
                <ModalNewsletter
                  children={children}
                  time={time}
                ></ModalNewsletter>
                : null}
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
    redirectUrl: {
      title: "Redirect Url",
      description:
        "The url the user will land on when clicked on button. MUST BEGIN WITH /",
      default: "/newsletter?FORM_PLP_BRAND",
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
      type: "array",
      items: {
        properties: {
          item: {
            type: "string",
          },
        },
      },
    },
  },
};

export default NewsLetterPopup;
