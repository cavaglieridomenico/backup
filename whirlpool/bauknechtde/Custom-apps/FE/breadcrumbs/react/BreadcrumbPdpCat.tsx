//@ts-nocheck
import React from "react";
import { useProduct } from "vtex.product-context";
import Helmet from "react-helmet";
import style from "./style.css";
import { useEffect } from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

interface BreadcrumbPdpCatProps {
  firstLevelName: string;
  secondLevelName: string;
  secondLevelHref: string;
  thirdLevelName: string;
  stringAfterSecondLevel: string;
}

export const BreadcrumbPdpCat: StorefrontFunctionComponent<BreadcrumbPdpCatProps> = () => {
  const productContext = useProduct();
  console.log(productContext);
  const stringAfterSecondLevel = "parts";
  const jCode = productContext?.product?.productReference;
  const isSparePart = productContext?.product?.properties?.filter((e: any) => e.name == "isSparePart")[0]?.values[0];
  const isKit = productContext?.product?.properties?.filter((e: any) => e.name == "isKit")[0]?.values[0];
  const isOutOfStock = productContext?.product?.items?.[0].sellers?.[0].commertialOffer?.AvailableQuantity === 0; //OOS product has different context
  const prePlp = !isOutOfStock ? productContext?.product?.categories?.[0]?.split(/[//]/)?.[2] : productContext?.product?.categories[1]?.split(/[//]/)[2];

  const plpCategoryLink =
    // isOutOfStock
    //   ?
    productContext?.product?.categories?.[0]
      ?.replace(/ & /g, "-")
      .replace("-& ", "-")
      .slice(0, -1)
      .toLowerCase();
  // : productContext?.product?.categories?.[0]
  //     ?.replace(/ & /g, "-")
  //     .replace("-& ", "-")
  //     .slice(0, -1);
  const productCategory = productContext?.product?.categories?.[0]?.split(/[//]/)[3] || productContext?.product?.categories?.[2]?.split(/[//]/)[3];
  const productComCode = productContext?.product?.properties?.filter((e: any) => e.name == "CommercialCode_field")[0]?.values?.[0];
  const budlePages = window?.document?.getElementsByClassName("bauknechtde-bredcrumbs-0-x-catLink bauknechtde-bredcrumbs-0-x-catLinkDisabled")[1]?.textContent;
  const productNameBundle = window?.document?.getElementsByClassName("bauknechtde-bredcrumbs-0-x-catBold")[0]?.textContent;
  const prePlpLink = productContext?.product?.categories?.[1]
    ?.replace(" & ", "-")
    ?.slice(0, -1)
    .toLowerCase();
  //Additional for the bug on microwaves from compacts category
  const productCategory2 =
    productContext?.product?.categories?.[3] !== undefined ? productContext?.product?.categories?.[3]?.split(/[//]/)[3] : productCategory;
  const plpCategoryLink2 =
    productCategory2 !== productCategory
      ? productContext?.product?.categories?.[3]
          ?.replace(" ", "-")
          .replace("-& ", "-")
          .slice(0, -1)
      : plpCategoryLink;
  //GET CATEGORIES WITHOUT PRE-PLP
  const catNoPrePlp = require("./utils/categoriesWithoutPrePlp.js");
  const categoriesNoPrePlp = catNoPrePlp.default;
  const categoryToCheck = productCategory?.replace(" ", "-");
  //URLS FOR HELMET SCRIPT
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;
  const completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost + __RUNTIME__.route.canonicalPath;
  //CHECK CATEGORY FROM LOCALSTORAGE FOR FIX THE COMPACTS ISSUE
  const [check, setCheck] = useState<any>();
  useEffect(() => {
    setCheck(localStorage.getItem("cat"));
  }, []);

  return categoriesNoPrePlp?.indexOf(categoryToCheck) < 0 && check !== "compacts" ? (
    <>
      <Helmet>
        <script type="application/ld+json">
          {budlePages == "Herd- und Backofensets" &&
            `
                {
                  "@context": "http://schema.org",
                  "@type": "BreadcrumbList",
                  "itemListElement": [{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "` +
              baseUrl +
              `"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "herd- und backofensets",
                  "item": "` +
              baseUrl +
              `/landings/herd-und-backofensets` +
              `"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "` +
              productNameBundle +
              `",
                  "item":"` +
              completeUrl +
              `"
                }]
              }
              `}
        </script>
        <script type="application/ld+json">
          {budlePages != "Herd- und Backofensets" && !isSparePart
            ? `
          {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
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
        `
            : isKit
            ? `
      {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "Ersatzteile",
          "item": "${baseUrl}/ersatzteile"
        },{
          "@type": "ListItem",
          "position": 2,
          "name": "` +
              prePlp +
              `",
          "item": "` +
              baseUrl +
              plpCategoryLink +
              `"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "` +
              jCode +
              `",
          "item":"` +
              completeUrl +
              `"
        }]
      }
    `
            : `
      {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "Ersatzteile",
          "item": "${baseUrl}/ersatzteile"
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
              jCode +
              `",
          "item":"` +
              completeUrl +
              `"
        }]
      }
    `}
        </script>
        {/* <script type="application/ld+json">
          {`
          {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
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
        </script> */}
      </Helmet>
      {isSparePart && !isKit ? (
        <div>
          {productContext?.product?.categoryId !== "55" ? (
            <>
              <a className={style.catLink} href={"/ersatzteile"}>
                Ersatzteile
              </a>
              <img
                className={style.arrowImg}
                src={
                  "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
                }
              />
              <a
                className={`${style.catLink}`}
                /*href={plpCategoryLink?.replace(" & ", "-")}*/
                href={prePlpLink?.replace(" & ", "-").replace(/\s/g, "-")}
              >
                {prePlp}
              </a>
              <img
                className={style.arrowImg}
                src={
                  "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
                }
              />
              <a
                className={`${style.catLink}`}
                /*href={prePlpLink?.replace(" & ", "-")}*/
                href={plpCategoryLink?.replace(" & ", "-").replace(/\s/g, "-")}
              >
                {productCategory}
              </a>
              <img
                className={style.arrowImg}
                src={
                  "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
                }
              />
              <a className={style.catBold}>
                {/*productComCode*/} {jCode}
              </a>
            </>
          ) : (
            <>
              <a className={style.catLink} href={"/ersatzteile"}>
                Ersatzteile
              </a>
              <img
                className={style.arrowImg}
                src={
                  "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
                }
              />

              <a
                className={`${style.catLink}`}
                /*href={prePlpLink?.replace(" & ", "-")}*/
                href={"/ersatzteile/sonstige"}
              >
                Sonstige
              </a>
              <img
                className={style.arrowImg}
                src={
                  "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
                }
              />
              <a className={style.catBold}>
                {/*productComCode*/} {jCode}
              </a>
            </>
          )}
        </div>
      ) : isKit ? (
        <div className={style.breadcrumbsKitWrapper}>
          <a className={style.catLink} href={"/ersatzteile"}>
            Ersatzteile
          </a>
          <img
            className={style.arrowImg}
            src={
              "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
            }
          />
          <a
            className={`${style.catLink}`}
            /*href={plpCategoryLink?.replace(" & ", "-")}*/
            href={prePlpLink?.replace(" & ", "-").replace(/\s/g, "-")}
          >
            {prePlp}
          </a>
          <img
            className={style.arrowImg}
            src={
              "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
            }
          />

          <a className={style.catBold}> {jCode}</a>
        </div>
      ) : !prePlp ? (
        <div className={style.breadcrumbsPLPCustom}>
          <a
            className={`${style.catLink} ${style.catLinkDisabled}`}
            // href={"/"}
          >
            Home
          </a>
          <img
            className={style.arrowImg}
            src={
              "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
            }
          />
          <a
            className={`${style.catLink} ${style.catLinkDisabled}`}
            // href={"/bundles"}
          >
            {productContext.product.categoryTree && productContext.product.categoryTree[1] ? (
              productContext.product.categoryTree[1].name
            ) : (
              <FormattedMessage id="editor.changechannel.bundles-title" defaultMessage="Herd- und Backofensets" />
            )}
          </a>
          <img
            className={style.arrowImg}
            src={
              "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
            }
          />
          <a className={style.catBold}>{productContext.product.productName}</a>
        </div>
      ) : (
        <div>
          <a className={`${style.catLink}`} href={"/"}>
            Home
          </a>
          <img
            className={style.arrowImg}
            src={
              "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
            }
          />
          <a className={`${style.catLink}`} href={prePlpLink?.replace("---", "-")}>
            {prePlp.replace("---", " & ")}
          </a>
          <img
            className={style.arrowImg}
            src={
              "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
            }
          />
          <a className={`${style.catLink} ${!productCategory ? style.catLinkDisabled : ""}`} href={plpCategoryLink?.replace(" & ", "-")}>
            {productCategory || productContext.product.productName}
          </a>
          {productCategory && (
            <>
              <img
                className={style.arrowImg}
                src={
                  "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
                }
              />
              <a className={style.catBold}>{productComCode}</a>
            </>
          )}
        </div>
      )}
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
              "name": "Home",
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
      <div>
        <a
          className={`${style.catLink} ${style.catLinkDisabled}`}
          // href={"/"}
        >
          Home
        </a>
        <img
          className={style.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a
          className={`${style.catLink} ${style.catLinkDisabled}`}
          // href={plpCategoryLink2}
        >
          {productCategory2 !== undefined ? productCategory2 : productCategory}
        </a>
        <img
          className={style.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={style.catBold}>{productComCode}</a>
      </div>
    </>
  );
};

BreadcrumbPdpCat.schema = {
  title: "Breadcrumbs PDP",
  description: "editor.breadcrumbPdpCat.description",
  type: "object",
  properties: {
    stringAfterSecondLevel: {
      title: "string after second level",
      description: "string after second level",
      type: "string",
      default: "Parts",
    },
  },
};

export default BreadcrumbPdpCat;

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
