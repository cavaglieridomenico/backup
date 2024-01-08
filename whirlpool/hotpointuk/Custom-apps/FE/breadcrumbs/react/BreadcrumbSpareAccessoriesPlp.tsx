
import React from 'react'
import style from "./style.css"
import { useRuntime } from "vtex.render-runtime";
import Helmet from "react-helmet";

const BreadcrumbSpareAccessoriesPlp = () => {
  const runtime = useRuntime()
  const path = runtime.route.canonicalPath;
  const typePage = path.includes("accessories") ? "accessories" : "spares";

  let links = path.split("/");
  links.shift();
  //@ts-ignore
  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;


  const createPath = (position: any) => {

    let breadPath = "/";

    //@ts-ignore
    links?.map((link: any, index: any) => {
      if (index <= position) {
        breadPath += links[index];
      }
      if (index < position) {
        breadPath += "/"
      }
    })

    return breadPath;
  }

  if (typePage == "accessories") {
    return (
      <>
        <Helmet>
          {links.length === 3 && (
            <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${links[0].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(0)}"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${links[1].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(1)}"
                },{
                  "@type": "ListItem",
                  "position": 3,
                  "name": "${links[2].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(2)}"
                }
                ]
              }
            `}</script>
          )}
          {links.length === 2 && (
            <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${links[0].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(0)}"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${links[1].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(1)}"
                }
                ]
              }
            `}</script>
          )}
           {links.length === 1 && (
            <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${links[0].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(0)}"
                }
                ]
              }
            `}</script>
          )}
        </Helmet>
        <div className={style.sparePartsPdpBreadCrumbContainer}>
          {links?.map((link: any, index: any) =>
            links.length > index + 1 ?
              <div className={style.sparePartsPdpBreadCrumbLink}>
                <a className={style.catLink} href={createPath(index)}> {link.replace(/-/g, " ")}</a>
                <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} />
              </div>
              :
              <div className={style.sparePartsPdpBreadCrumbLink}>
                <div className={style.catBold}> {link.replace(/-/g, " ")}</div>
              </div>
          )}
        </div>
      </>
    )
  } else {
    return (
      <>
           <Helmet>
          {links.length === 4 && (
            <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${links[0].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(0)}"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${links[1].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(1)}"
                },{
                  "@type": "ListItem",
                  "position": 3,
                  "name": "${links[2].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(2)}"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "${links[3].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(3)}"
                }
                ]
              }
            `}</script>
          )}
          {links.length === 3 && (
            <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${links[0].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(0)}"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${links[1].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(1)}"
                },{
                  "@type": "ListItem",
                  "position": 3,
                  "name": "${links[2].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(2)}"
                }
                ]
              }
            `}</script>
          )}
           {links.length === 2 && (
            <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "${links[0].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(0)}"
                },{
                  "@type": "ListItem",
                  "position": 2,
                  "name": "${links[1].replace(/-/g, " ")}",
                  "item": "${baseUrl}${createPath(1)}"
                }
                ]
              }
            `}</script>
          )}
        </Helmet>
        <div className={style.sparePartsPdpBreadCrumbContainer}>

          {links?.map((link: any, index: any) =>
            links.length > index + 1 ?
              <div className={style.sparePartsPdpBreadCrumbLink}>
                <a className={style.catLink} href={createPath(index)}> {index === 2 ? link.replace(/-/g, " ") + " Parts" : link.replace(/-/g, " ")}</a>
                <img className={style.arrowImg} src={"https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"} />
              </div>
              :
              <div className={style.sparePartsPdpBreadCrumbLink}>
                <div className={style.catBold}> {index === 2 ? link.replace(/-/g, " ") + " Parts" : index === links.length - 1 ? link.replace(/-/g, " ") : link.replace(/-/g, " ")}</div>
              </div>
          )}
        </div>
      </>
    )
  }
}

export default BreadcrumbSpareAccessoriesPlp
