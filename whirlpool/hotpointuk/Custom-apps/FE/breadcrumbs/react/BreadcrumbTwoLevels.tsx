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

    let baseUrl =  "https://" + __RUNTIME__.assetServerLinkedHost;
    if(__RUNTIME__.route.canonicalPath.includes("spare-parts")){
      baseUrl+="/spare-parts"
    }
    let completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost + __RUNTIME__.route.canonicalPath;
    let baseLabel = "Home";
    if(__RUNTIME__.route.canonicalPath.includes("spare-parts")){
      baseLabel= "Spare Parts"
    }
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
            "name": "`+ baseLabel+`",
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
        <a className={style.catLink} href={baseUrl}>
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
  description: 'editor.breadcrumbTwoLevels.description',
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


