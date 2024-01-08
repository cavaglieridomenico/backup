export function pushErrorPageEvent() {
    window.dataLayer.push({
        event: "errorPage",
        errorType: "404",
      });
}

export function pushErrorPageEventEmptySearch() {
    const query = window.location.pathname.replace("/", "");
  
    window.dataLayer.push({
      event: "errorPage",
      errorType: "No Search Result",
      errorQuery: query.replace("%20", ""),
    });
  }