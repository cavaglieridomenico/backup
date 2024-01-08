import React, { useEffect, useState } from "react";
//@ts-ignore
import { useProduct } from "vtex.product-context";
//@ts-ignore
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";

export const userType = () => {
  // export const userType = () => {
  //   - guest
  // - lead (logged in user that did not give the opt in)
  // - prospect (logged in user that gave the consent to be contacted / OPTIN)
  // - customer (logged in user that purchased at least 1 item in the past)>

  // let userTypeValue = isNewsletterOptin ? "prospect" : "lead";
  // orders.toString() == "true" ? (userTypeValue = "customer") : null;
  return "guest";
};
const isNewFeReadyPlp = (dataLayer: any, searchContext: any) => {
  if (!searchContext.products) {
    return true;
  }
  var result = getLastFeReady(dataLayer);
  if (!result) {
    return true;
  }
  if (searchContext.products && searchContext.products.length == 0) {
    return result["product-category"] !== "";
  } else {
    return result["product-category"] !==
      searchContext.products[0].categoryId || result["product-name"] !== ""
      ? true
      : false;
  }
};
export const getLastFeReady = (dataLayer: any) => {
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

// const isMoreThenOneCategory = (products: any, firstCategoryId: string) => {
//   var resultFilter = products.filter(
//     (product: any) => product.categoryId == firstCategoryId
//   );
//   return resultFilter.length !== products.length;
// };
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
  let i = 0;
  let j = 0;

  dataLayer.filter((e: any) => {
    if (e.event == "feReady") {
      j = i;
    }
    i = i + 1;
  });

  dataLayer.splice(j, 1);

  return dataLayer.filter((e: any) => e.event == "feReady").length > 0;
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

const checkIfVtexBug = (location: any, pageType: any) => {
  let lastTwo = location.substr(location.length - 2);
  return lastTwo == "/p" && pageType == "category";
};

const push = (
  dataLayer: any,
  event: string,
  status: string,
  pCode: string,
  pName: string,
  pCategory: string,
  userType: string,
  pageType: string,
  location: string,
  page: string,
  referrer: string,
  title: string,
  contentGrouping: any,
  contentGroupingSecond: any
) => {
  if (
    !dataLayer.filter((e: any) => e.event == event && e.location == location)
      .length &&
    !checkIfVtexBug(location, pageType)
  ) {
    if (pCategory !== "") {
      getCategoryStringFromId(pCategory).then((response) => {
        const obj = {
          event,
          status,
          "product-code": pCode,
          "product-name": pName,
          "product-category": response.AdWordsRemarketingCode,
          userType,
          pageType,
          location,
          page,
          referrer,
          title,
          contentGrouping,
          contentGroupingSecond,
        };

        if (!isSameObject(dataLayer, obj)) {
          if (!checkisDone(dataLayer)) {
            dataLayer.push(obj);
          }
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
          location,
          page,
          referrer,
          title,
          contentGrouping,
          contentGroupingSecond,
        });
      }
    }
  }
};

const feRPlp = (
  searchContext: any,
  dataLayer: any,
  pageType: any,
  contentGrouping: any
) => {
  var done = false;
  //Check for the category
  const isCategory = () => {
    return (
      searchContext.variables.map
        .split(",")
        .filter((el: any) => el.indexOf("category") !== -1 || el === "c")
        .length > 0
    );
  };

  const getCategory = (map: any, value: any) => {
    let arrayTree: string[] = [];
    map.split(",").forEach((item: string, index: number) => {
      if (item == "c" || item.indexOf("category") !== -1) {
        arrayTree.push(value.split("/")[index].replaceAll("-", " "));
      }
    });
    return arrayTree;
  };

  const getCategoryId = (categories: string[], tree: any) => {
    let temp: any = [...tree];
    let id = -1;
    for (let i = 0; i < categories.length; i++) {
      let cat = decodeURIComponent(categories[i]).replace(
        /([\u0300-\u036f]|[^0-9a-zA-Z])/g,
        ""
      );
      if (i < categories.length - 1) {
        temp = temp.filter((dep: any) => dep.name == cat)[0]?.children;
      } else {
        id = temp
          ? temp.filter(
              (result: any) =>
                result.name
                  .normalize("NFD")
                  .replaceAll(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, "") == cat
            )[0]?.id
          : cat === "lodowki"
          ? 17
          : 18;
        // Zamrażarki id =18
        // lodowki id =17
      }
    }
    return id;
  };

  if (
    !!searchContext &&
    isCategory() &&
    //searchContext.products !== undefined &&
    isNewFeReadyPlp(dataLayer, searchContext)
  ) {
    let categories = getCategory(
      searchContext.variables.map,
      searchContext.variables.query
    );
    // fetch("/api/catalog_system/pub/category/tree/5", { method: "GET" })
    fetch("/_v/wrapper/api/catalog_system/pub/category/tree/5", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((tree) => {
        let categoryID = getCategoryId(categories, tree);
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
                // .then((user) => {
                .then(() => {
                  fetch("/_v/wrapper/api/user/hasorders", {
                    method: "GET",
                  })
                    .then((response) => response.json())
                    // .then((orders) => {
                    .then(() => {
                      push(
                        dataLayer,
                        "feReady",
                        Object.keys(json.namespaces.profile).length > 0
                          ? "authenticated"
                          : "anonymous",
                        "",
                        "",
                        categoryID.toString(),
                        userType(),
                        pageType,
                        window.location.href,
                        window.location.pathname,
                        window.location.origin,
                        document.title,
                        contentGrouping,
                        contentGroupingSecond()
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
                categoryID.toString(),
                "guest",
                pageType,
                window.location.href,
                window.location.pathname,
                window.location.origin,
                document.title,
                contentGrouping,
                contentGroupingSecond()
              );
              done = true;
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
  }

  return done;
};
const fePdp = (
  productContext: any,
  dataLayer: any,
  pageType: any,
  contentGrouping: any
) => {
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
            // .then((user) => {
            // .then((user) => {
            .then(() => {
              fetch("/_v/wrapper/api/user/hasorders", {
                method: "GET",
              })
                .then((response) => response.json())
                // .then((orders) => {
                .then(() => {
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
                    userType(),
                    pageType,
                    window.location.href,
                    window.location.pathname,
                    window.location.origin,
                    document.title,
                    contentGrouping,
                    contentGroupingSecond()
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
            pageType,
            window.location.href,
            window.location.pathname,
            window.location.origin,
            document.title,
            contentGrouping,
            contentGroupingSecond()
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
export const fePages = async (
  productContext: any,
  searchContext: any,
  dataLayer: any,
  pageType: any,
  contentGrouping: any
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
            // .then((user) => {
            .then(() => {
              fetch("/_v/wrapper/api/user/hasorders", {
                method: "GET",
              })
                .then((response) => response.json())
                // .then((orders) => {
                .then(() => {
                  push(
                    dataLayer,
                    "feReady",
                    Object.keys(json.namespaces.profile).length > 0
                      ? "authenticated"
                      : "anonymous",
                    "",
                    "",
                    "",
                    userType(),
                    pageType == "error" ? "other" : pageType,
                    window.location.href,
                    window.location.pathname,
                    window.location.origin,
                    document.title,
                    contentGrouping,
                    contentGroupingSecond()
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
            pageType,
            window.location.href,
            window.location.pathname,
            window.location.origin,
            document.title,
            contentGrouping,
            contentGroupingSecond()
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
    | "campaign"
    | "error";
  contentGrouping:
    | "Homepage"
    | "Company"
    | "Catalog"
    | "Marketing"
    | "Support"
    | "Personal"
    | "Errors"
    | "News"
    | "Recipes"
    | "Events"
    | "Promotions"
    | "Other";
}

// const isFeReadyDone = (dataLayer: any) => {
//   const filterResult = dataLayer.filter(
//     (e: any) => e.event == "feReady" || e.event == "pageView"
//   );
//   return filterResult.length % 2 === 0;
// };

const contentGroupingSecond = () => {
  let urlWithoutQueryStrings = window.location.pathname;
  let breadcrumb = document.querySelectorAll(".vtex-breadcrumb-1-x-link");

  let category = breadcrumb[2]?.innerHTML;

  if (
    urlWithoutQueryStrings.includes("/gotowanie") ||
    (urlWithoutQueryStrings.endsWith("/p") && category == "gotowanie")
  ) {
    //I'm in cooking
    return "Cooking";
  } else if (
    urlWithoutQueryStrings.includes("/pranie/") ||
    (urlWithoutQueryStrings.endsWith("/p") && category == "pranie")
  ) {
    //I'm in laundry
    return "Laundry";
  } else if (
    urlWithoutQueryStrings.includes("/chlodnictwo") ||
    (urlWithoutQueryStrings.endsWith("/p") && category == "chlodnictwo")
  ) {
    //I'm in cooling
    return "Cooling";
  } else if (
    urlWithoutQueryStrings.includes("/zmywanie") ||
    (urlWithoutQueryStrings.endsWith("/p") && category == "zmywanie")
  ) {
    //I'm in dishwash
    return "Dishwashing";
  } else if (urlWithoutQueryStrings.includes("/ricette")) {
    return "Other";
  } else {
    return "";
  }
};

const FeReady: StorefrontFunctionComponent<feReadyProps> = ({
  dataLayer,
  pageType,
  pageTypeEvent,
  contentGrouping,
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
          feRPlp(searchQuery, dataLayer, pageTypeEvent, contentGrouping);
        }
        break;
      case "pdp":
        if (
          isNewFeReadyPDP(
            getLastFeReady(dataLayer),
            productContextValue.product
          )
        ) {
          fePdp(productContextValue, dataLayer, pageTypeEvent, contentGrouping);
        }
        break;
      default:
        fePages(
          productContextValue,
          searchQuery,
          dataLayer,
          pageTypeEvent,
          contentGrouping
        );
        break;
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
