import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import { checkCustomPlp, mapCategoryCustomPlps } from "../utils/CustomPlps";

export const userType = (orders: any, isNewsletterOptin: Boolean) => {
  //   - guest
  // - lead (logged in user that did not give the opt in)
  // - prospect (logged in user that gave the consent to be contacted / OPTIN)
  // - customer (logged in user that purchased at least 1 item in the past)>
  let userTypeValue = isNewsletterOptin ? "prospect" : "lead";
  orders.toString() == "true" ? (userTypeValue = "customer") : null;
  return userTypeValue;
};
const isNewFeReadyPlp = (dataLayer: any, searchContext: any) => {
  var result = getLastFeReady(dataLayer);
  if (!result) {
    return true;
  }
  if (searchContext.products.length == 0) {
    return result["product-category"] !== "";
  } else {
    return result["product-category"] !==
      searchContext.products[0].categoryId || result["product-name"] !== ""
      ? true
      : false;
  }
};
const getLastFeReady = (dataLayer: any) => {
  var results = dataLayer.filter((data: any) => data.event == "feReady");
  if (results.length == 0) {
    return false;
  } else {
    return results[results.length - 1];
  }
};

const isNewFeReadyPDP = (lastData: any, product: any) => {
  if (product == undefined) {
    return false;
  }
  return lastData["product-code"] !== product.productId;
};

const isMoreThenOneCategory = (products: any, firstCategoryId: string) => {
  var resultFilter = products.filter(
    (product: any) => product.categoryId == firstCategoryId
  );
  return resultFilter.length !== products.length;
};
const getCategoryStringFromId = (id: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  return fetch("/_v/wrapper/api/catalog/category/" + id, options).then(
    (response) => {
      return response.json();
    }
  );
};

// const isAlreadySetACategory = (dL:any,category:string) =>{
//    const result = dL.filter((e:any) => e.event === 'feReady' && e["product-category"] !== '')
//    return result.length == 0? false : result[0]["product-category"] === category
// }
const checkisDone = (dataLayer: any) => {
  var i = 0;
  var j = 0;
  dataLayer.filter((e: any) => {
    if (e.event == "pageView") {
      j = i;
    }
    i = i + 1;
  });
  return (
    dataLayer
      .slice(j, dataLayer.length)
      .filter((e: any) => e.event == "feReady").length > 0
  );
};
const isSameObject = (dataLayer: any, obj: any) => {
  let feReadys = dataLayer.filter((e: any) => e.event == "feReady");
  if (feReadys.length == 0) {
    return false;
  } else {
    let last = feReadys[feReadys.length - 1];
    let key = "gtm.uniqueEventId";
    last[key] = 0;
    obj[key] = 0;
    let result = JSON.stringify(last) === JSON.stringify(obj);
    delete obj[key];
    return result;
  }
};

const push = (
  dataLayer: any,
  event: string,
  status: string,
  pCode: string,
  pName: string,
  pCategory: string,
  userType: string,
  pageType: string
) => {
  if (pCategory !== "" && !checkCustomPlp()) {
    getCategoryStringFromId(pCategory).then((response) => {
      const obj = {
        event: event,
        status: status,
        "product-code": pCode,
        "product-name": pName,
        "product-category": response.AdWordsRemarketingCode,
        userType: userType,
        pageType: pageType,
      };
      if (!checkisDone(dataLayer) && !isSameObject(dataLayer, obj)) {
        dataLayer.push(obj);
      }
    });
  } else {
    if (!checkisDone(dataLayer)) {
      dataLayer.push({
        event: event,
        status: status,
        "product-code": pCode,
        "product-name": pName,
        "product-category": pCategory,
        userType: userType,
        pageType: pageType,
      });
    }
  }
};

