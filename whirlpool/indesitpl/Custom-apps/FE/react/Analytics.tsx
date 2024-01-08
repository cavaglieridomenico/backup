import React from "react";
import FeReady from "./FeReady";
import { NotFoundEvent } from "./NotFoundEvent";

interface AnalyticsProps {
  pageType: "staticPage" | "plp" | "pdp";
  pageTypeEvent:
    | "home"
    | "search"
    | "contact"
    | "detail"
    | "category"
    | "cart"
    | "checkout"
    | "purchase"
    | "other"
    | "error";
  contentGrouping:
    | "Homepage"
    | "Company"
    | "Catalog"
    | "Marketing"
    | "Support"
    | "Personal"
    | "Errors"
    | "News"
    | "Recipes"
    | "Events"
    | "Promotions"
    | "Other";
}
interface WindowGTM extends Window {
  dataLayer: any[];
}

export let dataLayer = (window as unknown as WindowGTM).dataLayer || [];

const Analytics: StorefrontFunctionComponent<AnalyticsProps> = ({
  pageType = "staticPage",
  pageTypeEvent = "other",
  contentGrouping = "Other",
}) => {
  return (
    <>
      <FeReady
        dataLayer={dataLayer}
        pageType={pageType}
        pageTypeEvent={pageTypeEvent}
        contentGrouping={contentGrouping}
      />

      <NotFoundEvent dataLayer={dataLayer} pageType={pageTypeEvent} />
    </>
  );
};

export default Analytics;
