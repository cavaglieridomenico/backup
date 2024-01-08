import React from "react";
import { useQuery } from "react-apollo";
import getSession from "./graphql/getSession.graphql";
import Skeleton from "./components/Skeleton";
import { useCssHandles } from "vtex.css-handles";
import { CSS_HANDLES } from "./utils/utils";
import "./style.css";

interface DiscoverMoreProps {
  labelBeforeName: string;
  symbolAfterName: string;
  bannerText: string;
}

const DiscoverMore: StorefrontFunctionComponent<DiscoverMoreProps> = ({
  children,
  labelBeforeName,
  symbolAfterName,
  bannerText,
}) => {
  const handles = useCssHandles(CSS_HANDLES);

  const { data, loading, error } = useQuery(getSession, {
    ssr: false,
    variables: {
      items: ["profile.isAuthenticated", "profile.firstName"],
    },
  });

  const isAuthenticated =
    data?.session?.namespaces?.profile?.isAuthenticated?.value == "true";
  const firstName = data?.session?.namespaces?.profile?.firstName?.value;

  return (
    <>
      {!loading ? (
        <div className={handles.wrapper}>
          <div className={handles.container}>
            <span className={handles.bannerText}>
              {!error && isAuthenticated && firstName && (
                <span className={handles.bannerTextUser}>
                  {labelBeforeName}
                  {firstName}
                  {symbolAfterName}
                </span>
              )}
              {bannerText}
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
      title: "Label before name",
      description: "This label will appear before the user name (if logged)",
      default: "Hi ",
      type: "string",
    },
    symbolAfterName: {
      title: "Symbol after name",
      description: "This symbol will appear before the user name (if logged)",
      default: "! ",
      type: "string",
    },
    bannerText: {
      title: "Banner text",
      description: "This is the banner text",
      default: "Discover our offers",
      type: "string",
    },
  },
};

export default DiscoverMore;
