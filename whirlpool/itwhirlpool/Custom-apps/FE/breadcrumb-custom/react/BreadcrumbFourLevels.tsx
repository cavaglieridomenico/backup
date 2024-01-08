//@ts-nocheck
import React from 'react'
import Helmet from "react-helmet";
import style from "./style.css";

interface BreadcrumbFourLevelsProps {
    firstLevelName: string,
    secondLevelName: string,
    thirdLevelName: string,
    fourthLevelName: string,
    secondLevelHref: string,
    thirdLevelHref: string,
}

const BreadcrumbFourLevels: StorefrontFunctionComponent<BreadcrumbFourLevelsProps> = ({
    firstLevelName,
    secondLevelName,
    thirdLevelName,
    fourthLevelName,
    secondLevelHref,
    thirdLevelHref
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
            "item": "`+ baseUrl + `"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "`+ secondLevelName + `",
            "item": "`+ secondLevelHref + `"
          },{
            "@type": "ListItem",
            "position": 3,
            "name": "`+ thirdLevelName + `",
            "item": "`+ thirdLevelHref + `"
          },{
            "@type": "ListItem",
            "position": 4,
            "name": "`+ fourthLevelName + `",
            "item": "`+ completeUrl + `"
          }]
        }
      `}</script>
            </Helmet>
            <div className={style.breadCustom}>
                <a className={style.catLink} href={"/"}>
                    {firstLevelName}
                </a>
                <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} />
                <a className={style.catLink} href={secondLevelHref}>
                    {secondLevelName}
                </a>
                {thirdLevelName != '' && fourthLevelName != '' &&
                    <>
                        <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} />
                        <a className={style.catLink} href={thirdLevelHref}>
                            {thirdLevelName}
                        </a>
                    </>
                }
                {thirdLevelName != '' && fourthLevelName == '' &&
                    <>
                        <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} />
                        <a className={style.catBold}>
                            {thirdLevelName}
                        </a>
                    </>
                }
                {fourthLevelName != '' &&
                    <>
                        <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} />
                        <a className={style.catBold}>
                            {fourthLevelName}
                        </a>
                    </>
                }
            </div>
        </>
    );
};

BreadcrumbFourLevels.schema = {
    title: 'Breadcrumb Four Levels',
    description: 'editor.breadcrumbFourLevels.description',
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
        },
        secondLevelHref: {
            title: "Second level link",
            description: "",
            type: "string",
            default: "/",
        },
        thirdLevelName: {
            title: "Third level name",
            description: "",
            type: "string",
            default: "ThirdLevel Name",
        },
        thirdLevelHref: {
            title: "Third level link",
            description: "",
            type: "string",
            default: "/",
        },
        fourthLevelName: {
            title: "Fourth level name",
            description: "",
            type: "string",
            default: "FourthLevel Name",
        }
    },
}

export default BreadcrumbFourLevels


