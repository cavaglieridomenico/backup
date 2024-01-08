import React from "react";
import { useProduct } from "vtex.product-context";
import Helmet from "react-helmet";
import { useCssHandles } from "vtex.css-handles";
import { useEffect } from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

type BreadcrumbPdpCatProps = {
  firstLevelName: string;
  secondLevelName: string;
  secondLevelHref: string;
  thirdLevelName: string;
};

const CSS_HANDLES = ["breadCustom", "catLink", "arrowImg", "catBold"];

export const BreadcrumbPdpCat: StorefrontFunctionComponent<BreadcrumbPdpCatProps> = () => {
  const handles = useCssHandles(CSS_HANDLES);
  const productContext = useProduct();
  const isSellable = productContext?.product?.properties.find(
    (el: any) => el.name === "sellable"
  ).values[0];
  const prePlp =
    isSellable === "true"
      ? productContext?.product?.categories[0].split(/[//]/)[2]
      : productContext?.product?.categories[2].split(/[//]/)[2];
  const prePlpLink = productContext?.product?.categories[1]
    .replace(" ", "-")
    .slice(0, -1);
  const plpCategoryLink =
    isSellable === "true"
      ? productContext?.product?.categories[0].replace(" ", "-").slice(0, -1)
      : productContext?.product?.categories[2].replace(" ", "-").slice(0, -1);
  const productCategory =
    productContext?.product?.categories[0].split(/[//]/)[3] ||
    productContext?.product?.categories?.[2].split(/[//]/)[3];
  const productComCode = productContext?.product?.properties?.filter(
    (e: any) => e.name == "CommercialCode_field"
  )[0]?.values[0];

  //Additional for the bug on microwaves from compacts category
  const productCategory2 =
    productContext?.product?.categories[3] !== undefined
      ? productContext?.product?.categories[3]?.split(/[//]/)[3]
      : productCategory;
  const plpCategoryLink2 =
    productCategory2 !== productCategory
      ? productContext?.product?.categories[3].replace(" ", "-").slice(0, -1)
      : plpCategoryLink;
  //GET CATEGORIES WITHOUT PRE-PLP
  const catNoPrePlp = require("./utils/categoriesWithoutPrePlp.js");
  const categoriesNoPrePlp = catNoPrePlp.default;
  const categoryToCheck = productCategory?.replace(" ", "-");
  //URLS FOR HELMET SCRIPT
  const baseUrl = window?.location?.protocol + "//" + window.location?.hostname;
  const completeUrl = window.location?.href;
  //CHECK CATEGORY FROM LOCALSTORAGE FOR FIX THE COMPACTS ISSUE
  const [check, setCheck] = useState<any>();
  useEffect(() => {
    setCheck(localStorage.getItem("cat"));
  }, []);

  return categoriesNoPrePlp?.indexOf(categoryToCheck) < 0 &&
    check !== "compacts" ? (
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
              "name": "Strona główna",
              "item": "` +
            baseUrl +
            `"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "` +
            prePlp +
            `",
              "item": "` +
            baseUrl +
            prePlpLink +
            `"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "` +
            productCategory +
            `",
              "item": "` +
            baseUrl +
            plpCategoryLink +
            `"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "` +
            productComCode +
            `",
              "item":"` +
            completeUrl +
            `"
            }]
          }
        `}
        </script>
      </Helmet>
      <div className={handles.breadCustom}>
        <a className={handles.catLink} href={"/"}>
          <FormattedMessage id="store/breadcrumbs.home-label"></FormattedMessage>
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catLink} href={prePlpLink}>
          {prePlp}
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catLink} href={plpCategoryLink}>
          {productCategory}
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catBold}>{productComCode}</a>
      </div>
    </>
  ) : (
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
              "name": "Strona główna",
              "item": "` +
            baseUrl +
            `"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "` +
            productCategory2 +
            `",
              "item": "` +
            baseUrl +
            plpCategoryLink2 +
            `"
            },{
              "@type": "ListItem",
              "position": 3,
              "name": "` +
            productComCode +
            `",
              "item":"` +
            completeUrl +
            `"
            }]
          }
        `}
        </script>
      </Helmet>
      <div className={handles.breadCustom}>
        <a className={handles.catLink} href={"/"}>
          Home
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catLink} href={plpCategoryLink2}>
          {productCategory2 !== undefined ? productCategory2 : productCategory}
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catBold}>{productComCode}</a>
      </div>
    </>
  );
};

export default BreadcrumbPdpCat;
