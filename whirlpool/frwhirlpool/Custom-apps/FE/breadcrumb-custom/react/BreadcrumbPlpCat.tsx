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
console.log("plpcat")
  //GET CATEGORIES WITHOUT PRE-PLP
  let secondLevelCategory;
  const catNoPrePlp = require('./utils/categoriesWithoutPrePlp.js')
  const categoriesNoPrePlp = catNoPrePlp.default
  const categoryToCheck = searchQuery?.variables?.selectedFacets[2]?.value
  const category = searchQuery?.variables?.selectedFacets[2]?.value.replace(/-/g," ");
  const prePlp = searchQuery?.variables?.selectedFacets[1]?.value;
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;

  if(searchQuery?.variables?.selectedFacets[1]?.value=="lave-vaisselle"){
    secondLevelCategory = searchQuery?.variables?.selectedFacets[3]?.value.replace(/-/g," "); 
  }
  else{
    if(searchQuery?.variables?.selectedFacets[2]?.value=="refrigerateur-americain"){   
      secondLevelCategory="réfrigérateur multi-portes"
    }
    else{
      secondLevelCategory= category
    }
  }
  const prePlpUrl = searchQuery?.variables?.selectedFacets[1]?.value ? "/" + searchQuery?.variables?.selectedFacets[0]?.value + "/" + searchQuery?.variables?.selectedFacets[1]?.value : "/" + searchQuery?.variables?.selectedFacets[0]?.value
  const completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost + __RUNTIME__.route.canonicalPath;
 const ap=searchQuery?.variables?.selectedFacets[1]?.value
 const accessoire=prePlpUrl.includes("accessoires")?"accessoire ":"";
  useEffect(()=>{
    localStorage.setItem("cat",categoryToCheck)
  },[])

  return (
    prePlpUrl.includes("climatiseurs") ?
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
              "name": "Climatiseurs",
              "item": "`+completeUrl+`"
            }]
          }
        `}</script>
        </Helmet>
        <div>
          <a className={style.catLink} href={"/"}>
            Accueil
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catBold}>
            Climatiseurs
          </a>
        </div>
      </>
    :
    categoriesNoPrePlp?.indexOf(categoryToCheck) < 0 ?  //it means that this category has prePlp
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
              "name": "`+ accessoire+prePlp +`",
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
            Accueil
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catLink} href={prePlpUrl}>
            {accessoire+prePlp}
          </a>
          {category ? <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>: null}
          
          <a className={style.catBold}>
            {secondLevelCategory}
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
