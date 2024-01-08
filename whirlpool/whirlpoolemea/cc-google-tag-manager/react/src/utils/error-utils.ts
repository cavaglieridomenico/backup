// Remove pushErrorPageEventEmptySearch once UA is deprecated
export function pushErrorPageEventEmptySearch() {
  const query = window.location.pathname.replace("/", "");

  window.dataLayer.push({
    event: "errorPage",
    errorType: "No Search Result",
    errorQuery: query.replace("%20", ""),
  });
}