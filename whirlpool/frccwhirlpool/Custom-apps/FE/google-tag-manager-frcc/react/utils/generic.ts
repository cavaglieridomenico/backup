// Check if you are in error page
export function isErrorPage() {
    const runtimePage = (window as any).__RUNTIME__.page
    //console.log("currentRouteId", currentRouteId)
    const isError = !runtimePage || runtimePage?.includes("store.not-found")
    //console.log('isError', isError)
    return isError
}


export function isUpperCase(str: string) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
}

/**
 * Get path from URL
 * @param {string} productCategory
 * @return {string} productCategory in lower case 
 * 
 * Input: SC_D2C_FR_FG_CO_Freezing
 * Output: freezing
 */
export function getProductCategoryForList(productCategory: string) {
  
    const productCategoryForList = productCategory?.split('_')[productCategory.split('_').length - 1].toLowerCase();
    return productCategoryForList
}