const feRPlp = (searchContext: any, dataLayer: any, pageType: any) => {
  var done = false;
  //map category for custom plps

  //Check for the category
  const isCategory = () => {
    return searchContext.variables.query.includes("/");
  };

  if (
    (!!searchContext &&
      isCategory() &&
      searchContext.products !== undefined &&
      isNewFeReadyPlp(dataLayer, searchContext)) ||
    checkCustomPlp()
  ) {
    fetch("/api/sessions?items=*", {
      method: "GET",
      headers: {},
    })
      .then((response) => response.json())
      .then((json) => {
        if (
          json.namespaces !== undefined &&
          json.namespaces.profile !== undefined &&
          !(json.namespaces.profile.isAuthenticated.value == "false")
        ) {
          fetch("/_v/wrapper/api/user/userinfo", {
            method: "GET",
          })
            .then((response) => response.json())
            .then((user) => {
              fetch("/_v/wrapper/api/user/hasorders", {
                method: "GET",
              })
                .then((response) => response.json())
                .then((orders) => {
                  push(
                    dataLayer,
                    "feReady",
                    Object.keys(json.namespaces.profile).length > 0
                      ? "authenticated"
                      : "anonymous",
                    "",
                    "",
                    searchContext.products
                      ? searchContext.products.length > 1
                        ? isMoreThenOneCategory(
                            searchContext.products,
                            searchContext.products[0].categoryId
                          )
                          ? ""
                          : searchContext.products[0].categoryId
                        : ""
                      : mapCategoryCustomPlps(),
                    userType(orders, user[0].isNewsletterOptIn),
                    checkCustomPlp() ? "category" : pageType
                  );
                  done = true;
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          push(
            dataLayer,
            "feReady",
            "anonymous",
            "",
            "",
            searchContext.products
              ? searchContext.products.length > 1
                ? isMoreThenOneCategory(
                    searchContext.products,
                    searchContext.products[0].categoryId
                  )
                  ? ""
                  : searchContext.products[0].categoryId
                : ""
              : mapCategoryCustomPlps(),
            "guest",
            checkCustomPlp() ? "category" : pageType
          );
          done = true;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return done;
};
const fePdp = (productContext: any, dataLayer: any, pageType: any) => {
  if (productContext !== undefined && productContext.product !== undefined) {
    fetch("/api/sessions?items=*", {
      method: "GET",
      headers: {},
    })
      .then((response) => response.json())
      .then((json) => {
        if (
          json.namespaces !== undefined &&
          json.namespaces.profile !== undefined &&
          !(json.namespaces.profile.isAuthenticated.value == "false")
        ) {
          fetch("/_v/wrapper/api/user/userinfo", {
            method: "GET",
          })
            .then((response) => response.json())
            .then((user) => {
              fetch("/_v/wrapper/api/user/hasorders", {
                method: "GET",
              })
                .then((response) => response.json())
                .then((orders) => {
                  push(
                    dataLayer,
                    "feReady",
                    Object.keys(json.namespaces.profile).length > 0
                      ? "authenticated"
                      : "anonymous",
                    productContext
                      ? productContext?.product?.productReference.split("-")[0]
                      : "",
                    productContext ? productContext?.product?.productName : "",
                    productContext ? productContext?.product?.categoryId : "",
                    userType(orders, user[0].isNewsletterOptIn),
                    pageType
                  );
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          push(
            dataLayer,
            "feReady",
            "anonymous",
            productContext
              ? productContext?.product?.productReference.split("-")[0]
              : "",
            productContext ? productContext?.product?.productName : "",
            productContext ? productContext?.product?.categoryId : "",
            "guest",
            pageType
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
export const fePages = (
  productContext: any,
  searchContext: any,
  dataLayer: any,
  pageType: any
) => {
  if (searchContext === undefined && productContext.product === undefined) {
    fetch("/api/sessions?items=*", {
      method: "GET",
      headers: {},
    })
      .then((response) => response.json())
      .then((json) => {
        if (
          json.namespaces !== undefined &&
          json.namespaces.profile !== undefined &&
          !(json.namespaces.profile.isAuthenticated.value == "false")
        ) {
          fetch("/_v/wrapper/api/user/userinfo", {
            method: "GET",
          })
            .then((response) => response.json())
            .then((user) => {
              fetch("/_v/wrapper/api/user/hasorders", {
                method: "GET",
              })
                .then((response) => response.json())
                .then((orders) => {
                  push(
                    dataLayer,
                    "feReady",
                    Object.keys(json.namespaces.profile).length > 0
                      ? "authenticated"
                      : "anonymous",
                    "",
                    "",
                    "",
                    userType(orders, user[0].isNewsletterOptIn),
                    pageType == "error" ? "other" : pageType
                  );
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          push(
            dataLayer,
            "feReady",
            "anonymous",
            "",
            "",
            "",
            "guest",
            pageType
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

interface feReadyProps {
  dataLayer: any;
  pageType: "staticPage" | "plp" | "pdp";
  pageTypeEvent:
    | "home"
    | "search"
    | "contact"
    | "detail"
    | "category"
    | "cart"
    | "checkout"
    | "purchase"
    | "other"
    | "error";
}

// const isFeReadyDone = (dataLayer: any) => {
//   const filterResult = dataLayer.filter(
//     (e: any) => e.event == "feReady" || e.event == "pageView"
//   );
//   return filterResult.length % 2 === 0;
// };

const FeReady: StorefrontFunctionComponent<feReadyProps> = ({
  dataLayer,
  pageType,
  pageTypeEvent,
}) => {
  const productContextValue = useProduct();
  const { searchQuery } = useSearchPage();
  const [countPages, setCountPages] = useState(false);
  const [href, setHref] = useState("");

  const updateState = (hrefUpdated: string) => {
    if (hrefUpdated == "" && countPages == false) {
      setHref(hrefUpdated);
    }
    if (hrefUpdated !== "" && hrefUpdated !== href) {
      setCountPages(!countPages);
    }
  };

  useEffect(() => {
    updateState(window.location.href);
    switch (pageType) {
      case "plp":
        if (!countPages) {
          feRPlp(searchQuery, dataLayer, pageTypeEvent);
        }
        break;
      case "pdp":
        if (
          isNewFeReadyPDP(
            getLastFeReady(dataLayer),
            productContextValue.product
          )
        ) {
          fePdp(productContextValue, dataLayer, pageTypeEvent);
        }
      default:
        fePages(productContextValue, searchQuery, dataLayer, pageTypeEvent);
    }
  }, [productContextValue.product, searchQuery, window.location]);
  return <></>;
};

FeReady.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};

export default FeReady;
