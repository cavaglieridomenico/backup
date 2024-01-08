export interface Item {
  itemTitle: string;
  hasImages: boolean;
  subItems: SubItems[];
}

interface SubItems {
  itemLink: string;
  itemTitle: string;
  isOneTrustLink: boolean;
  isExternalLink: boolean;
}
