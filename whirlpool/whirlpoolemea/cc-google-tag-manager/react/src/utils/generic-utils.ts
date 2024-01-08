export function getProductCategoryForList(productCategory: string) {
  const productCategoryForList = productCategory
    ?.split("_")
    [productCategory.split("_").length - 1].toLowerCase()
  return productCategoryForList
}
