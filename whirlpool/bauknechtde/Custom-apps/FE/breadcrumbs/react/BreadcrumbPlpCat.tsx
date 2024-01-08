//@ts-nocheck
import React, { useState, useEffect } from "react";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import Helmet from "react-helmet";
import style from "./style.css";
import CatLink from "./components/CatLink";
import CatBold from "./components/CatBold";

interface BreadcrumbPlpCatProps  {
  isSpare: boolean
};

const BreadcrumbPlpCat: StorefrontFunctionComponent<BreadcrumbPlpCatProps> = (
  {isSpare}
) => {
  const protocol = 'https';
  const homePath = window?.location?.hostname;
  const pathName = window?.location?.pathname;
  const splittedPathname = pathName?.toLocaleLowerCase().split("/").filter(Boolean);
  
  const breadcrumbListScript = splittedPathname?.map(
    (breadcrumb: any, idx: number) =>
      !isSpare ?  
      `{
      "@type": "ListItem",
      "position": ${idx + 2},
      "name": "${breadcrumb}",
      "item": "${protocol}://${homePath}/${splittedPathname
        ?.slice(0, idx + 1)
        ?.join("/")}"     
    }`
    : 
    `{
      "@type": "ListItem",
      "position": ${idx + 1},
      "name": "${breadcrumb}",
      "item": "${protocol}://${homePath}/${splittedPathname
        ?.slice(0, idx + 1)
        ?.join("/")}"     
    }`
  );

  const mappedSplittedPathName = splittedPathname?.map(
    (path: any, idx: number) => {
      
      return (
        <>
          {splittedPathname.length == 1 && <CatBold labelLink={path} />}
          {splittedPathname.length >= 1 &&
            idx !== splittedPathname?.length - 1 && (
              <CatLink
                labelLink={path.replace(/-/g, " ")}
                hrefLink={`/${splittedPathname.slice(0, idx + 1)?.join("/").replace(/\s/g , "-")}`}
              />
            )}
          {idx > 0 && idx == splittedPathname?.length - 1 && (
            <CatBold labelLink={path.replace(/-/g, " ")} />
          )}
        </>
        
      );
    }
  );

  const homeElement: JSX.Element = (
    <script type="application/ld+json">
      {!isSpare ? `
        {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "${protocol}://${homePath}"
          },${breadcrumbListScript}]
        }
      `
      : 
      `
        {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [${breadcrumbListScript}]
        }
      `
      }
    </script>
  );

  return (
    <>
      <Helmet>
        {/* Avoid undefined items on server-side render */}
        { breadcrumbListScript && homeElement }
      </Helmet>
      <div className={style.breadcrumbsPLPCustom}>
        {
          !isSpare && <CatLink labelLink="Home" hrefLink="/" />
        }
        {mappedSplittedPathName} 
      </div>
    </>
  );
};

export default BreadcrumbPlpCat;
