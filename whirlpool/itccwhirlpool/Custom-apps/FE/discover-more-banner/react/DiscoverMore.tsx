import React from "react";
import { useQuery } from "react-apollo";
import { useRuntime } from "vtex.render-runtime";
import getSession from "./graphql/getSession.graphql";
import Skeleton from "./components/Skeleton";
import { useCssHandles } from "vtex.css-handles";
import { CSS_HANDLES } from "./utils/utils";
import "./style.css";

interface DiscoverMoreProps {
  labelBeforeName: string;
  labelBeforeName_lang: string;
  symbolAfterName: string;
  bannerText: string;
  bannerText_lang: string;
}

const DiscoverMore: StorefrontFunctionComponent<DiscoverMoreProps> = ({
  children,
  labelBeforeName,
  labelBeforeName_lang,
  symbolAfterName,
  bannerText,
  bannerText_lang,
}) => {
  const handles = useCssHandles(CSS_HANDLES);
  const { culture } = useRuntime();

  const { data, loading, error } = useQuery(getSession, {
    ssr: false,
    variables: {
      items: ["profile.isAuthenticated", "profile.firstName"],
    },
  });

  const isAuthenticated =
    data?.session?.namespaces?.profile?.isAuthenticated?.value == "true";
  const firstName = data?.session?.namespaces?.profile?.firstName?.value;
  const locale = culture.locale === "it-IT" ? true : false;

  return (
    <>
      {!loading ? (
        <div className={handles.wrapper}>
          <div className={handles.container}>
            <span className={handles.bannerText}>
              {!error && isAuthenticated && firstName && (
                <span className={handles.bannerTextUser}>
                  <span className={handles.labelBeforeName}>
                    {!locale ? labelBeforeName : labelBeforeName_lang}
                  </span>
                  <span className={handles.firstName}>{firstName}</span>
                  <span className={handles.symbolAfterName}>
                    {symbolAfterName}
                  </span>
                </span>
              )}
              <span className={handles.bannerTextLabel}>
                {!locale ? bannerText : bannerText_lang}
              </span>
            </span>
          </div>
          <div className={handles.childrenContainer}>{children}</div>
        </div>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

DiscoverMore.schema = {
  title: "Discover More Banner",
  description: "Labels to be visualized in the discover more banner",
  type: "object",
  properties: {
    labelBeforeName: {
      title: "Label before name english lang",
      description: "This label will appear before the user name (if logged)",
      default: "Hi ",
      type: "string",
    },
    labelBeforeName_lang: {
      title: "Label before name current lang",
      description: "This label will appear before the user name (if logged)",
      default: "Hi ",
      type: "string",
    },
    symbolAfterName: {
      title: "Symbol after name english lang",
      description: "This symbol will appear before the user name (if logged)",
      default: "! ",
      type: "string",
    },
    bannerText: {
      title: "Banner text english lang",
      description: "This is the banner text",
      default: "Discover our offers",
      type: "string",
    },
    bannerText_lang: {
      title: "Banner text current lang",
      description: "This is the banner text",
      default: "Discover our offers",
      type: "string",
    },
  },
};

export default DiscoverMore;
