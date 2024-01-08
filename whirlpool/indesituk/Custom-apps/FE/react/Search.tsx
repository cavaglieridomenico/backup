import React from "react";
import { useQuery } from "react-apollo";
import search from "./graphql/searchQuery.graphql";
import { fePages, userType } from "./FeReady"; //
import { getUserSession } from "./NotFoundEvent";

interface SelectedFacet {
  key: string;
  value: string;
}

interface Props {
  map: string;
  query: string;
  selectedFacet: [SelectedFacet];
  from: number;
  to: number;
  hideUnavailableItems: boolean;
  fullText: string;
  simulationBehavior: string;
  operator: string;
  fuzzy: string;
  searchState: string;
  dataLayer: any;
  pushDataLayer: any;
  notFound: any;
}

export default function Search({
  map = "",
  query = "",
  selectedFacet,
  from = 0,
  to = 9,
  hideUnavailableItems = false,
  fullText = "",
  simulationBehavior = "default",
  operator,
  fuzzy,
  searchState,
  dataLayer,
  notFound,
}: Props) {
  const isPushFeReadyDone = (dataLayer: any) => {
    const feReadyEvent = dataLayer.filter((e: any) => e.event == "feReady");
    const pageView = dataLayer.filter((e: any) => e.event == "pageView");
    if (pageView.length === feReadyEvent.length) {
      return true;
    } else {
      return false;
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

  const pushDataLayer = (session: any, dataLayer: any, notFound: any) => {
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
  const handleData = (query: any, data: any, dataLayer: any, notFound: any) => {
    getUserSession().then((res: any) => {
      console.log(query, data);
      pushDataLayer(res, dataLayer, notFound);
    });
  };
  const handleError = () => {
    fePages({ product: undefined }, undefined, dataLayer, "search");
    dataLayer.push({
      event: "errorPage",
      errorType: "No Search Result",
      errorQuery: query.replace("/", " ").replace("-", " "),
    });
  };
  const searchQuery = (
    map: string,
    query: String,
    selectedFacet: [SelectedFacet],
    from: number,
    to: number,
    hideUnavailableItems: boolean,
    fullText: string,
    simulationBehavior: string,
    operator: string,
    fuzzy: string,
    searchState: string,
    dataLayer: any,
    notFound: any
  ) => {
    const { loading, error, data } = useQuery(search, {
      variables: {
        map: map,
        query: query,
        selectedFacet: selectedFacet,
        from: from,
        to: to,
        hideUnavailableItems: hideUnavailableItems,
        fullText: fullText,
        simulationBehavior: simulationBehavior,
        operator: operator,
        fuzzy: fuzzy,
        searchState: searchState,
      },
    });

    if (loading) return <></>;
    if (error) return <>{handleError()}</>;

    return <>{handleData(query, data, dataLayer, notFound)}</>;
  };
  return (
    <>
      {searchQuery(
        map,
        query,
        selectedFacet,
        from,
        to,
        hideUnavailableItems,
        fullText,
        simulationBehavior,
        operator,
        fuzzy,
        searchState,
        dataLayer,
        notFound
      )}
    </>
  );
}

Search.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};
