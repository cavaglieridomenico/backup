import React, { useEffect, useState } from "react";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
//import { fePages, userType } from "./FeReady";
import { fePages } from "./FeReady";

interface notFoundEventProps {
  dataLayer: any;
  pageType:any;
}

const NotFoundEvent: StorefrontFunctionComponent<notFoundEventProps> = ({
  dataLayer,
  pageType
}) => {
  const [notFound, setnotFound] = useState(false);

  const { searchQuery } = useSearchPage();
  const isCategory = () => {
    return searchQuery.variables.query.includes("/") || searchQuery.variables.query.includes("appliances");
  };

  // const apiSearch = (query: string) => {
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json; charset=utf-8"
  //     },
  //   };

  //   return fetch("api/catalog_system/pub/products/search/" + query, options)
  //     .then((response) => response.json())
  //     .catch((err) => console.error(err));
  // };

  // const isPushFeReadyDone = (dataLayer:any) =>{
  //   const feReadyEvent = dataLayer.filter((e:any) => e.event == 'feReady')
  //   const pageView = dataLayer.filter((e:any) => e.event == 'pageView')
  //   if(pageView.length === feReadyEvent.length){
  //     return true
  //   }else{
  //     return false
  //   }
  // }

  const [href, setHref] = useState("");

  const updateState = (hrefUpdated: string) => {
    if (hrefUpdated == "" && notFound == false) {
      setHref(hrefUpdated);
    }
    if (hrefUpdated !== "" && hrefUpdated !== href) {
      setnotFound(!notFound);
    }
  };

  // const getUserSession = () => {
  //   return fetch("/api/sessions?items=*", {
  //     method: "GET",
  //     headers: {},
  //   }).then((response) => response.json());
  // };
  // const getUser = () => {
  //   return fetch(
  //     "/_v/wrapper/api/user/userinfo",
  //     {
  //       method: "GET",
  //     }
  //   ).then((response) => response.json());
  // };
  // const getOrder = () => {
  //   return fetch("/_v/wrapper/api/user/hasorders", {
  //     method: "GET",
  //   }).then((response) => response.json());
  // };

  // const pushDataLayer = (session: any, dataLayer: any) => {
  //   if (notFound == false) {
  //     if (session.namespaces?.profile?.email) {
  //       //const emailUser = session.namespaces.profile.email.value;
  //       Promise.all([getUser(), getOrder()]).then(
  //         (values) => {
  //           const user = values[0];
  //           const orders = values[1];
  //           if(!isPushFeReadyDone(dataLayer)){
  //             dataLayer.push({
  //               event: "feReady",
  //               status: "authenticated",
  //               "product-code": "",
  //               "product-name": "",
  //               "product-category": "",
  //               userType: userType(orders, user[0].isNewsletterOptIn),
  //               "pageTypeEvent":"search"
  //             });
  //           }
  //         }
  //       );
  //     } else {
  //       if(!isPushFeReadyDone(dataLayer)){
  //         dataLayer.push({
  //           event: "feReady",
  //           status: "anonymous",
  //           "product-code": "",
  //           "product-name": "",
  //           "product-category": "",
  //           userType: "guest",
  //           "pageTypeEvent":"search"
  //         });
  //       }
  //     }
  //   }
  //   return;
  // };

  useEffect(() => {
    updateState(window.location.href);
    if (
      (searchQuery !== undefined && !isCategory() && searchQuery.data.facets.brands.length == 0 && !notFound)
      ||(pageType == 'error')
    ) {
      var searchParameters = window.location.search;
      if (searchParameters == "") {
        fePages(
          { product: undefined },
          undefined,
          dataLayer,
          "search"
        );
        dataLayer.push({
          event: "errorPage",
          "errorType": "404",
        });
        setnotFound(!notFound);
      } 
      // Old way of handling wrong search
      // else {
      //   const query = window.location.pathname.replace("/", "");
      //   apiSearch(query).then((response) => {
      //     if (response.length == 0 && document.getElementsByClassName("vtex-flex-layout-0-x-flexColChild--productCountCol").length == 0) {
      //       fePages(
      //         { product: undefined },
      //         undefined,
      //         dataLayer,
      //         "search"
      //       );
      //       dataLayer.push({
      //         event: "errorPage",
      //         errorType: "No Search Result",
      //         errorQuery: query.replace("%20", ""),
      //       });
      //       setnotFound(!notFound);
      //     } else {
      //       getUserSession().then((response) => {
      //         pushDataLayer(response, dataLayer);
      //       });
      //     }
      //   });
      // }


    }
  // }, [searchQuery, window.location]);
  }, [window.location]);
  

  return <></>;
};

NotFoundEvent.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};

export default NotFoundEvent;
