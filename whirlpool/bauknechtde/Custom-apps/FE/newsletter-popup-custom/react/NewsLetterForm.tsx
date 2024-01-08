import React from "react";

/* components */
import LandingPageForm from "./components/LandingPageForm";
import PopupForm from "./components/PopupForm";

import { CampaignContextProvider } from "./CampaignContext";
interface NewsLetterFormProps {
  campaignName: [any];
  isLandingPage: boolean;
  children: any;
  textButton?: string;
  linkPrivacy: string;
  linkThankYouPage: any;
  popupTitle: string;
  popupDescriptionBold: string;
  popupDescription: string;
  name: boolean;
  surname: boolean;
  alreadyRegisteredForNewsletterUserLabel: string;
  alreadyRegisteredUserLabel: string;
  emailPlaceholder: string;
  namePlaceholder: string;
  surnamePlaceholder: string;
  promotionText: string;
}

/* component */
const NewsLetterForm: StorefrontFunctionComponent<NewsLetterFormProps> = ({
  campaignName = [{ item: "FORM_HP_PROMO_5%DISC" }],
  linkThankYouPage = "/newsletter-thank-you",
  linkPrivacy = "/seiten/datenschutzerklaerung",
  popupTitle,
  popupDescriptionBold,
  popupDescription,
  isLandingPage,
  children,
  name = true,
  surname = true,
  alreadyRegisteredForNewsletterUserLabel,
  alreadyRegisteredUserLabel,
  emailPlaceholder,
  namePlaceholder,
  surnamePlaceholder,
  promotionText
}: NewsLetterFormProps) => {
  const generateForm = () => {
    return (
      <CampaignContextProvider
        campaign={campaignName[0] ? campaignName[0]?.item : ""}
      >
        {isLandingPage && (
          <LandingPageForm
            linkThankYouPage={linkThankYouPage}
            linkPrivacy={linkPrivacy}
            name={name}
            surname={surname}
            alreadyRegisteredForNewsletterUserLabel={
              alreadyRegisteredForNewsletterUserLabel
            }
            alreadyRegisteredUserLabel={alreadyRegisteredUserLabel}
            emailPlaceholder={emailPlaceholder}
            promotionText={promotionText}
          />
        )}
        {!isLandingPage && (
          <PopupForm
            children={children}
            linkThankYouPage={linkThankYouPage}
            linkPrivacy={linkPrivacy}
            popupTitle={popupTitle}
            popupDescriptionBold={popupDescriptionBold}
            popupDescription={popupDescription}
            name={name}
            surname={surname}
            alreadyRegisteredForNewsletterUserLabel={
              alreadyRegisteredForNewsletterUserLabel
            }
            alreadyRegisteredUserLabel={alreadyRegisteredUserLabel}
            emailPlaceholder={emailPlaceholder}
            namePlaceholder={namePlaceholder}
            surnamePlaceholder={surnamePlaceholder}
            promotionText={promotionText}
          />
        )}
      </CampaignContextProvider>
    );
  };
  return generateForm();
};

NewsLetterForm.schema = {
  title: "NewsLetterFrom",
  description: "Newsletter form",
  type: "object"
};

export default NewsLetterForm;
