import React, { createContext } from "react";
import ModalNewsletter from "./Modal";
import style from "./style.css";
import { CampaignContextProvider } from "./CampaignContext";

export const UserContext = createContext({});

interface NewsLetterPopupProps {
  textDescription?: string;
  button?: boolean;
  textButton?: string;
  time?: number;
  children: React.Component;
  campaignName: [any];
}
const NewsLetterPopup: StorefrontFunctionComponent<NewsLetterPopupProps> = ({
  textDescription,
  button,
  textButton,
  time,
  children,
  campaignName = [{ item: "form_HP_promo_10%disc" }],
}: NewsLetterPopupProps) => {
  const getOptin = () => {
    if (button) {
      return (
        <div className={"vtex-container__newsletter " + style.container}>
          <div className={"vtex-description__newsletter " + style.description}>
            {textDescription}
          </div>
          {/* <div onClick={() => console.log("clicked")}> Use to track every click in popup */}
          <CampaignContextProvider
            campaign={campaignName[0] !== undefined ? campaignName[0].item : ""}
          >
            <ModalNewsletter
              children={children}
              textButton={textButton}
            ></ModalNewsletter>
          </CampaignContextProvider>
        </div>
        // </div>
      );
    } else {
      return (
        <CampaignContextProvider
          campaign={campaignName[0] !== undefined ? campaignName[0].item : ""}
        >
          <ModalNewsletter children={children} time={time}></ModalNewsletter>
        </CampaignContextProvider>
      );
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
      type: "array",
      uniqueItems: true,
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