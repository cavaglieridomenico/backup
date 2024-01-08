export interface DesktopCatalogMenuProps {
  catalogLabel: string;
  catalogLabelLink: string;
  catalogRowLabel: CatalogRowLabel;
  items: Items[];
  brandItems: BrandItems[];
  src: any;
}
export interface CatalogRowLabel {
  isVisible: boolean;
  labelText: string;
  labelLink?: string;
}
export interface Items {
  itemTitle: string;
  itemLink: string;
  items?: Items[];
}
export interface BrandItems {
  brandImage: string;
  brandLink: string;
  items?: Items[];
}
