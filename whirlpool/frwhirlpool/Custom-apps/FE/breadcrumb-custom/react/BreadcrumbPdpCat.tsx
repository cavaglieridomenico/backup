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
  subPlpName: string,
  subPlpHref: string
}

export const BreadcrumbPdpCat = ({subPlpName , subPlpHref}) => {
console.log("🚀 ~ file: BreadcrumbPdpCat.tsx ~ line 18 ~ subPlpHref", subPlpHref)
console.log("🚀 ~ file: BreadcrumbPdpCat.tsx ~ line 18 ~ subPlpName", subPlpName)

  const productContext = useProduct();
  let productCategory;
  let plpCategoryLink;
  let plpCategoryLink2; 

  const prePlp = productContext?.product?.categories[0].split(/[//]/)[2]
  const plpCategorySecondLevel = productContext?.product?.categories[1].replace(/\s/g, "-").slice(0,-1);
  if(productContext.product.cacheId.includes("encastrable")){
    productCategory = "Encastrable"
    plpCategoryLink = productContext?.product?.categories[0].replace(/\s/g, "-").slice(0,-1).replace(/\/lave-vaisselle\/lave-vaisselle/g, "/lave-vaisselle/encastrable/")
  } else if(productContext.product.cacheId.includes("poselibre")){
    productCategory = "Pose-libre"
    plpCategoryLink = productContext?.product?.categories[0].replace(/\s/g, "-").slice(0,-1).replace(/\/lave-vaisselle\/lave-vaisselle/g, "/lave-vaisselle/pose-libre/")
  } else if(prePlp.includes("climatiseurs")) {
    productCategory = "Climatiseurs"
    plpCategoryLink = productContext?.product?.categories[1].replace(/\s/g, "-").slice(0,-1);
  } else {
    productCategory = productContext?.product?.categories[0].split(/[//]/)[3] || productContext?.product?.categories[2].split(/[//]/)[3];
    plpCategoryLink = productContext?.product?.categories[0].replace(/\s/g, "-").slice(0,-1);
  }
  plpCategoryLink = plpCategoryLink?.normalize("NFD")?.replace(/\p{Diacritic}/gu, "")

  const productComCode = productContext?.product?.properties?.filter((e: any) => e.name == "CommercialCode_field")[0]?.values[0]
  const prePlpLink = ("/" + productCategory.replace(/\s/g, "-"))?.normalize("NFD")?.replace(/\p{Diacritic}/gu, "")
  //Additional for the bug on microwaves from compacts category
  const productCategory2 = productContext?.product?.categories[3] !== undefined ? productContext?.product?.categories[3]?.split(/[//]/)[3] : productCategory
  plpCategoryLink2 = productCategory2 !== productCategory ? productContext?.product?.categories[1].replace(/\s/g, "-").slice(0,-1) : plpCategoryLink;
  //GET CATEGORIES WITHOUT PRE-PLP
  const catNoPrePlp = require('./utils/categoriesWithoutPrePlp.js')
  const categoriesNoPrePlp = catNoPrePlp.default
  const categoryToCheck = productCategory.replace(" ","-")
  //URLS FOR HELMET SCRIPT
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;
  const completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost + __RUNTIME__.route.canonicalPath;
  const category = productContext?.product?.categories[1];
  const accessoire=plpCategoryLink.includes("accessoires")?"accessoire ":"";//2
  const accessoires=plpCategoryLink.includes("accessoires")?"accessoires ":"";;//3
  
  //accessoire cuisson > accessoires micro-ondes
  
  //CHECK CATEGORY FROM LOCALSTORAGE FOR FIX THE COMPACTS ISSUE
  const [check,setCheck] = useState<any>()
  useEffect(()=>{
    setCheck(localStorage.getItem("cat"))
  },[])

  let isSubPlp : boolean = subPlpName && subPlpName !== "" && subPlpHref && subPlpHref !== ""

  return (
    categoriesNoPrePlp?.indexOf(categoryToCheck) < 0 && check !== "compacts" && productCategory !== "Climatiseurs" && prePlp !==productCategory ?
    (<>
      <Helmet>
        
        {(!isSubPlp) && <script type="application/ld+json">{`
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
              "name": "`+accessoire+ prePlp +`",
              "item": "`+ baseUrl + prePlpLink +`"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "`+accessoires+ productCategory +`",
              "item": "`+ baseUrl + plpCategoryLink +`"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "`+ productComCode +`",
              "item":"`+ completeUrl +`"
            }]
          }
        `}</script>}
        { (isSubPlp) && <script type="application/ld+json">{`
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
              "name": "`+accessoire+ prePlp +`",
              "item": "`+ baseUrl + prePlpLink +`"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "`+accessoires+ productCategory +`",
              "item": "`+ baseUrl + plpCategoryLink +`"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "`+ subPlpName +`",
              "item":"`+ subPlpHref +`"
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": "`+ productComCode +`",
              "item":"`+ completeUrl +`"
            }]
          }
        `}</script>}
      </Helmet>
        <div>
          <a className={style.catLink} href={"/"}>
          Accueil
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catLink} href={plpCategorySecondLevel}>
            {accessoire+prePlp}
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catLink} href={plpCategoryLink}>
            {accessoires+productCategory}
          </a>
          {(isSubPlp) && <><img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} /><a className={style.catLink} href={subPlpHref}>
            {subPlpName}
          </a></>}
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catBold}>
            {productComCode}
          </a>
        </div>
    </>)
    :
    (<>
      <Helmet>
        {(!isSubPlp) &&<script type="application/ld+json">{`
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
              "name": "`+accessoires+ productCategory2 +`",
              "item": "`+ baseUrl + plpCategoryLink2 +`"
            },{
              "@type": "ListItem",
              "position": 3,
              "name": "`+ productComCode +`",
              "item":"`+ completeUrl +`"
            }]
          }
        `}</script>}
        {(isSubPlp) &&<script type="application/ld+json">{`
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
              "name": "`+accessoires+ productCategory2 +`",
              "item": "`+ baseUrl + plpCategoryLink2 +`"
            },{
              "@type": "ListItem",
              "position": 3,
              "name": "`+ subPlpName +`",
              "item":"`+ subPlpHref +`"
            },{
              "@type": "ListItem",
              "position": 4,
              "name": "`+ productComCode +`",
              "item":"`+ completeUrl +`"
            }]
          }
        `}</script>}
      </Helmet>
        <div>
          <a className={style.catLink} href={"/"}>
          Accueil
          </a>
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catLink} href={plpCategoryLink2 }>
            {productCategory2 !== undefined ? accessoires+productCategory2 : accessoires+productCategory}
          </a>
          {(isSubPlp) && <><img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} /><a className={style.catLink} href={subPlpHref}>
            {subPlpName}
          </a></>}
          <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"}/>
          <a className={style.catBold}>
            {productComCode}
          </a>
        </div>
    </>)
  );
};

export default BreadcrumbPdpCat

 BreadcrumbPdpCat.schema = {
   title: 'Breadcrumbs PDP add Sub PLP',
   description: 'A component that adds the capability of adding another level of breadcrumbs before the last one',
   type: 'object',
   properties: {
     subPlpName: {
       title: "Sub plp name",
       description: "Name of the sub plp breadcrumbs step",
       type: "string",
       default: "",
     },
     subPlpHref: {
       title: "Sub plp href",
       description: "URL of the Sub plp breadcrumbs step",
       type: "string",
      default: "",
     }
   }
 }
