import React from "react";
import { Helmet } from "react-helmet";
import { useProduct } from "vtex.product-context";
import { canUseDOM } from 'vtex.render-runtime'

const AggregateBreadcrumbList = () => {
  const baseUrl = "https://www.indesit.co.uk/";
  const productInfo = useProduct();

  let rendered = true

  if(productInfo.product !== undefined && rendered) {
    let productSubcategory = productInfo.product.categories[0].split('/')[2];
    let productCategory = productInfo.product.categories[0].split('/')[3]
    let productName = productInfo.product.items[0].complementName
    let productLink = productInfo.product.linkText

    rendered = false

    const fullScript = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement":[
        {
          "@type":"ListItem",
          "position":1,
          "name":"products",
          "item":baseUrl + "products"
        },
        {
          "@type":"ListItem",
          "position":2,
          "name":productSubcategory,
          "item":baseUrl + "products/" + productSubcategory
        },
        {
          "@type":"ListItem",
          "position":3,
          "name":productCategory,
          "item":baseUrl + "products/" + productSubcategory + "/" + productCategory
        },
        {
          "@type":"ListItem",
          "position":4,
          "name":productName,
          "item":baseUrl + productLink + "/p"
        }
      ]
    }

    return <>
      <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(fullScript)}
          </script>
      </Helmet>
    </>;
  }

  if (canUseDOM) {
    const BreadcrumbScript = document.querySelectorAll(
      'script[type="application/ld+json"]'
    )
    for (let i = 0; i < BreadcrumbScript.length; i++) {
      if (BreadcrumbScript[i] !== null && BreadcrumbScript[i] !== undefined) {
        if (
          BreadcrumbScript[i].innerHTML !== null &&
          BreadcrumbScript[i].innerHTML !== undefined
        ) {
          if (
            BreadcrumbScript[i].nextSibling.className === 'vtex-breadcrumb-1-x-container pv3'
          ) {
            (BreadcrumbScript[i].nextSibling)
            BreadcrumbScript[i].remove()
          }
        }
      }
    }
  }
  
  return <></>;
}

export default AggregateBreadcrumbList;
