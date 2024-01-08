/**
 * @param {FormData,errors,optInCheck,campaign,setShowErrors}
 * @returns handleSubmit function and status
 */
import { useState } from "react";
import { useIntl } from "react-intl";
import { messages } from "../utils/utils";
import { usePixel } from "vtex.pixel-manager";
import { Status, UserErrors, Method } from "../typings/global";
import getAppSettings from "../graphql/settings.graphql";
import { useQuery } from "react-apollo";
import { appInfos, AppSettings } from "../utils/utils";
interface Props {
  form: { [key: string]: string };
  errors: UserErrors;
  errorCheckboxes: (boolean | undefined)[];
  optInCheck: boolean;
  profilingOptIn: boolean;
  campaign?: string;
  setShowErrors: React.Dispatch<React.SetStateAction<boolean>>;
  submitButtonText?: string;
  pixelEventName?: string;
}
interface WindowGTM extends Window {
  dataLayer: any[];
}

export const handleApi = async (
  method: Method,
  url: string,
  body?: { [key: string]: any }
) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  };
  const raw = await fetch(url, options);
  if (raw.ok) {
    // Check if raw json
    if (
      raw?.headers?.get("content-type") &&
      raw?.headers?.get("content-type")?.indexOf("application/json") !== -1
    )
      return await raw.json();
    else return await raw.text();
  } else throw new Error();
};

export const useNewsletterForm = ({
  errors,
  errorCheckboxes,
  form,
  optInCheck,
  profilingOptIn,
  campaign,
  setShowErrors,
  submitButtonText,
  pixelEventName,
}: Props) => {
  /**
   * Graph QL query to get AppSettings, specifically endpoints setted
   * from App settings in VTEX Admin
   */
  const { data } = useQuery(getAppSettings, {
    ssr: false,
    variables: {
      app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version,
    },
  });
  const settings: AppSettings =
    data && JSON.parse(data?.publicSettingsForApp?.message);
  /**
   * Set endpoints, if they are available from App settings take them.
   * Otherwise take the ones hard coded
   */
  const newsletteroptinApi =
    settings?.newsletteroptinApi ??
    "/_v/wrapper/api/user/newsletteroptin?email=";
  const postUserApi =
    settings?.postUserApi ?? "/_v/wrapper/api/user?userId=true";
  const userInfoApi =
    settings?.userInfoApi ?? "/_v/wrapper/api/user/email/userinfo?email=";
  const sessionApi = settings?.sessionApi ?? "/api/sessions?items=*";

  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  const { push } = usePixel();
  const { formatMessage } = useIntl();
  // Email regEx to validated email
  const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
  /**
   * Set the campaign to use in the Newsletter form subscription.
   * If the campaign isn't present in URL as query param take it
   * from CMS SiteEditor
   */
  const queryString = window?.location?.search;
  const urlParams = queryString ? new URLSearchParams(queryString) : null;
  const campaignFromUrl = urlParams ? urlParams?.get("campaign") : null;

  const targetCampaign = campaignFromUrl
    ? campaignFromUrl?.toString()?.toUpperCase()?.replace("=", "")
    : campaign;

  /**
   * Check if form is valid and we can proceed with API calls
   */
  const formIsValid =
    Object.values(form).every((field) => !!field) &&
    Object.values(errors).every((error) => !error) &&
    Object.values(errorCheckboxes).every((error) => !error) &&
    optInCheck;
  /**
   * Handle status of API calls
   */
  const [status, setStatus] = useState<Status>();
  /**
   * GA4FUNREQ58
   */
  const setAnalyticCustomError = (): void => {
    const ga4Data = {
      event: "ga4-custom_error",
      type: "error message",
      description: "",
    };

    const errorMessages = {
      invalidEmailMessage: "Invalid email format",
      noNameMessage: "Name not entered",
      noSurnameMessage: "Surname not entered",
      privacyNotAccepted: "Privacy not accepted",
    };

    if (!regEx.test(form.email)) {
      ga4Data.description = errorMessages.invalidEmailMessage;
      push({ ...ga4Data });
    }
    if (!form.name) {
      ga4Data.description = errorMessages.noNameMessage;
      push({ ...ga4Data });
    }
    if (!form.surname) {
      ga4Data.description = errorMessages.noSurnameMessage;
      push({ ...ga4Data });
    }
    if (!optInCheck) {
      ga4Data.description = errorMessages.privacyNotAccepted;
      push({ ...ga4Data });
    }
  };

  const handleSubmit = async () => {
    setShowErrors(true);
    if (!formIsValid) {
      errors = {
        name: !form.name,
        surname: !form.surname,
        email: !form.email,
        optIn: !optInCheck,
      };
      setAnalyticCustomError();
      return;
    }
    setStatus("LOADING");
    try {
      const users = await handleApi("GET", `${userInfoApi}${form.email}`);
      // USER EXISTS AND IS NOT OPT IN TO NEWSLETTER
      if (users.length && !users[0].isNewsletterOptIn) {
        const session = await handleApi("GET", sessionApi);
        // IF USER IS NOT AUTHENTICATED HE MUST BE WARNED TO LOG IN
        if (session?.namespaces?.profile?.isAuthenticated?.value == "false") {
          setStatus("LOGIN_ERROR");
        } else {
          // IF USER IS AUTHENTICATED HE WILL OPT IN FOR NEWSLETTER
          await handleApi("PATCH", newsletteroptinApi, {
            email: form.email,
            firstName: form.name,
            lastName: form.surname,
            isNewsletterOptIn: true,
            isProfilingOptIn: profilingOptIn,
            campaign: targetCampaign,
          });
          setStatus("SUCCESS");
        }
      }
      // USER EXISTS AND IS ALREADY REGISTERED TO NEWSLETTER -> ERROR
      else if (users.length && users[0].isNewsletterOptIn) {
        setStatus("REGISTERED_ERROR");
      }
      // USER DOESN'T EXIST
      else {
        await handleApi("POST", postUserApi, {
          email: form.email,
          firstName: form.name,
          lastName: form.surname,
          isNewsletterOptIn: true,
          isProfilingOptIn: profilingOptIn,
          campaign: targetCampaign,
        });

        setStatus("SUCCESS");
        // Handle GA events
        handleGAEvents();
      }
    } catch (error) {
      setStatus("GENERIC_ERROR");
    }
  };

  /**
   * Function to handle all necessary GA events
   * on success user creation
   */
  const handleGAEvents = () => {
    dataLayer.push({
      event: "userRegistration",
    });
    dataLayer.push({
      event: "personalArea",
      eventCategory: "Personal Area",
      eventAction: "Start Registration",
      eventLabel: "Start Registration from NewsLetter",
    });
    dataLayer.push({
      event: "leadGeneration",
      eventCategory: "Lead Generation",
      eventAction: "Optin granted",
      eventLabel: "Lead from newsletter",
      email: form?.email,
    });

    //CTA Click
    push({
      event: pixelEventName,
      text: submitButtonText ?? formatMessage(messages.submitButtonText),
    });

    //GA4FUNREQ23
    push({
      event: "ga4-personalArea",
      section: "Newsletter",
      type: "registration",
    });

    //GA4FUNREQ53
    push({
      event: "ga4-form_submission",
      type: "newsletter",
    });

    //GA4FUNREQ61
    push({
      event: "ga4-optin",
    });
  };

  return {
    handleSubmit,
    status,
  };
};
