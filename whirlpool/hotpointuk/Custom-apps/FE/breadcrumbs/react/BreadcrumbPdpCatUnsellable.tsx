/* eslint-disable prettier/prettier */
//@ts-nocheck
import React from "react";
import { Helmet } from "vtex.render-runtime";
import style from "./style.css"
import { useProduct } from "vtex.product-context"
import { useRuntime } from "vtex.render-runtime/react/components/RenderContext";
import { useQuery } from "react-apollo";
import discontinuedProducts from "./graphql/discontinued-products.graphql"

function BreadcrumbPdpCatUnsellable(){

  const { route } = useRuntime();
  const { slug } = route.queryString

  const { data, loading } = useQuery(discontinuedProducts,{
    variables: {
      slug : slug,
    },
  })

  const baseUrl = "https://" + __RUNTIME__.assetServerLinkedHost;
  const prePlp = data?.product?.categoryTree[1]?.slug;
  const prePlpLink = '/' + data?.product?.categoryTree[2]?.slug;
  const productCategory = data?.product?.categoryTree[2]?.slug;
  const plpCategoryLink = data?.product?.categoryTree[2]?.href;
  const productComCode = data?.product?.properties?.filter((e: any) => e.name == "CommercialCode_field")[0]?.values[0];
  const completeUrl = "https://" + __RUNTIME__.assetServerLinkedHost + __RUNTIME__.route.canonicalPath;

  return (
    (<>
    {!loading && <Helmet>
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
      </Helmet>}
      </>)
  )
}

export default BreadcrumbPdpCatUnsellable;
