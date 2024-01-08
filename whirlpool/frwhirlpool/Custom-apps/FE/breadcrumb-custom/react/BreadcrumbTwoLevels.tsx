//@ts-nocheck
import React from 'react'
import Helmet from "react-helmet";
import style from "./style.css";

interface BreadcrumbTwoLevelsProps {
  firstLevelName: string,
  secondLevelName: string,
}

const BreadcrumbTwoLevels: StorefrontFunctionComponent<BreadcrumbTwoLevelsProps> = ({
  firstLevelName,
  secondLevelName,
}) => {

    const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;
    const completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost + __RUNTIME__.route.canonicalPath;

  return (
    <>
      <Helmet>
      <script type="application/ld+json">{`
        {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "`+baseUrl+`"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "`+secondLevelName+`",
            "item": "`+completeUrl+`"
          }]
        }
      `}</script>
      </Helmet>
      <div className={style.breadCustom}>
        <a className={style.catLink} href={"/"}>
          {firstLevelName}
        </a>
        <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
        <a className={style.catBold}>
          {secondLevelName}
        </a>
      </div>
    </>
    );
};

BreadcrumbTwoLevels.schema = {
  title: 'Breadcrumb Two Levels',
  description: 'Component used to display breadcrumb with two levels',
  type: 'object',
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
    }
  },
}

export default BreadcrumbTwoLevels


