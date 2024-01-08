//Function to check when filters were removed manually and then hide button clear filters
export const checkSearchString = (s: string) => {
  let splittedSearch: Array<string> = s.split("&");
  let firstPart: string = splittedSearch[0];
  switch(firstPart) {
    case "?map=category-1,category-2,category-3": return false;
    case "?map=category-1,category-2": return false;
    case "?map=category-1": return false;
    case "?map=brand": return false;
    case "?map=productClusterIds": return false;
    default: return true;
  }
};
//Function to clear all applied filters (this will reload the page)
export const clearFilters = () => {
  if (window.location !== undefined) {
    window.location.search = "";
  }
};