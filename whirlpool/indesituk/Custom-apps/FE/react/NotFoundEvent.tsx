import React, { useEffect, useState } from "react";
// @ts-ignore
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import { fePages, userType } from "./FeReady";
import Search from "./Search";

interface notFoundEventProps {
  dataLayer: any;
  pageType: any;
}

export const getUserSession = () => {
  return fetch("/api/sessions?items=*", {
    method: "GET",
    headers: {},
  }).then((response) => response.json());
};

export const NotFoundEvent: StorefrontFunctionComponent<notFoundEventProps> = ({
  dataLayer,
  pageType,
}: notFoundEventProps) => {
  const NO_MAP = "no-map";
  const NO_QUERY = "no-query";

  const [notFound, setnotFound] = useState(false);

  const { searchQuery } = useSearchPage();

  const [queryArgs, setQueryArgs] = useState("");

  const [content, setContent] = useState(<></>);

  const isCategory = () => {
    return (
      searchQuery.variables.map
        .split(",")
        .filter((el: any) => el.indexOf("category") !== -1 || el === "c")
        .length > 0
    );
  };

  const isCluster = (map: string) => {
    return map.indexOf("productClusterIds") !== -1;
  };

  const getText = (map: string, query: string) => {
    if (map.indexOf("ft") !== -1) {
      //plain text
      return (
        "/" +
        query.split("/")[
          map.split(",").findIndex((e: string) => e.indexOf("ft") !== -1)
        ]
      );
    } else if (map.indexOf("b") !== -1) {
      //brand
      return (
        "/" +
        query.split("/")[
          map.split(",").findIndex((e: string) => e.indexOf("b") !== -1)
        ]
      );
    } else {
      return "";
    }
  };

  const createFilterSearch = (map: string, query: string) => {
    let filter = "?";
    let mapSplitted = map.split(",");
    let querySplitted = query.split("/");
    for (let i = 0; i < mapSplitted.length; i++) {
      if (mapSplitted[i] == "ft") {
        if (i > 0) {
          filter += "&";
        }
        filter += mapSplitted[i] + ":" + querySplitted[i];
      } else if (mapSplitted[i] == "productClusterIds") {
        if (i > 0) {
          filter += "&";
        }
        filter += "fq=" + mapSplitted[i] + ":" + querySplitted[i];
      }
    }
    return filter;
  };

  const apiSearch = (filter: string) => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json; charset=utf-8",
      },
    };

    return fetch("/api/catalog_system/pub/products/search" + filter, options)
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

  const isPushFeReadyDone = (dataLayer: any) => {
    const feReadyEvent = dataLayer.filter((e: any) => e.event == "feReady");
    const pageView = dataLayer.filter((e: any) => e.event == "pageView");
    if (pageView.length === feReadyEvent.length) {
      return true;
    } else {
      return false;
    }
  };

  const [href, setHref] = useState("");

  const updateState = (hrefUpdated: string) => {
    if (hrefUpdated == "" && notFound == false) {
      setHref(hrefUpdated);
    }
    if (hrefUpdated !== "" && hrefUpdated !== href) {
      setnotFound(!notFound);
    }
  };
  const getUser = () => {
    return fetch("/_v/wrapper/api/user/userinfo", {
      method: "GET",
    }).then((response) => response.json());
  };
  const getOrder = () => {
    return fetch("/_v/wrapper/api/user/hasorders", {
      method: "GET",
    }).then((response) => response.json());
  };
  const pushDataLayer = (session: any, dataLayer: any) => {
    if (notFound == false) {
      if (session.namespaces?.profile?.email) {
        //const emailUser = session.namespaces.profile.email.value;
        // Promise.all([getUser(), getOrder()]).then((values) => {
        Promise.all([getUser(), getOrder()]).then(() => {
          // const user = values[0];
          // const orders = values[1];
          if (!isPushFeReadyDone(dataLayer)) {
            dataLayer.push({
              event: "feReady",
              status: "authenticated",
              "product-code": "",
              "product-name": "",
              "product-category": "",
              // userType: userType(orders, user[0].isNewsletterOptIn),
              userType: userType(),
              pageTypeEvent: "search",
            });
          }
        });
      } else {
        if (!isPushFeReadyDone(dataLayer)) {
          dataLayer.push({
            event: "feReady",
            status: "anonymous",
            "product-code": "",
            "product-name": "",
            "product-category": "",
            userType: "guest",
            pageTypeEvent: "search",
          });
        }
      }
    }
    return;
  };

  const isDifferentQuery = (actualquery: any, query: string) => {
    if (query === "" || query !== actualquery) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    updateState(window.location.href);
    if (
      (searchQuery !== undefined &&
        !isCategory() &&
        searchQuery.data.facets.brands.length == 0 &&
        !notFound &&
        isDifferentQuery(searchQuery.variables.query, queryArgs)) ||
      pageType == "error"
    ) {
      var searchParameters = window.location.search;
      if (searchParameters == "") {
        fePages({ product: undefined }, undefined, dataLayer, "search");
        
        //Deprecated analytic event:
        // dataLayer.push({
        //   event: "errorPage",
        //   errorType: "404",
        // });

        //GA4FUNREQ57
        dataLayer.push({
          event: "custom_error",
          type: "error pages",
          description: "404",
        });

        setnotFound(!notFound);
      } else {
        setContent(
          <Search
            map={searchQuery.variables.map}
            query={searchQuery.variables.query}
            selectedFacet={searchQuery.variables.selectedFacet}
            from={searchQuery.variables.from}
            to={searchQuery.variables.to}
            hideUnavailableItems={searchQuery.variables.hideUnavailableItems}
            fullText={searchQuery.variables.fullText}
            simulationBehavior={searchQuery.variables.simulationBehavior}
            operator={searchQuery.variables.operator}
            fuzzy={searchQuery.variables.fuzzy}
            searchState={searchQuery.variables.searchState}
            dataLayer={dataLayer}
            pushDataLayer={pushDataLayer}
            notFound={notFound}
          />
        );
        setnotFound(!notFound);
        const query =
          searchQuery?.variables !== undefined
            ? searchQuery.variables.query
            : NO_QUERY;
        const map =
          searchQuery?.variables !== undefined
            ? searchQuery.variables.map
            : NO_MAP;
        const isSetMapQuery = map !== NO_MAP && query !== NO_QUERY;
        let filter = isCluster(map)
          ? createFilterSearch(map, query)
          : getText(map, query);
        apiSearch(filter).then((response: any) => {
          if (response.length == 0 || !isSetMapQuery) {
            fePages({ product: undefined }, undefined, dataLayer, "search");
            dataLayer.push({
              event: "errorPage",
              errorType: isSetMapQuery ? "No Search Result" : "404",
              errorQuery: isSetMapQuery ? query.replace("%20", " ") : "",
            });
            setnotFound(!notFound);
          } else {
            getUserSession().then((response) => {
              pushDataLayer(response, dataLayer);
            });
          }
        });
      }
      setQueryArgs(searchQuery?.variables?.query);
    }
  }, [searchQuery, window.location]);

  return <>{content}</>;
};

NotFoundEvent.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};
