//@ts-nocheck
import React from 'react'
import data from './utils/spareRoutes.json'
import { useProduct } from "vtex.product-context";
import style from "./style.css"
import { useRuntime } from "vtex.render-runtime";

import Helmet from "react-helmet";

const BreadcrumbSparePdp = () => {
  const productContext = useProduct();
  const runtime = useRuntime();
  let realCategories: any = [];

  const isSpare = productContext?.product?.properties?.filter(prop => prop.name === "isSparePart")[0]?.values[0] == "true"
  const cCode = runtime.route.canonicalPath.split("/")[1].split("-")[runtime.route.canonicalPath.split("/")[1].split("-").length - 1]
  let lengthCategory = 0;

  productContext.product.categories.map((category: any) => {
    if (category.length > lengthCategory) {
      realCategories = category.split("/")
    }
    lengthCategory = category.split("/")
  })

  realCategories = realCategories.filter(category => category.length > 0);

  let path = realCategories.join("/")
  path = "/" + path.toLowerCase().replace(/ /g, "-");

  let pathObject = data.filter(item => item.resolveAs == path)[0]
  let firstLevelCategory = pathObject?.from.split("/")[2]
  //@ts-ignore
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;



  const createPath = (position) => {

    let breadPath = "/";

    //@ts-ignore
    realCategories?.map((cat: any, index: any) => {
      if (index == 1 && position > 0 && isSpare) {
        breadPath += firstLevelCategory !== undefined ? firstLevelCategory + "/" : ""
      }
      if (index <= position) {

        breadPath += realCategories[index].toLowerCase().replace(/ /g, "-");
      }
      if (index < position) {
        breadPath += "/"
      }
    })

    return breadPath;

  }
  return (

    <div>
      <Helmet>
        {isSpare && realCategories.length > 2 && (
          <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${realCategories[0].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(0)}"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${realCategories[1].replace(/-/g, " ")} Parts",
                  "item": "${baseUrl}${createPath(1)}"
                },{
                  "@type": "ListItem",
                  "position": 3,
                  "name": "${realCategories[2].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(2)}"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "${isSpare ? productContext.product.productReference : cCode}",
                  "item": "${baseUrl}/${productContext.product.linkText}/p"
                }
                ]
              }
            `}</script>
        )}
        {isSpare && realCategories.length == 2 && (
          <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${realCategories[0].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(0)}"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${realCategories[1].replace(/-/g, " ")} Parts",
                  "item": "${baseUrl}${createPath(1)}"
                }
                ]
              }
            `}</script>
        )}

        {!isSpare && realCategories.length > 2 && (
          <script type="application/ld+json">{`
            {
              "@context": "http://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "${realCategories[0].replace(/-/g, " ")}",
                "item": "${baseUrl}${createPath(0)}"
              },{
                "@type": "ListItem",
                "position": 2,
                "name": "${realCategories[1].replace(/-/g, " ")}",
                "item": "${baseUrl}${createPath(1)}"
              },{
                "@type": "ListItem",
                "position": 3,
                "name": "${realCategories[2].replace(/-/g, " ")}",
                "item": "${baseUrl}${createPath(2)}"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "${isSpare ? productContext.product.productReference : cCode}",
                "item": "${baseUrl}/${productContext.product.linkText}/p"
              }
              ]
            }
          `}</script>
        )}
        {!isSpare && realCategories.length == 2 && (
          <script type="application/ld+json">{`
            {
              "@context": "http://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "${realCategories[0].replace(/-/g, " ")}",
                "item": "${baseUrl}${createPath(0)}"
              },{
                "@type": "ListItem",
                "position": 2,
                "name": "${realCategories[1].replace(/-/g, " ")}",
                "item": "${baseUrl}${createPath(1)}"
              }
              ]
            }
          `}</script>
        )}

      </Helmet>
      <div className={style.sparePartsPdpBreadCrumbContainer}>

        {realCategories.map((linkBreadcrumb: string, index: any) => {
          return (
            <div className={style.sparePartsPdpBreadCrumbLink}>
              <a className={style.catLink} href={createPath(index)}>{`${index === 1 && isSpare ? linkBreadcrumb + " Parts " : linkBreadcrumb}`}</a>
              <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} />
            </div>
          )
        })

        }
        <div className={style.catBold}>{isSpare ? productContext.product.productReference : cCode}</div>
      </div>

    </div>
  )
}

export default BreadcrumbSparePdp
