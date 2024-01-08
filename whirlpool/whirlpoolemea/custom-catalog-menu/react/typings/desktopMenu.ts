export interface DesktopCatalogMenuProps {
  catalogLabel: string;
  catalogLabel_lang: string;
  catalogLabelLink: string;
  catalogLabelLink_lang: string;
  catalogRowLabel: CatalogRowLabel;
  weekDealsLabel: string,
  weekDealsLink: string,
  supportMenuLabel: string,
  supportMenuLink: string,
  items: Items[];
  brandItems: BrandItems[];
  appliancesColMaxItem: number;
  brandColMaxItem: number;
  srcImage: string;
  srcImageLink: any;
}
export interface CatalogRowLabel {
  isVisible: boolean;
  labelText: string;
  labelLink?: string;
}
export interface Items {
  itemTitle: string;
  itemTitle_lang: string;
  itemLink: string;
  items?: Items[];
}
export interface BrandItems {
  brandImage: string;
  categoryLabel: string;
  brandLink: string
  items?: Items[];
}
