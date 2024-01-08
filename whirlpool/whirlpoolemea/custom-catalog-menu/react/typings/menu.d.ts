export interface CatalogMenuProps {
  catalogLabel: string;
  catalogLabel_lang: string;
  weekDealsLink: string;
  weekDealsLabel: string;
  supportMenuLink: string;
  supportMenuLabel: string;
  items: Item[];
  srcImage: string;
  srcImageLink: any;
  showSubCategoryArrow: boolean
}

export interface Item {
  itemTitle: string;
  itemLink: string;
}
