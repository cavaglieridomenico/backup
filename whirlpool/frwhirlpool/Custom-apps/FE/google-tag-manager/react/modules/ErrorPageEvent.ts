const apiSearch = (query: string) => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json; charset=utf-8",
      },
    };
  
    return fetch("api/catalog_system/pub/products/search/" + query, options)
      .then((response) => response.json())
      .catch((err) => console.error(err));
  };

export function pushErrorPageEvent() {
    window.dataLayer.push({
        event: "errorPage",
        errorType: "404",
      });
  }

export function pushErrorPageEventEmptySearch() {
    const query = window.location.pathname.replace("/", "");
        apiSearch(query).then((response: any) => {
          if (
            response.length == 0 &&
            !window.location.href.includes("/recettes")
          ) {
            window.dataLayer.push({
              event: "errorPage",
              errorType: "No Search Result",
              errorQuery: query.replace("%20", ""),
            });
          } 
        });
}