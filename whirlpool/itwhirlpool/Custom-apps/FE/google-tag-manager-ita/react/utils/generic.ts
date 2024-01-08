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