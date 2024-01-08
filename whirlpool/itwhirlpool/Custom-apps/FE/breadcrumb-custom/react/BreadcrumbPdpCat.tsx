//@ts-nocheck
import React from 'react'
import { useProduct } from "vtex.product-context";
import Helmet from "react-helmet";
import style from "./style.css";
import { useEffect } from 'react';
import { useState } from 'react';

interface BreadcrumbPdpCatProps {
  firstLevelName: string,
  secondLevelName: string,
  secondLevelHref: string,
  thirdLevelName: string,
}

export const BreadcrumbPdpCat: StorefrontFunctionComponent<BreadcrumbPdpCatProps> = () => {
  const productContext = useProduct();
  const prePlp = productContext?.product?.categoryId==="31" ? productContext?.product?.categories[3].split(/[//]/)[1] : productContext?.product?.categories[0].split(/[//]/)[2]
  const plpCategoryLink = productContext?.product?.categoryId==="31" ? productContext?.product?.categories[1].replace(/\s/g, "-").slice(0,-1) :  productContext?.product?.categories[0].replace(/\s/g, "-").slice(0,-1); 
  const plpCategorySecondLevel = productContext?.product?.categoryId==="31" ? productContext?.product?.categories[2].replace(/\s/g, "-").slice(0,-1) : productContext?.product?.categories[1].replace(/\s/g, "-").slice(0,-1);
  const productCategory =  productContext?.product?.categoryId==="31" ? productContext?.product?.categories[0].split(/[//]/)[2] : (productContext?.product?.categories[0].split(/[//]/)[3] || productContext?.product?.categories[2].split(/[//]/)[3]);
  const productComCode = productContext?.product?.properties?.filter((e: any) => e.name == "CommercialCode_field")[0]?.values[0]
  const prePlpLink = "/" + productCategory?.replace(/\s/g, "-")
  //Additional for the bug on microwaves from compacts category
  const productCategory2 = productContext?.product?.categories[3] !== undefined ? productContext?.product?.categories[3]?.split(/[//]/)[3] : productCategory
  const plpCategoryLink2 = productCategory2 !== productCategory ? productContext?.product?.categories[1].replace(/\s/g, "-").slice(0,-1) : plpCategoryLink;
  //GET CATEGORIES WITHOUT PRE-PLP
  const catNoPrePlp = require('./utils/categoriesWithoutPrePlp.js')
  const categoriesNoPrePlp = catNoPrePlp.default
  const categoryToCheck = productCategory.replace(" ","-")
  //URLS FOR HELMET SCRIPT
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;
  const completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost + __RUNTIME__.route.canonicalPath;
  const category = productContext?.product?.categories[1];
  //CHECK CATEGORY FROM LOCALSTORAGE FOR FIX THE COMPACTS ISSUE
  const [check,setCheck] = useState<any>()
  useEffect(()=>{
    setCheck(localStorage.getItem("cat"))
  },[])
  
  return (
    categoriesNoPrePlp?.indexOf(categoryToCheck) < 0 && check !== "compacts" ?
    (<>
      <Helmet>
        <script type="application/ld+json">{`
          {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "`+ baseUrl +`"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "`+ prePlp +`",
              "item": "`+ baseUrl + prePlpLink +`"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "`+ productCategory +`",
              "item": "`+ baseUrl + plpCategoryLink +`"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "`+ productComCode +`",
              "item":"`+ completeUrl +`"
            }]
          }
        `}</script>
      </Helmet>
        <div>
          <a className={style.catLink} href={"/"}>
            Home
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catLink} href={plpCategorySecondLevel}>
            {prePlp}
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catLink} href={plpCategoryLink}>
            {productCategory}
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catBold}>
            {productComCode}
          </a>
        </div>
    </>)
    :
    (<>
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
              "name": "`+ productCategory2 +`",
              "item": "`+ baseUrl + plpCategoryLink2 +`"
            },{
              "@type": "ListItem",
              "position": 3,
              "name": "`+ productComCode +`",
              "item":"`+ completeUrl +`"
            }]
          }
        `}</script>
      </Helmet>
        <div>
          <a className={style.catLink} href={"/"}>
            Home
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catLink} href={plpCategoryLink2 }>
            {productCategory2 !== undefined ? productCategory2 : productCategory}
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catBold}>
            {productComCode}
          </a>
        </div>
    </>)
  );
};

export default BreadcrumbPdpCat

// BreadcrumbPdpCat.schema = {
//   title: 'Breadcrumbs PDP',
//   description: 'editor.breadcrumbPdpCat.description',
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
//       description: "URL of the second breadcrumbs step (TO SET IF CATEGORY IS NOT COMPACTS)",
//       type: "string",
//       default: "SecondLevel Href",
//     },
//     thirdLevelName: {
//       title: "Third level name",
//       description: "Name of the third breadcrumbs step (TO SET IF CATEGORY IS NOT COMPACTS)",
//       type: "string",
//       default: "ThirdLevel Name",
//     }
//   }
// }