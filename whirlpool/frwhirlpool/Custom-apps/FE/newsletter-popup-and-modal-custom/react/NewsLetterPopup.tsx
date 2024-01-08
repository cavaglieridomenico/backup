/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { useEffect } from "react";
import ModalNewsletter from "./Modal";
import FetchFunction from "./utils/UtilityFunction";
import style from "./style.css";
import { CampaignContextProvider } from "./CampaignContext";
import { Button } from "vtex.styleguide";
import { useRuntime } from "vtex.render-runtime";
import { usePixel } from "vtex.pixel-manager";
import NewsletterContext from "./NewsletterContext";

interface NewsLetterPopupProps {
  textDescription?: string;
  button?: boolean;
  textButton?: string;
  time?: number;
  // popup: string;
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
  redirectUrl = "/black-friday-whirlpool",
  campaignName = [{ item: "form_HP_promo_5%disc" }],
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
      // if (button) {
      //   return (
      //     <div className={"vtex-container__newsletter " + style.container}>
      //       <div
      //         className={"vtex-description__newsletter " + style.description}
      //       >
      //         {textDescription}
      //       </div>
      //       <CampaignContextProvider
      //         campaign={campaignName !== undefined ? campaignName : ""}
      //       >
      //         <ModalNewsletter
      //           children={children}
      //           textButton={textButton}
      //         ></ModalNewsletter>
      //       </CampaignContextProvider>
      //     </div>
      //   );
      // } else {
      //   return (
      //     <CampaignContextProvider
      //       campaign={campaignName !== undefined ? campaignName : ""}
      //     >
      //       <ModalNewsletter
      //         children={children}
      //         time={time}
      //       ></ModalNewsletter>
      //     </CampaignContextProvider>
      //   );
      // }

      if (button) {
        return (
          <>
            <div className={"vtex-container__newsletter " + style.container}>
              <div
                className={"vtex-description__newsletter " + style.description}
              >
                {textDescription}
              </div>
              <Button
                onClick={() => {
                  push({
                    event: "newsletterLink",
                    text: textButton ?? "Subscribe to our newsletter",
                  });
                  navigate({
                    to: redirectUrl,
                    // page: "store.custom#newsletter-landingpage",
                    // params: {campaign: campaignName},
                    query:
                      campaignName[0] !== undefined
                        ? `campaign=${campaignName[0]?.item}`
                        : "",
                  });
                }}
              >
                {/* <Link className={style.link}
                  page={"store.custom#newsletter-landingpage"}
                  params={{ campaign: campaingValue }}
                >
                  {textButton}
                </Link> */}
                {textButton}
              </Button>
            </div>
          </>
        );
      } else {
        return (
          <NewsletterContext.Provider value={{ automatic: true }}>
            <CampaignContextProvider
              campaign={
                campaignName[0] !== undefined ? campaignName[0].item : ""
              }
            >
              <ModalNewsletter
                children={children}
                time={time}
              ></ModalNewsletter>
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
    redirectUrl: {
      title: "Redirect Url",
      description:
        "The url the user will land on when clicked on button. MUST BEGIN WITH /",
      default: "/black-friday-whirlpool",
      type: "string",
    },
    campaignName: {
      title: "Campaign",
      description: "",
      type: "array",
      items: {
        properties: {
          item: {
            title: "Campaign name",
            type: "string",
          },
        },
      },
    },
  },
};

export default NewsLetterPopup;
