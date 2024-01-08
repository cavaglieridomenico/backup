import { Settings } from "../typings/settings"
import { Product } from "../typings/product"
import { ContentGroupingSecond } from "../typings/pageViewData"

export const mapping: { [index: string]: string } = {
  "laundry": "LD",
  "cooling": "CO",
  "cooking": "CK",
  "dishwashing": "DW",
  "airconditioning": "AC",
  "sparepartscategory": "SP"
}

export const contentGroupingSecondMapping: { [index: string]: ContentGroupingSecond } = {
  "LD": "Laundry",
  "CO": "Cooling",
  "CK": "Cooking",
  "DW": "Dishwashing",
  "AC": "Air Conditioning",
  "SP": "Spare Parts",
  "BD": "Bundle"
}

export const getMacroCategory = (product: Product, settings: Settings) => {
  if (!product.category) return undefined
  if (product.categoryTree.some(cat => cat.id == settings.accessoriesCategoryId)) return 'ACC'
  const categorySplitted = product.category.split('_')
  const macroCategory = categorySplitted[categorySplitted.length - 2]
  return mapping[macroCategory.toLowerCase()] || macroCategory
}

export const getContentGroupingSecond = (categoryAdWord?: string): ContentGroupingSecond | undefined => {
  
  if (!categoryAdWord) return undefined
  if (categoryAdWord.includes('_SP_') || categoryAdWord.endsWith("UK_SP")) return "Spare Parts"
  if (!categoryAdWord.includes('_FG_')) return "Accessories"
  if (categoryAdWord.includes('_FinishedGoods')) return "Other Products"

  const splittedCat = categoryAdWord.split('_')
  const macroCategory = splittedCat[splittedCat.length - 2]
  return contentGroupingSecondMapping[macroCategory] || 'Other Products'
}
