/**
 * @param {time,children}
 * @returns NewsletterModal component with content based on children passed
 */

import React, { useState, useEffect } from "react";
import NewsletterModal from "./components/NewsletterModal";
import { handleApi } from "./hooks/useNewsletterForm";
import getAppSettings from "./graphql/settings.graphql";
import { useQuery } from "react-apollo";
import { appInfos, AppSettings } from "./utils/utils";

interface NewsletterAutomaticPopupProps {
  time?: number;
  children: React.Component;
}
const NewsletterAutomaticPopup: StorefrontFunctionComponent<
  NewsletterAutomaticPopupProps
> = ({ time, children }: NewsletterAutomaticPopupProps) => {
  const [userIsNewsletterOptin, setUserIsNewsletterOptin] = useState(false);

  /*
    Graph QL query to get AppSettings, specifically endpoints setted
    from App settings in VTEX Admin
  */
  const { data } = useQuery(getAppSettings, {
    ssr: false,
    variables: {
      app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version,
    },
  });
  const settings: AppSettings = data && JSON.parse(data?.publicSettingsForApp?.message);
  /* 
    Set endpoints, if they are available from App settings take them.
    Otherwise take the ones hard coded
  */
  const userInfoApi =
    settings?.userInfoApi ?? "/_v/wrapper/api/user/email/userinfo?email=";
  const sessionApi = settings?.sessionApi ?? "/api/sessions?items=*";

  useEffect(() => {
    handleIsNewsletterOptin();
  }, []);

  /*
    Handle isNewsletterOptin, check if User is logged in and already has 
    the isNewsletterOptin setted to true. In this case we don't have to show
    the Automatic Newsletter Popup
  */
  const handleIsNewsletterOptin = async () => {
    const session = await handleApi("GET", sessionApi);
    if (session?.namespaces?.profile?.isAuthenticated?.value == "true") {
      let userEmail = session?.namespaces?.profile?.email?.value;
      const users = await handleApi("GET", `${userInfoApi}${userEmail}`);
      if (users && users[0]?.isNewsletterOptin) {
        setUserIsNewsletterOptin(true);
      }
    }
  };

  return (
    <>
      {!userIsNewsletterOptin && (
        <NewsletterModal children={children} time={time} />
      )}
    </>
  );
};

NewsletterAutomaticPopup.schema = {
  title: "Newsletter Automatic Popup",
  description: "Automatic popup shown to let the user subscribe to Newsletter",
  type: "object",
  properties: {
    time: {
      title: "Time to open popup",
      description:
        "Choose Time expressed in milliseconds to open Newsletter popup (i.e 15000 = 15 seconds)",
      type: "number",
    },
  },
};

export default NewsletterAutomaticPopup;
