import React from "react";
// import { useState,useEffect } from "react";
import ModalNewsletter from "./Modal";
// import {  getSessionData,  getIdUser} from "./utils/categoryAdviceUtils"
import style from "./ProductCategoryAdviceForm.css";
// import { CampaignContextProvider } from "./CampaignContext";

interface ProductCategoryAdvicePopupProps {
  textDescription?: string;
  showCategoryAdvice?: boolean;
  textButton?: string;
  children: React.Component;
  // campaignName:string
}
const ProductCategoryAdvicePopup: StorefrontFunctionComponent<ProductCategoryAdvicePopupProps> = ({
  textDescription,
  showCategoryAdvice,
  textButton,
  children,
  // campaignName = "form_HP_promo_5%disc",
}: ProductCategoryAdvicePopupProps) => {
  // const [user, setUser] = useState(true);

  // useEffect(() => {
  //   getSessionData().then((response: any) => {
  //     if (
  //       response.namespaces.profile !== undefined &&
  //       !(response.namespaces.profile.isAuthenticated.value == "false")
  //     ) {
  //       getIdUser(
  //         response.namespaces.profile.email.value
  //       ).then((response: any) => {
  //         const isOptin = response[0].isNewsletterOptIn;
  //         setUser(isOptin);
  //       });
  //     } else {
  //       setUser(false);
  //     }
  //   });
  // }, []);

  const getOptin = () => {
    // if (user == false) {
      
      if (showCategoryAdvice) {
        return (
          <div className={"vtex-container__newsletter " + style.container}>
            <div
              className={"vtex-description__newsletter " + style.description}
            >
              {textDescription}
            </div>
            {/* <CampaignContextProvider
              campaign={campaignName !== undefined ? campaignName : ""}
            > */}
              <ModalNewsletter
                children={children}
                textButton={textButton}
                // campaign = {campaignName}
              ></ModalNewsletter>
            {/* </CampaignContextProvider> */}
          </div>
        );
      }else {
        return <> Medlique showCategoryAdvice</>;
      }
    // } else {
    //   return <> Medlique user == false </>;
    // }
  };
  return getOptin();
};

ProductCategoryAdvicePopup.schema = {
  title: "ProductCategoryAdvicePopup",
  description: "Pop up for Product Category Advice app",
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
  },
};

export default ProductCategoryAdvicePopup;
