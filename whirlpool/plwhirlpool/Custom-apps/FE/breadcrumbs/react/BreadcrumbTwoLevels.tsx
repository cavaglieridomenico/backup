import React from "react";
import Helmet from "react-helmet";
import { useCssHandles } from "vtex.css-handles";

type BreadcrumbTwoLevelsProps = {
  firstLevelName: string;
  secondLevelName: string;
};

const CSS_HANDLES = ["breadCustom", "catLink", "arrowImg", "catBold"];

const BreadcrumbTwoLevels: StorefrontFunctionComponent<BreadcrumbTwoLevelsProps> = ({
  firstLevelName,
  secondLevelName,
}) => {
  const baseUrl = window?.location?.protocol + "//" + window.location?.hostname;
  const completeUrl = window.location?.href;
  const handles = useCssHandles(CSS_HANDLES);
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {`
        {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "` +
            baseUrl +
            `"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "` +
            secondLevelName +
            `",
            "item": "` +
            completeUrl +
            `"
          }]
        }
      `}
        </script>
      </Helmet>
      <div className={handles.breadCustom}>
        <a className={handles.catLink} href={"/"}>
          {firstLevelName}
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catBold}>{secondLevelName}</a>
      </div>
    </>
  );
};

BreadcrumbTwoLevels.schema = {
  title: "Breadcrumb Two Levels",
  description: "editor.breadcrumbTwoLevels.description",
  type: "object",
  properties: {
    firstLevelName: {
      title: "First level name",
      description: "",
      type: "string",
      default: "Home",
    },
    secondLevelName: {
      title: "Second level name",
      description: "",
      type: "string",
      default: "SecondLevel Name",
    },
  },
};

export default BreadcrumbTwoLevels;
