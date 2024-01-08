//@ts-nocheck
import React from 'react'
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import Helmet from "react-helmet";
import style from "./style.css";
import { useEffect } from 'react';

interface BreadcrumbPlpCatProps {
  firstLevelName: string,
  secondLevelName: string,
  secondLevelHref: string,
  thirdLevelName: string
}

const BreadcrumbPlpCat: StorefrontFunctionComponent<BreadcrumbPlpCatProps> = ({
  // firstLevelName,
  // secondLevelName,
  // secondLevelHref,
  // thirdLevelName
}) => {

  const { searchQuery } = useSearchPage();
  //GET CATEGORIES WITHOUT PRE-PLP
  const catNoPrePlp = require('./utils/categoriesWithoutPrePlp.js')
  const categoriesNoPrePlp = catNoPrePlp.default
  const categoryToCheck = searchQuery?.variables?.selectedFacets[2]?.value
  const category = searchQuery?.variables?.selectedFacets[2]?.value.replace(/-/g, " ") ? searchQuery?.variables?.selectedFacets[2]?.value.replace(/-/g, " ") : prePlp
  const prePlp = searchQuery?.variables?.selectedFacets[1]?.value.replace(/-/g," ");
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;
  const prePlpUrl = "/" + searchQuery?.variables?.selectedFacets[0]?.value + "/" + searchQuery?.variables?.selectedFacets[1]?.value
  const completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost + __RUNTIME__.route.canonicalPath;
  
  useEffect(()=>{
    localStorage.setItem("cat",categoryToCheck)
  },[])

  return (
    categoriesNoPrePlp?.indexOf(categoryToCheck) < 0 && (prePlp) !== (category) ?  //it means that this category has prePlp
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
              "name": "`+ prePlp +`",
              "item": "`+ baseUrl + prePlpUrl +`"
            },{
              "@type": "ListItem",
              "position": 3,
              "name": "`+ category +`",
              "item": "`+ completeUrl +`"
            }]
          }
        `}</script>
        </Helmet>
        <div>
          <a className={style.catLink} href={"/"}>
            Home
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a style={{pointerEvents: `${!category && "none"}`}} className={`${style.catLink} ${!category && style.catBold}`} href={prePlpUrl}>
            {prePlp}
          </a>
          {category ? <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>: null}
          
          <a className={style.catBold}>
            {category}
          </a>
        </div>
      </>
      :
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
              "item": "`+__RUNTIME__.account+`"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "`+ category +`",
              "item": "`+completeUrl+`"
            }]
          }
        `}</script>
        </Helmet>
        <div>
          <a className={style.catLink} href={"/"}>
            Home
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catBold}>
            {category}
          </a>
        </div>
      </>
    );
};

// BreadcrumbPlpCat.schema = {
//   title: 'Breadcrumbs PLP',
//   description: 'editor.breadcrumbPlpCat.description',
//   type: 'object',
//   properties: {
//     firstLevelName: {
//       title: "First level name",
//       description: "Name of the first breadcrumbs step",
//       type: "string",
//       default: "Home",
//     },
//     secondLevelName: {
//       title: "Second level name",
//       description: "Name of the second breadcrumbs step",
//       type: "string",
//       default: "SecondLevel Name",
//     },
//     secondLevelHref: {
//       title: "Second level href",
//       description: "URL of the second breadcrumbs step (TO SET ONLY IF THE SELECTED CATEGORY HAS THE PRE-PLP)",
//       type: "string",
//       default: "SecondLevel Href",
//     },
//     thirdLevelName: {
//       title: "Third level name",
//       description: "Name of the third breadcrumbs step (TO SET ONLY IF THE SELECTED CATEGORY HAS THE PRE-PLP)",
//       type: "string",
//       default: "ThirdLevel Name",
//     }
//   },
// }

export default BreadcrumbPlpCat;