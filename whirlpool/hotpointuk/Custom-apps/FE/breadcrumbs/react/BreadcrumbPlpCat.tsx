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
  console.log("searchQuery",searchQuery)
  //GET CATEGORIES WITHOUT PRE-PLP
  const catNoPrePlp = require('./utils/categoriesWithoutPrePlp.js')
  const categoriesNoPrePlp = catNoPrePlp.default
  const categoryToCheck = searchQuery?.variables?.selectedFacets[2]?.value
  
  const prePlp = searchQuery?.variables?.selectedFacets[1]?.value;
  const category =  searchQuery?.variables?.selectedFacets[2]?.value.replace(/-/g," ")?searchQuery?.variables?.selectedFacets[2]?.value.replace(/-/g," ") : prePlp
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;

  const link1=searchQuery?.variables?.selectedFacets[0]?.value ? "/"+searchQuery?.variables?.selectedFacets[0]?.value : ""
  const link2=searchQuery?.variables?.selectedFacets[1]?.value ? "/"+searchQuery?.variables?.selectedFacets[1]?.value : ""
  const link3=searchQuery?.variables?.selectedFacets[2]?.value ? "/"+searchQuery?.variables?.selectedFacets[2]?.value : ""

  const prePlpUrl =  link1+link2
  const completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost +link1+link2+link3

useEffect(()=>{
    localStorage.setItem("cat",categoryToCheck)
  },[])

  return (
    categoriesNoPrePlp?.indexOf(categoryToCheck) < 0 && (prePlp)!==(category)  ?  //it means that this category has prePlp
      <>
        {category ?
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
          :
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
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "`+ prePlp +`",
                "item": "`+ completeUrl +`"
              }]
            }
          `}</script>
          </Helmet>
        }
        <div>
          <a className={style.catLink} href={"/"}>
            Home
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          {category ? 
            <a className={style.catLink} href={prePlpUrl}>
              {!prePlp ? applienceBreadcrumb : prePlp}
            </a>
            :
            <a className={style.catBold}>
              {!prePlp ? applienceBreadcrumb : prePlp}
            </a>
          }
          {category ? 
            <>
              <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
              <a className={style.catBold}>
                {category}
              </a>
            </>
            : 
            null
          } 
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
              "item": "`+baseUrl+`"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "`+ category+`",
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
            { category}
          </a>
        </div>
      </>
    );
};

export default BreadcrumbPlpCat;
